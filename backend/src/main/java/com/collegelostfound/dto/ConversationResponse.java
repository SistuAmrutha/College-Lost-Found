package com.collegelostfound.dto;

import com.collegelostfound.model.Conversation;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public class ConversationResponse {
    private String id;
    private List<String> participantIds;
    private Map<String, String> participantNames;
    private String otherParticipantId;
    private String otherParticipantName;
    private String relatedItemId;
    private String relatedItemTitle;
    private String lastMessage;
    private String lastMessageSenderId;
    private Instant lastMessageAt;
    private long unreadCount;
    private Instant createdAt;

    public ConversationResponse() {}

    public static ConversationResponse fromConversation(Conversation conv, String currentUserId, long unreadCount) {
        if (conv == null) return null;
        ConversationResponse res = new ConversationResponse();
        res.setId(conv.getId());
        res.setParticipantIds(conv.getParticipantIds());
        res.setParticipantNames(conv.getParticipantNames());
        res.setRelatedItemId(conv.getRelatedItemId());
        res.setRelatedItemTitle(conv.getRelatedItemTitle());
        res.setLastMessage(conv.getLastMessage());
        res.setLastMessageSenderId(conv.getLastMessageSenderId());
        res.setLastMessageAt(conv.getLastMessageAt());
        res.setUnreadCount(unreadCount);
        res.setCreatedAt(conv.getCreatedAt());

        if (conv.getParticipantIds() != null && currentUserId != null) {
            for (String pid : conv.getParticipantIds()) {
                if (!pid.equals(currentUserId)) {
                    res.setOtherParticipantId(pid);
                    if (conv.getParticipantNames() != null) {
                        res.setOtherParticipantName(conv.getParticipantNames().get(pid));
                    }
                    break;
                }
            }
        }
        return res;
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

    public String getOtherParticipantId() {
        return otherParticipantId;
    }

    public void setOtherParticipantId(String otherParticipantId) {
        this.otherParticipantId = otherParticipantId;
    }

    public String getOtherParticipantName() {
        return otherParticipantName;
    }

    public void setOtherParticipantName(String otherParticipantName) {
        this.otherParticipantName = otherParticipantName;
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

    public long getUnreadCount() {
        return unreadCount;
    }

    public void setUnreadCount(long unreadCount) {
        this.unreadCount = unreadCount;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
