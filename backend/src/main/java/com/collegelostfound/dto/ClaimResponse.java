package com.collegelostfound.dto;

import com.collegelostfound.model.Claim;
import com.collegelostfound.model.ClaimStatus;

import java.time.Instant;

public class ClaimResponse {
    private String id;
    private String itemId;
    private String itemTitle;
    private String claimantId;
    private String claimantName;
    private String privateMessage;
    private String ownershipVerification;
    private ClaimStatus status;
    private String reviewedBy;
    private Instant createdAt;
    private Instant updatedAt;

    public ClaimResponse() {}

    public static ClaimResponse fromClaim(Claim claim, boolean isAuthorizedViewer) {
        if (claim == null) return null;
        ClaimResponse res = new ClaimResponse();
        res.setId(claim.getId());
        res.setItemId(claim.getItemId());
        res.setItemTitle(claim.getItemTitle());
        res.setClaimantId(claim.getClaimantId());
        res.setClaimantName(claim.getClaimantName());
        res.setStatus(claim.getStatus());
        res.setReviewedBy(claim.getReviewedBy());
        res.setCreatedAt(claim.getCreatedAt());
        res.setUpdatedAt(claim.getUpdatedAt());

        if (isAuthorizedViewer) {
            res.setPrivateMessage(claim.getPrivateMessage());
            res.setOwnershipVerification(claim.getOwnershipVerification());
        } else {
            res.setPrivateMessage("Hidden for privacy");
            res.setOwnershipVerification("Hidden for privacy");
        }
        return res;
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

    public String getClaimantId() {
        return claimantId;
    }

    public void setClaimantId(String claimantId) {
        this.claimantId = claimantId;
    }

    public String getClaimantName() {
        return claimantName;
    }

    public void setClaimantName(String claimantName) {
        this.claimantName = claimantName;
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

    public ClaimStatus getStatus() {
        return status;
    }

    public void setStatus(ClaimStatus status) {
        this.status = status;
    }

    public String getReviewedBy() {
        return reviewedBy;
    }

    public void setReviewedBy(String reviewedBy) {
        this.reviewedBy = reviewedBy;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
