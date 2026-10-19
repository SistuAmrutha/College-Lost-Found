package com.collegelostfound.dto;

import com.collegelostfound.model.Notification;
import com.collegelostfound.model.NotificationType;

import java.time.Instant;

public class NotificationResponse {
    private String id;
    private String recipientId;
    private NotificationType type;
    private String title;
    private String message;
    private String relatedEntityId;
    private String relatedEntityType;
    private boolean isRead;
    private Instant createdAt;

    public NotificationResponse() {}

    public static NotificationResponse fromNotification(Notification notif) {
        if (notif == null) return null;
        NotificationResponse res = new NotificationResponse();
        res.setId(notif.getId());
        res.setRecipientId(notif.getRecipientId());
        res.setType(notif.getType());
        res.setTitle(notif.getTitle());
        res.setMessage(notif.getMessage());
        res.setRelatedEntityId(notif.getRelatedEntityId());
        res.setRelatedEntityType(notif.getRelatedEntityType());
        res.setRead(notif.isRead());
        res.setCreatedAt(notif.getCreatedAt());
        return res;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(String recipientId) {
        this.recipientId = recipientId;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getRelatedEntityId() {
        return relatedEntityId;
    }

    public void setRelatedEntityId(String relatedEntityId) {
        this.relatedEntityId = relatedEntityId;
    }

    public String getRelatedEntityType() {
        return relatedEntityType;
    }

    public void setRelatedEntityType(String relatedEntityType) {
        this.relatedEntityType = relatedEntityType;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
