package com.collegelostfound.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateReportRequest {

    @NotBlank(message = "Item ID is required")
    private String itemId;

    @NotBlank(message = "Report reason is required")
    private String reason; // INAPPROPRIATE_CONTENT, FALSE_INFORMATION, DUPLICATE_LISTING, SUSPICIOUS_ACTIVITY, PRIVACY_CONCERN, OTHER

    @NotBlank(message = "Report description is required")
    @Size(min = 5, max = 1000)
    private String description;

    public CreateReportRequest() {}

    public String getItemId() {
        return itemId;
    }

    public void setItemId(String itemId) {
        this.itemId = itemId;
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
}
