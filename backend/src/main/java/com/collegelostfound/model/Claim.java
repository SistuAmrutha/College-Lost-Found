package com.collegelostfound.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "claims")
public class Claim {

    @Id
    private String id;

    @Indexed
    private String itemId;

    private String itemTitle;

    @Indexed
    private String claimantId;

    private String claimantName;

    private String privateMessage;

    private String ownershipVerification;

    private ClaimStatus status = ClaimStatus.PENDING;

    private String reviewedBy;

    @CreatedDate
    @Indexed
    private Instant createdAt = Instant.now();

    @LastModifiedDate
    private Instant updatedAt = Instant.now();

    public Claim() {
    }

    public Claim(String itemId, String itemTitle, String claimantId, String claimantName, String privateMessage, String ownershipVerification) {
        this.itemId = itemId;
        this.itemTitle = itemTitle;
        this.claimantId = claimantId;
        this.claimantName = claimantName;
        this.privateMessage = privateMessage;
        this.ownershipVerification = ownershipVerification;
        this.status = ClaimStatus.PENDING;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
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
