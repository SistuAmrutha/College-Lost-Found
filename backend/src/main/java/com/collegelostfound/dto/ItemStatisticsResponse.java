package com.collegelostfound.dto;

public class ItemStatisticsResponse {
    private long totalItems;
    private long totalLost;
    private long totalFound;
    private long totalReturned;
    private long totalActive;

    public ItemStatisticsResponse() {}

    public ItemStatisticsResponse(long totalItems, long totalLost, long totalFound, long totalReturned, long totalActive) {
        this.totalItems = totalItems;
        this.totalLost = totalLost;
        this.totalFound = totalFound;
        this.totalReturned = totalReturned;
        this.totalActive = totalActive;
    }

    public long getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(long totalItems) {
        this.totalItems = totalItems;
    }

    public long getTotalLost() {
        return totalLost;
    }

    public void setTotalLost(long totalLost) {
        this.totalLost = totalLost;
    }

    public long getTotalFound() {
        return totalFound;
    }

    public void setTotalFound(long totalFound) {
        this.totalFound = totalFound;
    }

    public long getTotalReturned() {
        return totalReturned;
    }

    public void setTotalReturned(long totalReturned) {
        this.totalReturned = totalReturned;
    }

    public long getTotalActive() {
        return totalActive;
    }

    public void setTotalActive(long totalActive) {
        this.totalActive = totalActive;
    }
}
