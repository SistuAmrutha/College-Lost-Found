package com.collegelostfound.service;

import com.collegelostfound.dto.*;
import com.collegelostfound.exception.BadRequestException;
import com.collegelostfound.exception.ForbiddenException;
import com.collegelostfound.exception.ResourceNotFoundException;
import com.collegelostfound.model.*;
import com.collegelostfound.repository.ConversationRepository;
import com.collegelostfound.repository.ItemRepository;
import com.collegelostfound.repository.MessageRepository;
import com.collegelostfound.repository.UserRepository;
import com.collegelostfound.security.UserPrincipal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MessageService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ItemRepository itemRepository;
    private final NotificationService notificationService;

    public MessageService(ConversationRepository conversationRepository,
                          MessageRepository messageRepository,
                          UserRepository userRepository,
                          ItemRepository itemRepository,
                          NotificationService notificationService) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.itemRepository = itemRepository;
        this.notificationService = notificationService;
    }

    public List<ConversationResponse> getConversations(UserPrincipal currentUser) {
        List<Conversation> conversations = conversationRepository.findByParticipantIdsContainingOrderByUpdatedAtDesc(currentUser.getId());

        return conversations.stream().map(c -> {
            long unread = messageRepository.countByConversationIdAndReadByNotContaining(c.getId(), currentUser.getId());
            return ConversationResponse.fromConversation(c, currentUser.getId(), unread);
        }).collect(Collectors.toList());
    }

    public ConversationResponse createConversation(CreateConversationRequest request, UserPrincipal currentUser) {
        if (currentUser.getId().equals(request.getRecipientId())) {
            throw new BadRequestException("You cannot start a conversation with yourself");
        }

        User recipient = userRepository.findById(request.getRecipientId())
                .orElseThrow(() -> new ResourceNotFoundException("Recipient user not found"));

        String itemTitle = null;
        if (request.getRelatedItemId() != null) {
            itemTitle = itemRepository.findById(request.getRelatedItemId())
                    .map(Item::getTitle)
                    .orElse(null);
        }

        // Check if an existing conversation between these users for the same item already exists
        Optional<Conversation> existing = conversationRepository.findByParticipantIdsContainingAndParticipantIdsContainingAndRelatedItemId(
                currentUser.getId(), recipient.getId(), request.getRelatedItemId());

        Conversation conversation;
        if (existing.isPresent()) {
            conversation = existing.get();
        } else {
            conversation = new Conversation();
            conversation.setParticipantIds(List.of(currentUser.getId(), recipient.getId()));
            Map<String, String> names = new HashMap<>();
            names.put(currentUser.getId(), currentUser.getFullName());
            names.put(recipient.getId(), recipient.getFullName());
            conversation.setParticipantNames(names);
            conversation.setRelatedItemId(request.getRelatedItemId());
            conversation.setRelatedItemTitle(itemTitle);
        }

        conversation.setLastMessage(request.getMessage().trim());
        conversation.setLastMessageSenderId(currentUser.getId());
        conversation.setLastMessageAt(Instant.now());
        conversation.setUpdatedAt(Instant.now());

        Conversation savedConversation = conversationRepository.save(conversation);

        // Save first message
        Message message = new Message(savedConversation.getId(), currentUser.getId(), currentUser.getFullName(), request.getMessage().trim());
        messageRepository.save(message);

        // Notify recipient
        notificationService.createNotification(
                recipient.getId(),
                NotificationType.MESSAGE_RECEIVED,
                "New Message",
                currentUser.getFullName() + ": " + (request.getMessage().length() > 50 ? request.getMessage().substring(0, 47) + "..." : request.getMessage()),
                savedConversation.getId(),
                "CONVERSATION"
        );

        return ConversationResponse.fromConversation(savedConversation, currentUser.getId(), 0);
    }

    public Page<MessageResponse> getMessages(String conversationId, Pageable pageable, UserPrincipal currentUser) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));

        boolean isParticipant = conversation.getParticipantIds().contains(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ROLE_ADMIN;

        if (!isParticipant && !isAdmin) {
            throw new ForbiddenException("You are not authorized to view messages in this conversation");
        }

        Page<Message> messagePage = messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId, pageable);

        // Mark unread messages as read
        List<Message> toUpdate = new ArrayList<>();
        for (Message msg : messagePage.getContent()) {
            if (msg.getReadBy() == null) {
                msg.setReadBy(new ArrayList<>());
            }
            if (!msg.getReadBy().contains(currentUser.getId())) {
                msg.getReadBy().add(currentUser.getId());
                toUpdate.add(msg);
            }
        }
        if (!toUpdate.isEmpty()) {
            messageRepository.saveAll(toUpdate);
        }

        return messagePage.map(m -> MessageResponse.fromMessage(m, currentUser.getId()));
    }

    public MessageResponse sendMessage(String conversationId, SendMessageRequest request, UserPrincipal currentUser) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));

        if (!conversation.getParticipantIds().contains(currentUser.getId())) {
            throw new ForbiddenException("You are not authorized to post in this conversation");
        }

        Message message = new Message(conversationId, currentUser.getId(), currentUser.getFullName(), request.getContent().trim());
        Message savedMessage = messageRepository.save(message);

        conversation.setLastMessage(savedMessage.getContent());
        conversation.setLastMessageSenderId(currentUser.getId());
        conversation.setLastMessageAt(savedMessage.getCreatedAt());
        conversation.setUpdatedAt(Instant.now());
        conversationRepository.save(conversation);

        // Notify other participants
        for (String pid : conversation.getParticipantIds()) {
            if (!pid.equals(currentUser.getId())) {
                notificationService.createNotification(
                        pid,
                        NotificationType.MESSAGE_RECEIVED,
                        "New message from " + currentUser.getFullName(),
                        savedMessage.getContent().length() > 50 ? savedMessage.getContent().substring(0, 47) + "..." : savedMessage.getContent(),
                        conversation.getId(),
                        "CONVERSATION"
                );
            }
        }

        return MessageResponse.fromMessage(savedMessage, currentUser.getId());
    }
}
