package com.collegelostfound.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "reports")
@CompoundIndex(name = "item_reporter_idx", def = "{'itemId': 1, 'reporterId': 1}")
public class Report {

    @Id
    private String id;

    @Indexed
    private String itemId;

    private String itemTitle;

    @Indexed
    private String reporterId;

    private String reporterName;

    private String reason; // INAPPROPRIATE_CONTENT, FALSE_INFORMATION, DUPLICATE_LISTING, SUSPICIOUS_ACTIVITY, PRIVACY_CONCERN, OTHER

    private String description;

    private ReportStatus status = ReportStatus.PENDING;

    private String reviewedBy;

    private String adminNotes;

    @CreatedDate
    @Indexed
    private Instant createdAt = Instant.now();

    private Instant resolvedAt;

    public Report() {
    }

    public Report(String itemId, String itemTitle, String reporterId, String reporterName, String reason, String description) {
        this.itemId = itemId;
        this.itemTitle = itemTitle;
        this.reporterId = reporterId;
        this.reporterName = reporterName;
        this.reason = reason;
        this.description = description;
        this.status = ReportStatus.PENDING;
        this.createdAt = Instant.now();
    }

    // Getters and Setters
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
