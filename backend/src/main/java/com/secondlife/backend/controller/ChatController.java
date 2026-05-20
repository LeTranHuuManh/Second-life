    package com.secondlife.backend.controller;

import com.secondlife.backend.dto.chat.ConversationDTO;
import com.secondlife.backend.dto.chat.MessageDTO;
import com.secondlife.backend.dto.chat.SendMessageRequest;
import com.secondlife.backend.service.ChatService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    private Long getCurrentUserId() {
        return (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @GetMapping("/conversations")
    public ResponseEntity<Page<ConversationDTO>> getConversations(Pageable pageable) {
        return ResponseEntity.ok(chatService.getUserConversations(getCurrentUserId(), pageable));
    }

    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<Page<MessageDTO>> getMessages(
            @PathVariable Long conversationId,
            Pageable pageable) {
        return ResponseEntity.ok(chatService.getConversationMessages(conversationId, getCurrentUserId(), pageable));
    }

    @PostMapping("/send")
    public ResponseEntity<MessageDTO> sendMessage(
            @RequestBody SendMessageRequest request) {
        return ResponseEntity.ok(chatService.sendMessage(getCurrentUserId(), request));
    }
}
