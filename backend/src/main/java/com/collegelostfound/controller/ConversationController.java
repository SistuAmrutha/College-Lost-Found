package com.collegelostfound.controller;

import com.collegelostfound.dto.*;
import com.collegelostfound.security.UserPrincipal;
import com.collegelostfound.service.MessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conversations")
@Tag(name = "Messaging", description = "Endpoints for in-app peer-to-peer messaging regarding lost and found items")
public class ConversationController {

    private final MessageService messageService;

    public ConversationController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping
    @Operation(summary = "Get conversations list for the current user")
    public ResponseEntity<List<ConversationResponse>> getConversations(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(messageService.getConversations(currentUser));
    }

    @PostMapping
    @Operation(summary = "Start a new conversation or send a message in an existing conversation")
    public ResponseEntity<ConversationResponse> createConversation(
            @Valid @RequestBody CreateConversationRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        ConversationResponse response = messageService.createConversation(request, currentUser);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}/messages")
    @Operation(summary = "Get messages in a conversation and mark them as read")
    public ResponseEntity<Page<MessageResponse>> getMessages(
            @PathVariable String id,
            @PageableDefault(size = 50) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(messageService.getMessages(id, pageable, currentUser));
    }

    @PostMapping("/{id}/messages")
    @Operation(summary = "Send a new message to a conversation")
    public ResponseEntity<MessageResponse> sendMessage(
            @PathVariable String id,
            @Valid @RequestBody SendMessageRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        MessageResponse response = messageService.sendMessage(id, request, currentUser);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
