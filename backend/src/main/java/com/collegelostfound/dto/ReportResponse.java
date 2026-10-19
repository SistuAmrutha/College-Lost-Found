package com.collegelostfound.dto;

import com.collegelostfound.model.Report;
import com.collegelostfound.model.ReportStatus;

import java.time.Instant;

public class ReportResponse {
    private String id;
    private String itemId;
    private String itemTitle;
    private String reporterId;
    private String reporterName;
    private String reason;
    private String description;
    private ReportStatus status;
    private String reviewedBy;
    private String adminNotes;
    private Instant createdAt;
    private Instant resolvedAt;

    public ReportResponse() {}

    public static ReportResponse fromReport(Report report) {
        if (report == null) return null;
        ReportResponse res = new ReportResponse();
        res.setId(report.getId());
        res.setItemId(report.getItemId());
        res.setItemTitle(report.getItemTitle());
        res.setReporterId(report.getReporterId());
        res.setReporterName(report.getReporterName());
        res.setReason(report.getReason());
        res.setDescription(report.getDescription());
        res.setStatus(report.getStatus());
        res.setReviewedBy(report.getReviewedBy());
        res.setAdminNotes(report.getAdminNotes());
        res.setCreatedAt(report.getCreatedAt());
        res.setResolvedAt(report.getResolvedAt());
        return res;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getItemId() {
        return itemId;
    }

    public void setItemId(String itemId) {
        this.itemId = itemId;
    }

    public String getItemTitle() {
        return itemTitle;
    }

    public void setItemTitle(String itemTitle) {
        this.itemTitle = itemTitle;
    }

    public String getReporterId() {
        return reporterId;
    }

    public void setReporterId(String reporterId) {
        this.reporterId = reporterId;
    }

    public String getReporterName() {
        return reporterName;
    }

    public void setReporterName(String reporterName) {
        this.reporterName = reporterName;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ReportStatus getStatus() {
        return status;
    }

    public void setStatus(ReportStatus status) {
        this.status = status;
    }

    public String getReviewedBy() {
        return reviewedBy;
    }

    public void setReviewedBy(String reviewedBy) {
        this.reviewedBy = reviewedBy;
    }

    public String getAdminNotes() {
        return adminNotes;
    }

    public void setAdminNotes(String adminNotes) {
        this.adminNotes = adminNotes;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(Instant resolvedAt) {
        this.resolvedAt = resolvedAt;
    }
}
