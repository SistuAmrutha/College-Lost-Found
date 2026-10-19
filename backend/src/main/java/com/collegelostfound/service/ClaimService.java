package com.collegelostfound.service;

import com.collegelostfound.dto.ClaimResponse;
import com.collegelostfound.dto.CreateClaimRequest;
import com.collegelostfound.dto.UpdateClaimStatusRequest;
import com.collegelostfound.exception.BadRequestException;
import com.collegelostfound.exception.ForbiddenException;
import com.collegelostfound.exception.ResourceNotFoundException;
import com.collegelostfound.model.*;
import com.collegelostfound.repository.ClaimRepository;
import com.collegelostfound.repository.ItemRepository;
import com.collegelostfound.security.UserPrincipal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final ItemRepository itemRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    public ClaimService(ClaimRepository claimRepository,
                        ItemRepository itemRepository,
                        NotificationService notificationService,
                        AuditLogService auditLogService) {
        this.claimRepository = claimRepository;
        this.itemRepository = itemRepository;
        this.notificationService = notificationService;
        this.auditLogService = auditLogService;
    }

    public ClaimResponse createClaim(CreateClaimRequest request, UserPrincipal currentUser) {
        Item item = itemRepository.findById(request.getItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        if (item.getOwnerId().equals(currentUser.getId())) {
            throw new BadRequestException("You cannot submit a claim on your own listing");
        }

        if (item.getStatus() == ItemStatus.RETURNED || item.getStatus() == ItemStatus.CLOSED) {
            throw new BadRequestException("This item is already " + item.getStatus().name().toLowerCase() + " and cannot be claimed");
        }

        // Check if user already submitted a pending claim for this item
        Optional<Claim> existingClaim = claimRepository.findByItemIdAndClaimantId(item.getId(), currentUser.getId());
        if (existingClaim.isPresent() && existingClaim.get().getStatus() == ClaimStatus.PENDING) {
            throw new BadRequestException("You already have an active pending claim for this item");
        }

        Claim claim = new Claim(
                item.getId(),
                item.getTitle(),
                currentUser.getId(),
                currentUser.getFullName(),
                request.getPrivateMessage().trim(),
                request.getOwnershipVerification().trim()
        );

        Claim savedClaim = claimRepository.save(claim);

        // Update item status to CLAIM_PENDING if currently OPEN
        if (item.getStatus() == ItemStatus.OPEN) {
            item.setStatus(ItemStatus.CLAIM_PENDING);
            item.setUpdatedAt(Instant.now());
            itemRepository.save(item);
        }

        // Notify item owner
        notificationService.createNotification(
                item.getOwnerId(),
                NotificationType.CLAIM_SUBMITTED,
                "New Claim Submitted",
                currentUser.getFullName() + " submitted a claim for your item: " + item.getTitle(),
                savedClaim.getId(),
                "CLAIM"
        );

        auditLogService.log(currentUser.getId(), currentUser.getUsername(), "CLAIM_SUBMITTED", "CLAIM", savedClaim.getId(),
                "Claim submitted for item " + item.getId());

        return ClaimResponse.fromClaim(savedClaim, true);
    }

    public Page<ClaimResponse> getMyClaims(UserPrincipal currentUser, Pageable pageable) {
        return claimRepository.findByClaimantId(currentUser.getId(), pageable)
                .map(claim -> ClaimResponse.fromClaim(claim, true));
    }

    public List<ClaimResponse> getItemClaims(String itemId, UserPrincipal currentUser) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        boolean isOwner = item.getOwnerId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ROLE_ADMIN;

        if (!isOwner && !isAdmin) {
            throw new ForbiddenException("Only the item owner or administrator can view claims for this item");
        }

        return claimRepository.findByItemId(itemId).stream()
                .map(claim -> ClaimResponse.fromClaim(claim, true))
                .collect(Collectors.toList());
    }

    public ClaimResponse updateClaimStatus(String claimId, UpdateClaimStatusRequest request, UserPrincipal currentUser) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found"));

        Item item = itemRepository.findById(claim.getItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Associated item not found"));

        boolean isOwner = item.getOwnerId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ROLE_ADMIN;

        if (!isOwner && !isAdmin) {
            throw new ForbiddenException("Only the item owner or administrator can update claim status");
        }

        ClaimStatus newStatus = request.getStatus();
        claim.setStatus(newStatus);
        claim.setReviewedBy(currentUser.getFullName());
        claim.setUpdatedAt(Instant.now());

        Claim savedClaim = claimRepository.save(claim);

        if (newStatus == ClaimStatus.APPROVED) {
            // Mark item as RETURNED
            item.setStatus(ItemStatus.RETURNED);
            item.setReturnedAt(Instant.now());
            item.setUpdatedAt(Instant.now());
            itemRepository.save(item);

            // Reject other pending claims for this item
            List<Claim> otherClaims = claimRepository.findByItemId(item.getId());
            for (Claim other : otherClaims) {
                if (!other.getId().equals(claim.getId()) && other.getStatus() == ClaimStatus.PENDING) {
                    other.setStatus(ClaimStatus.REJECTED);
                    other.setReviewedBy(currentUser.getFullName());
                    other.setUpdatedAt(Instant.now());
                    claimRepository.save(other);

                    notificationService.createNotification(
                            other.getClaimantId(),
                            NotificationType.CLAIM_REJECTED,
                            "Claim Closed",
                            "The item '" + item.getTitle() + "' was successfully returned to another claimant.",
                            other.getId(),
                            "CLAIM"
                    );
                }
            }

            notificationService.createNotification(
                    claim.getClaimantId(),
                    NotificationType.CLAIM_APPROVED,
                    "Claim Approved!",
                    "Your claim for '" + item.getTitle() + "' has been approved by the owner.",
                    claim.getId(),
                    "CLAIM"
            );
        } else if (newStatus == ClaimStatus.REJECTED) {
            // Check if any other pending claims remain
            List<Claim> otherClaims = claimRepository.findByItemId(item.getId());
            boolean hasOtherPending = otherClaims.stream()
                    .anyMatch(c -> !c.getId().equals(claim.getId()) && c.getStatus() == ClaimStatus.PENDING);

            if (!hasOtherPending && item.getStatus() == ItemStatus.CLAIM_PENDING) {
                item.setStatus(ItemStatus.OPEN);
                item.setUpdatedAt(Instant.now());
                itemRepository.save(item);
            }

            notificationService.createNotification(
                    claim.getClaimantId(),
                    NotificationType.CLAIM_REJECTED,
                    "Claim Rejected",
                    "Your claim for '" + item.getTitle() + "' was not approved.",
                    claim.getId(),
                    "CLAIM"
            );
        }

        auditLogService.log(currentUser.getId(), currentUser.getUsername(), "CLAIM_STATUS_UPDATED", "CLAIM", claim.getId(),
                "Claim status changed to " + newStatus);

        return ClaimResponse.fromClaim(savedClaim, true);
    }
}
