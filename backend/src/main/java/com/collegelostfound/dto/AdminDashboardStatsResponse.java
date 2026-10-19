package com.collegelostfound.dto;

public class AdminDashboardStatsResponse {
    private long totalUsers;
    private long totalListings;
    private long lostListings;
    private long foundListings;
    private long returnedItems;
    private long pendingReports;
    private long pendingClaims;

    public AdminDashboardStatsResponse() {}

    public AdminDashboardStatsResponse(long totalUsers, long totalListings, long lostListings, long foundListings, long returnedItems, long pendingReports, long pendingClaims) {
        this.totalUsers = totalUsers;
        this.totalListings = totalListings;
        this.lostListings = lostListings;
        this.foundListings = foundListings;
        this.returnedItems = returnedItems;
        this.pendingReports = pendingReports;
        this.pendingClaims = pendingClaims;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalListings() {
        return totalListings;
    }

    public void setTotalListings(long totalListings) {
        this.totalListings = totalListings;
    }

    public long getLostListings() {
        return lostListings;
    }

    public void setLostListings(long lostListings) {
        this.lostListings = lostListings;
    }

    public long getFoundListings() {
        return foundListings;
    }

    public void setFoundListings(long foundListings) {
        this.foundListings = foundListings;
    }

    public long getReturnedItems() {
        return returnedItems;
    }

    public void setReturnedItems(long returnedItems) {
        this.returnedItems = returnedItems;
    }

    public long getPendingReports() {
        return pendingReports;
    }

    public void setPendingReports(long pendingReports) {
        this.pendingReports = pendingReports;
    }

    public long getPendingClaims() {
        return pendingClaims;
    }

    public void setPendingClaims(long pendingClaims) {
        this.pendingClaims = pendingClaims;
    }
}
