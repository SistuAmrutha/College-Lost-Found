package com.collegelostfound.dto;

import com.collegelostfound.model.ItemStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateItemStatusRequest {

    @NotNull(message = "Status cannot be null")
    private ItemStatus status;

    public UpdateItemStatusRequest() {}

    public UpdateItemStatusRequest(ItemStatus status) {
        this.status = status;
    }

    public ItemStatus getStatus() {
        return status;
    }

    public void setStatus(ItemStatus status) {
        this.status = status;
    }
}
