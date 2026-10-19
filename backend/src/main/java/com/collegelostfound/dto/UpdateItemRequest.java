package com.collegelostfound.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;

public class UpdateItemRequest {

    @NotBlank(message = "Item name/title is required")
    @Size(min = 2, max = 150)
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 5, max = 2000)
    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    private List<String> imageUrls = new ArrayList<>();

    @NotBlank(message = "Campus location is required")
    private String location;

    @NotBlank(message = "Date is required")
    private String dateOccurred;

    private String approximateTime;

    private String identifyingFeatures;

    private String additionalNotes;

    public UpdateItemRequest() {}

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
}
