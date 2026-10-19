package com.collegelostfound.dto;

import com.collegelostfound.model.ReportStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateReportStatusRequest {

    @NotNull(message = "Status is required")
    private ReportStatus status;

    private String adminNotes;

    public UpdateReportStatusRequest() {}

    public UpdateReportStatusRequest(ReportStatus status, String adminNotes) {
        this.status = status;
        this.adminNotes = adminNotes;
    }

    public ReportStatus getStatus() {
        return status;
    }

    public void setStatus(ReportStatus status) {
        this.status = status;
    }

    public String getAdminNotes() {
        return adminNotes;
    }

    public void setAdminNotes(String adminNotes) {
        this.adminNotes = adminNotes;
    }
}
