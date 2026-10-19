package com.collegelostfound.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "items")
@CompoundIndexes({
    @CompoundIndex(name = "type_status_idx", def = "{'type': 1, 'status': 1}"),
    @CompoundIndex(name = "category_status_idx", def = "{'category': 1, 'status': 1}"),
    @CompoundIndex(name = "location_status_idx", def = "{'location': 1, 'status': 1}")
})
public class Item {

    @Id
    private String id;

    private String title;

    private String description;

    private ItemType type; // LOST or FOUND

    private String category;

    private List<String> imageUrls = new ArrayList<>();

    private String location;

    private String dateOccurred; // e.g. "2026-10-10"

    private String approximateTime; // e.g. "14:30" or "Afternoon"

    private String identifyingFeatures;

    private String additionalNotes;

    @Indexed
    private String ownerId;

    private String ownerName;

    private ItemStatus status = ItemStatus.OPEN;

    @CreatedDate
    @Indexed
    private Instant createdAt = Instant.now();

    @LastModifiedDate
    private Instant updatedAt = Instant.now();

    private Instant returnedAt;

    public Item() {
    }

    public Item(String title, String description, ItemType type, String category, List<String> imageUrls,
                String location, String dateOccurred, String approximateTime, String identifyingFeatures,
                String additionalNotes, String ownerId, String ownerName) {
        this.title = title;
        this.description = description;
        this.type = type;
        this.category = category;
        this.imageUrls = imageUrls != null ? imageUrls : new ArrayList<>();
        this.location = location;
        this.dateOccurred = dateOccurred;
        this.approximateTime = approximateTime;
        this.identifyingFeatures = identifyingFeatures;
        this.additionalNotes = additionalNotes;
        this.ownerId = ownerId;
        this.ownerName = ownerName;
        this.status = ItemStatus.OPEN;
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
}
