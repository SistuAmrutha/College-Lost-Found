package com.collegelostfound.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateClaimRequest {

    @NotBlank(message = "Item ID is required")
    private String itemId;

    @NotBlank(message = "Message to item finder/owner is required")
    @Size(min = 5, max = 1000, message = "Message must be between 5 and 1000 characters")
    private String privateMessage;

    @NotBlank(message = "Ownership verification description is required")
    @Size(min = 5, max = 1000, message = "Ownership verification must be between 5 and 1000 characters")
    private String ownershipVerification;

    public CreateClaimRequest() {}

    public String getItemId() {
        return itemId;
    }

    public void setItemId(String itemId) {
        this.itemId = itemId;
    }

    public String getPrivateMessage() {
        return privateMessage;
    }

    public void setPrivateMessage(String privateMessage) {
        this.privateMessage = privateMessage;
    }

    public String getOwnershipVerification() {
        return ownershipVerification;
    }

    public void setOwnershipVerification(String ownershipVerification) {
        this.ownershipVerification = ownershipVerification;
    }
}
