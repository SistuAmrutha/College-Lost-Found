package com.collegelostfound.dto;

import com.collegelostfound.model.Message;

import java.time.Instant;
import java.util.List;

public class MessageResponse {
    private String id;
    private String conversationId;
    private String senderId;
    private String senderName;
    private String content;
    private Instant createdAt;
    private List<String> readBy;
    private boolean isOwnMessage;

    public MessageResponse() {}

    public static MessageResponse fromMessage(Message msg, String currentUserId) {
        if (msg == null) return null;
        MessageResponse res = new MessageResponse();
        res.setId(msg.getId());
        res.setConversationId(msg.getConversationId());
        res.setSenderId(msg.getSenderId());
        res.setSenderName(msg.getSenderName());
        res.setContent(msg.getContent());
        res.setCreatedAt(msg.getCreatedAt());
        res.setReadBy(msg.getReadBy());
        res.setOwnMessage(currentUserId != null && currentUserId.equals(msg.getSenderId()));
        return res;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getConversationId() {
        return conversationId;
    }

    public void setConversationId(String conversationId) {
        this.conversationId = conversationId;
    }

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public List<String> getReadBy() {
        return readBy;
    }

    public void setReadBy(List<String> readBy) {
        this.readBy = readBy;
    }

    public boolean isOwnMessage() {
        return isOwnMessage;
    }

    public void setOwnMessage(boolean ownMessage) {
        isOwnMessage = ownMessage;
    }
}
