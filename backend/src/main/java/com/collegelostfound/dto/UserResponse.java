package com.collegelostfound.dto;

import com.collegelostfound.model.AccountStatus;
import com.collegelostfound.model.Role;
import com.collegelostfound.model.User;

import java.time.Instant;

public class UserResponse {
    private String id;
    private String fullName;
    private String email;
    private String collegeId;
    private String department;
    private String academicYear;
    private String phone;
    private Role role;
    private AccountStatus accountStatus;
    private String profileImageUrl;
    private Instant createdAt;

    public UserResponse() {}

    public static UserResponse fromUser(User user, boolean isSelfOrAdmin) {
        if (user == null) return null;
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setFullName(user.getFullName());
        response.setEmail(isSelfOrAdmin ? user.getEmail() : maskEmail(user.getEmail()));
        response.setCollegeId(isSelfOrAdmin ? user.getCollegeId() : maskCollegeId(user.getCollegeId()));
        response.setDepartment(user.getDepartment());
        response.setAcademicYear(user.getAcademicYear());
        response.setPhone(isSelfOrAdmin ? user.getPhone() : null);
        response.setRole(user.getRole());
        response.setAccountStatus(user.getAccountStatus());
        response.setProfileImageUrl(user.getProfileImageUrl());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }

    private static String maskEmail(String email) {
        if (email == null || !email.contains("@")) return "***";
        int atIdx = email.indexOf("@");
        if (atIdx <= 2) return "***" + email.substring(atIdx);
        return email.substring(0, 2) + "***" + email.substring(atIdx);
    }

    private static String maskCollegeId(String id) {
        if (id == null || id.length() < 4) return "***";
        return id.substring(0, 2) + "****" + id.substring(id.length() - 2);
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCollegeId() {
        return collegeId;
    }

    public void setCollegeId(String collegeId) {
        this.collegeId = collegeId;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public AccountStatus getAccountStatus() {
        return accountStatus;
    }

    public void setAccountStatus(AccountStatus accountStatus) {
        this.accountStatus = accountStatus;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
