package com.collegelostfound;

import com.collegelostfound.dto.ClaimResponse;
import com.collegelostfound.dto.CreateClaimRequest;
import com.collegelostfound.dto.UpdateClaimStatusRequest;
import com.collegelostfound.exception.BadRequestException;
import com.collegelostfound.model.*;
import com.collegelostfound.repository.ClaimRepository;
import com.collegelostfound.repository.ItemRepository;
import com.collegelostfound.security.UserPrincipal;
import com.collegelostfound.service.AuditLogService;
import com.collegelostfound.service.ClaimService;
import com.collegelostfound.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ClaimServiceTest {

    @Mock
    private ClaimRepository claimRepository;

    @Mock
    private ItemRepository itemRepository;

    @Mock
    private NotificationService notificationService;

    @Mock
    private AuditLogService auditLogService;

    @InjectMocks
    private ClaimService claimService;

    private UserPrincipal claimant;
    private UserPrincipal owner;
    private Item foundItem;

    @BeforeEach
    void setUp() {
        claimant = new UserPrincipal("claimant1", "Priya Sharma", "priya@college.edu", "pass", Role.ROLE_STUDENT, AccountStatus.ACTIVE);
        owner = new UserPrincipal("owner1", "Alex Rivera", "alex@college.edu", "pass", Role.ROLE_STUDENT, AccountStatus.ACTIVE);

        foundItem = new Item("Blue Bottle", "Found on desk", ItemType.FOUND, "Water Bottles", null,
                "Library", "2026-10-10", null, null, null, "owner1", "Alex Rivera");
        foundItem.setId("item1");
    }

    @Test
    void createClaim_OnOwnItem_ThrowsBadRequest() {
        CreateClaimRequest request = new CreateClaimRequest();
        request.setItemId("item1");
        request.setPrivateMessage("This is mine");
        request.setOwnershipVerification("Proof details");

        when(itemRepository.findById("item1")).thenReturn(Optional.of(foundItem));

        // Owner trying to claim their own item
        assertThrows(BadRequestException.class, () -> claimService.createClaim(request, owner));
    }

    @Test
    void createClaim_Success() {
        CreateClaimRequest request = new CreateClaimRequest();
        request.setItemId("item1");
        request.setPrivateMessage("I lost this bottle yesterday");
        request.setOwnershipVerification("It has a GitHub sticker on the back");

        when(itemRepository.findById("item1")).thenReturn(Optional.of(foundItem));
        when(claimRepository.findByItemIdAndClaimantId("item1", "claimant1")).thenReturn(Optional.empty());

        Claim savedClaim = new Claim("item1", "Blue Bottle", "claimant1", "Priya Sharma",
                request.getPrivateMessage(), request.getOwnershipVerification());
        savedClaim.setId("claim123");
        when(claimRepository.save(any(Claim.class))).thenReturn(savedClaim);

        ClaimResponse response = claimService.createClaim(request, claimant);

        assertNotNull(response);
        assertEquals("claim123", response.getId());
        assertEquals(ClaimStatus.PENDING, response.getStatus());
        verify(notificationService).createNotification(eq("owner1"), any(), any(), any(), eq("claim123"), eq("CLAIM"));
    }

    @Test
    void updateClaimStatus_Approve_UpdatesItemToReturned() {
        Claim claim = new Claim("item1", "Blue Bottle", "claimant1", "Priya Sharma", "Msg", "Proof");
        claim.setId("claim123");

        when(claimRepository.findById("claim123")).thenReturn(Optional.of(claim));
        when(itemRepository.findById("item1")).thenReturn(Optional.of(foundItem));
        when(claimRepository.save(any(Claim.class))).thenReturn(claim);
        when(claimRepository.findByItemId("item1")).thenReturn(Collections.singletonList(claim));

        UpdateClaimStatusRequest updateReq = new UpdateClaimStatusRequest(ClaimStatus.APPROVED);
        ClaimResponse response = claimService.updateClaimStatus("claim123", updateReq, owner);

        assertNotNull(response);
        assertEquals(ClaimStatus.APPROVED, response.getStatus());
        assertEquals(ItemStatus.RETURNED, foundItem.getStatus());
        verify(itemRepository).save(foundItem);
    }
}
