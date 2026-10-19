package com.collegelostfound.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Document(collection = "conversations")
public class Conversation {

    @Id
    private String id;

    @Indexed
    private List<String> participantIds = new ArrayList<>();

    private Map<String, String> participantNames = new HashMap<>();

    private String relatedItemId;

    private String relatedItemTitle;

    private String lastMessage;

    private String lastMessageSenderId;

    private Instant lastMessageAt;

    @CreatedDate
    private Instant createdAt = Instant.now();

    @LastModifiedDate
    private Instant updatedAt = Instant.now();

    public Conversation() {
    }

    public Conversation(List<String> participantIds, Map<String, String> participantNames, String relatedItemId, String relatedItemTitle) {
        this.participantIds = participantIds != null ? participantIds : new ArrayList<>();
        this.participantNames = participantNames != null ? participantNames : new HashMap<>();
        this.relatedItemId = relatedItemId;
        this.relatedItemTitle = relatedItemTitle;
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

    public List<String> getParticipantIds() {
        return participantIds;
    }

    public void setParticipantIds(List<String> participantIds) {
        this.participantIds = participantIds;
    }

    public Map<String, String> getParticipantNames() {
        return participantNames;
    }

    public void setParticipantNames(Map<String, String> participantNames) {
        this.participantNames = participantNames;
    }

    public String getRelatedItemId() {
        return relatedItemId;
    }

    public void setRelatedItemId(String relatedItemId) {
        this.relatedItemId = relatedItemId;
    }

    public String getRelatedItemTitle() {
        return relatedItemTitle;
    }

    public void setRelatedItemTitle(String relatedItemTitle) {
        this.relatedItemTitle = relatedItemTitle;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
    }

    public String getLastMessageSenderId() {
        return lastMessageSenderId;
    }

    public void setLastMessageSenderId(String lastMessageSenderId) {
        this.lastMessageSenderId = lastMessageSenderId;
    }

    public Instant getLastMessageAt() {
        return lastMessageAt;
    }

    public void setLastMessageAt(Instant lastMessageAt) {
        this.lastMessageAt = lastMessageAt;
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
