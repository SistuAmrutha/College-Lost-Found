package com.collegelostfound.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateConversationRequest {

    @NotBlank(message = "Recipient user ID is required")
    private String recipientId;

    private String relatedItemId;

    @NotBlank(message = "Message text is required")
    @Size(min = 1, max = 2000)
    private String message;

    public CreateConversationRequest() {}

    public String getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(String recipientId) {
        this.recipientId = recipientId;
    }

    public String getRelatedItemId() {
        return relatedItemId;
    }

    public void setRelatedItemId(String relatedItemId) {
        this.relatedItemId = relatedItemId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
