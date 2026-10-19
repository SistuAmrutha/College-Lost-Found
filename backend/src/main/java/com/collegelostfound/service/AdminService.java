package com.collegelostfound.service;

import com.collegelostfound.dto.AdminDashboardStatsResponse;
import com.collegelostfound.dto.UserResponse;
import com.collegelostfound.exception.BadRequestException;
import com.collegelostfound.exception.ResourceNotFoundException;
import com.collegelostfound.model.*;
import com.collegelostfound.repository.*;
import com.collegelostfound.security.UserPrincipal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final ItemRepository itemRepository;
    private final ReportRepository reportRepository;
    private final ClaimRepository claimRepository;
    private final AuditLogRepository auditLogRepository;
    private final AuditLogService auditLogService;

    public AdminService(UserRepository userRepository,
                        ItemRepository itemRepository,
                        ReportRepository reportRepository,
                        ClaimRepository claimRepository,
                        AuditLogRepository auditLogRepository,
                        AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.itemRepository = itemRepository;
        this.reportRepository = reportRepository;
        this.claimRepository = claimRepository;
        this.auditLogRepository = auditLogRepository;
        this.auditLogService = auditLogService;
    }

    public AdminDashboardStatsResponse getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalListings = itemRepository.count();
        long lostListings = itemRepository.countByType(ItemType.LOST);
        long foundListings = itemRepository.countByType(ItemType.FOUND);
        long returnedItems = itemRepository.countByStatus(ItemStatus.RETURNED);
        long pendingReports = reportRepository.countByStatus(ReportStatus.PENDING);
        long pendingClaims = claimRepository.countByStatus(ClaimStatus.PENDING);

        return new AdminDashboardStatsResponse(
                totalUsers, totalListings, lostListings, foundListings, returnedItems, pendingReports, pendingClaims
        );
    }

    public Page<UserResponse> getAllUsers(String search, Role role, Pageable pageable) {
        Page<User> users;
        if (StringUtils.hasText(search)) {
            users = userRepository.findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(search, search, pageable);
        } else if (role != null) {
            users = userRepository.findByRole(role, pageable);
        } else {
            users = userRepository.findAll(pageable);
        }

        return users.map(u -> UserResponse.fromUser(u, true));
    }

    public UserResponse updateUserStatus(String userId, AccountStatus status, UserPrincipal adminUser) {
        if (userId.equals(adminUser.getId())) {
            throw new BadRequestException("You cannot change your own account status");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setAccountStatus(status);
        User saved = userRepository.save(user);

        auditLogService.log(adminUser.getId(), adminUser.getUsername(), "USER_STATUS_UPDATED", "USER", userId,
                "Updated user account status to " + status);

        return UserResponse.fromUser(saved, true);
    }

    public void deleteItemAsAdmin(String itemId, UserPrincipal adminUser) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        itemRepository.delete(item);

        auditLogService.log(adminUser.getId(), adminUser.getUsername(), "ADMIN_ITEM_DELETED", "ITEM", itemId,
                "Admin removed listing: " + item.getTitle());
    }

    public Page<AuditLog> getAuditLogs(Pageable pageable) {
        return auditLogRepository.findAllByOrderByCreatedAtDesc(pageable);
    }
}
