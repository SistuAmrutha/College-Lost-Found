package com.collegelostfound.dto;

import com.collegelostfound.model.ClaimStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateClaimStatusRequest {

    @NotNull(message = "Claim status is required")
    private ClaimStatus status;

    public UpdateClaimStatusRequest() {}

    public UpdateClaimStatusRequest(ClaimStatus status) {
        this.status = status;
    }

    public ClaimStatus getStatus() {
        return status;
    }

    public void setStatus(ClaimStatus status) {
        this.status = status;
    }
}
