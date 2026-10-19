package com.collegelostfound.dto;

import com.collegelostfound.model.Item;
import com.collegelostfound.model.ItemStatus;
import com.collegelostfound.model.ItemType;

import java.time.Instant;
import java.util.List;

public class ItemResponse {
    private String id;
    private String title;
    private String description;
    private ItemType type;
    private String category;
    private List<String> imageUrls;
    private String location;
    private String dateOccurred;
    private String approximateTime;
    private String identifyingFeatures;
    private String additionalNotes;
    private String ownerId;
    private String ownerName;
    private ItemStatus status;
    private Instant createdAt;
    private Instant updatedAt;
    private Instant returnedAt;
    private boolean isOwner;

    public ItemResponse() {}

    public static ItemResponse fromItem(Item item, String currentUserId) {
        if (item == null) return null;
        ItemResponse res = new ItemResponse();
        res.setId(item.getId());
        res.setTitle(item.getTitle());
        res.setDescription(item.getDescription());
        res.setType(item.getType());
        res.setCategory(item.getCategory());
        res.setImageUrls(item.getImageUrls());
        res.setLocation(item.getLocation());
        res.setDateOccurred(item.getDateOccurred());
        res.setApproximateTime(item.getApproximateTime());
        res.setIdentifyingFeatures(item.getIdentifyingFeatures());
        res.setAdditionalNotes(item.getAdditionalNotes());
        res.setOwnerId(item.getOwnerId());
        res.setOwnerName(item.getOwnerName());
        res.setStatus(item.getStatus());
        res.setCreatedAt(item.getCreatedAt());
        res.setUpdatedAt(item.getUpdatedAt());
        res.setReturnedAt(item.getReturnedAt());
        res.setOwner(currentUserId != null && currentUserId.equals(item.getOwnerId()));
        return res;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ItemType getType() {
        return type;
    }

    public void setType(ItemType type) {
        this.type = type;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDateOccurred() {
        return dateOccurred;
    }

    public void setDateOccurred(String dateOccurred) {
        this.dateOccurred = dateOccurred;
    }

    public String getApproximateTime() {
        return approximateTime;
    }

    public void setApproximateTime(String approximateTime) {
        this.approximateTime = approximateTime;
    }

    public String getIdentifyingFeatures() {
        return identifyingFeatures;
    }

    public void setIdentifyingFeatures(String identifyingFeatures) {
        this.identifyingFeatures = identifyingFeatures;
    }

    public String getAdditionalNotes() {
        return additionalNotes;
    }

    public void setAdditionalNotes(String additionalNotes) {
        this.additionalNotes = additionalNotes;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public ItemStatus getStatus() {
        return status;
    }

    public void setStatus(ItemStatus status) {
        this.status = status;
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

    public Instant getReturnedAt() {
        return returnedAt;
    }

    public void setReturnedAt(Instant returnedAt) {
        this.returnedAt = returnedAt;
    }

    public boolean isOwner() {
        return isOwner;
    }

    public void setOwner(boolean owner) {
        isOwner = owner;
    }
}
