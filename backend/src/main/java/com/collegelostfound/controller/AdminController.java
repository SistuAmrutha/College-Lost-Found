package com.collegelostfound.controller;

import com.collegelostfound.dto.AdminDashboardStatsResponse;
import com.collegelostfound.dto.ApiResponse;
import com.collegelostfound.dto.UpdateUserStatusRequest;
import com.collegelostfound.dto.UserResponse;
import com.collegelostfound.model.AuditLog;
import com.collegelostfound.model.Role;
import com.collegelostfound.security.UserPrincipal;
import com.collegelostfound.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@Tag(name = "Admin Operations", description = "Endpoints restricted to administrative users for system moderation and audit")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get system-wide analytics and moderation counts")
    public ResponseEntity<AdminDashboardStatsResponse> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/users")
    @Operation(summary = "List and search all college users")
    public ResponseEntity<Page<UserResponse>> getUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Role role,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(adminService.getAllUsers(search, role, pageable));
    }

    @PatchMapping("/users/{id}/status")
    @Operation(summary = "Suspend or reactivate a student user account")
    public ResponseEntity<UserResponse> updateUserStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateUserStatusRequest request,
            @AuthenticationPrincipal UserPrincipal adminUser) {
        return ResponseEntity.ok(adminService.updateUserStatus(id, request.getStatus(), adminUser));
    }

    @DeleteMapping("/items/{id}")
    @Operation(summary = "Administratively remove an inappropriate or fraudulent listing")
    public ResponseEntity<ApiResponse> deleteItem(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal adminUser) {
        adminService.deleteItemAsAdmin(id, adminUser);
        return ResponseEntity.ok(new ApiResponse(true, "Listing removed by administrator"));
    }

    @GetMapping("/audit-logs")
    @Operation(summary = "View security and administrative audit log trail")
    public ResponseEntity<Page<AuditLog>> getAuditLogs(@PageableDefault(size = 30) Pageable pageable) {
        return ResponseEntity.ok(adminService.getAuditLogs(pageable));
    }
}
