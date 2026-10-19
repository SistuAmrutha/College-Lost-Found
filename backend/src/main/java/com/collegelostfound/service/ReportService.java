package com.collegelostfound.service;

import com.collegelostfound.dto.CreateReportRequest;
import com.collegelostfound.dto.ReportResponse;
import com.collegelostfound.dto.UpdateReportStatusRequest;
import com.collegelostfound.exception.BadRequestException;
import com.collegelostfound.exception.ResourceNotFoundException;
import com.collegelostfound.model.*;
import com.collegelostfound.repository.ItemRepository;
import com.collegelostfound.repository.ReportRepository;
import com.collegelostfound.security.UserPrincipal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final ItemRepository itemRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    public ReportService(ReportRepository reportRepository,
                         ItemRepository itemRepository,
                         NotificationService notificationService,
                         AuditLogService auditLogService) {
        this.reportRepository = reportRepository;
        this.itemRepository = itemRepository;
        this.notificationService = notificationService;
        this.auditLogService = auditLogService;
    }

    public ReportResponse createReport(CreateReportRequest request, UserPrincipal currentUser) {
        Item item = itemRepository.findById(request.getItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        if (reportRepository.existsByItemIdAndReporterId(item.getId(), currentUser.getId())) {
            throw new BadRequestException("You have already submitted a report for this listing");
        }

        Report report = new Report(
                item.getId(),
                item.getTitle(),
                currentUser.getId(),
                currentUser.getFullName(),
                request.getReason(),
                request.getDescription().trim()
        );

        Report saved = reportRepository.save(report);

        auditLogService.log(currentUser.getId(), currentUser.getUsername(), "REPORT_SUBMITTED", "REPORT", saved.getId(),
                "Report submitted for item " + item.getId() + " - Reason: " + request.getReason());

        return ReportResponse.fromReport(saved);
    }

    public Page<ReportResponse> getAllReports(ReportStatus status, Pageable pageable) {
        if (status != null) {
            return reportRepository.findByStatusOrderByCreatedAtDesc(status, pageable)
                    .map(ReportResponse::fromReport);
        }
        return reportRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(ReportResponse::fromReport);
    }

    public ReportResponse updateReportStatus(String reportId, UpdateReportStatusRequest request, UserPrincipal adminUser) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));

        report.setStatus(request.getStatus());
        report.setReviewedBy(adminUser.getFullName());
        report.setAdminNotes(request.getAdminNotes());
        report.setResolvedAt(Instant.now());

        Report saved = reportRepository.save(report);

        // Notify reporter
        notificationService.createNotification(
                report.getReporterId(),
                NotificationType.REPORT_REVIEWED,
                "Report Reviewed",
                "Your report regarding listing '" + report.getItemTitle() + "' has been " + request.getStatus().name().toLowerCase() + ".",
                saved.getId(),
                "REPORT"
        );

        auditLogService.log(adminUser.getId(), adminUser.getUsername(), "REPORT_STATUS_UPDATED", "REPORT", saved.getId(),
                "Admin updated report to " + request.getStatus() + (request.getAdminNotes() != null ? " (" + request.getAdminNotes() + ")" : ""));

        return ReportResponse.fromReport(saved);
    }
}
