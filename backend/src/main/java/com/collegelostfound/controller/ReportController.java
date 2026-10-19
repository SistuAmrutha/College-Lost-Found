package com.collegelostfound.controller;

import com.collegelostfound.dto.CreateReportRequest;
import com.collegelostfound.dto.ReportResponse;
import com.collegelostfound.dto.UpdateReportStatusRequest;
import com.collegelostfound.model.ReportStatus;
import com.collegelostfound.security.UserPrincipal;
import com.collegelostfound.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@Tag(name = "Reports", description = "Endpoints for reporting inappropriate or suspicious listings and moderation")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping("/reports")
    @Operation(summary = "Submit a moderation report for a suspicious/inappropriate item")
    public ResponseEntity<ReportResponse> createReport(
            @Valid @RequestBody CreateReportRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        ReportResponse response = reportService.createReport(request, currentUser);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/admin/reports")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "List all moderation reports (admin only)")
    public ResponseEntity<Page<ReportResponse>> getReports(
            @RequestParam(required = false) ReportStatus status,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(reportService.getAllReports(status, pageable));
    }

    @PatchMapping("/admin/reports/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Resolve or dismiss a moderation report (admin only)")
    public ResponseEntity<ReportResponse> updateReportStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateReportStatusRequest request,
            @AuthenticationPrincipal UserPrincipal adminUser) {
        return ResponseEntity.ok(reportService.updateReportStatus(id, request, adminUser));
    }
}
