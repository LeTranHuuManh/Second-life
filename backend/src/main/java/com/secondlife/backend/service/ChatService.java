package com.secondlife.backend.service;

import com.secondlife.backend.domain.model.Conversation;
import com.secondlife.backend.domain.model.Message;
import com.secondlife.backend.domain.model.Product;
import com.secondlife.backend.domain.model.UserAccount;
import com.secondlife.backend.dto.chat.ConversationDTO;
import com.secondlife.backend.dto.chat.MessageDTO;
import com.secondlife.backend.dto.chat.SendMessageRequest;
import com.secondlife.backend.repository.ConversationRepository;
import com.secondlife.backend.repository.MessageRepository;
import com.secondlife.backend.repository.ProductRepository;
import com.secondlife.backend.repository.UserAccountRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class ChatService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final ProductRepository productRepository;
    private final UserAccountRepository userAccountRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatService(ConversationRepository conversationRepository,
                       MessageRepository messageRepository,
                       ProductRepository productRepository,
                       UserAccountRepository userAccountRepository,
                       SimpMessagingTemplate messagingTemplate) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.productRepository = productRepository;
        this.userAccountRepository = userAccountRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional(readOnly = true)
    public Page<ConversationDTO> getUserConversations(Long userId, Pageable pageable) {
        return conversationRepository.findByUserIdOrderByLastMessageAtDesc(userId, pageable)
                .map(conv -> convertToConversationDTO(conv, userId));
    }

    @Transactional
    public Page<MessageDTO> getConversationMessages(Long conversationId, Long userId, Pageable pageable) {
        // Find conversation to ensure the user is part of it
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));
        
        if (!conversation.getBuyer().getId().equals(userId) && !conversation.getSeller().getId().equals(userId)) {
            throw new RuntimeException("User not part of this conversation");
        }

        // Mark unread messages as read
        messageRepository.markMessagesAsRead(conversationId, userId);

        return messageRepository.findByConversationIdOrderByCreatedAtDesc(conversationId, pageable)
                .map(this::convertToMessageDTO);
    }

    @Transactional
    public MessageDTO sendMessage(Long senderId, SendMessageRequest request) {
        UserAccount sender = userAccountRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Conversation conversation;

        if (request.getConversationId() != null) {
            conversation = conversationRepository.findById(request.getConversationId())
                    .orElseThrow(() -> new RuntimeException("Conversation not found"));
        } else {
            // New conversation
            if (request.getProductId() == null || request.getRecipientId() == null) {
                throw new RuntimeException("ProductId and RecipientId must be provided for a new conversation");
            }
            
            // Check if conversation already exists for this product and buyer
            UserAccount recipient = userAccountRepository.findById(request.getRecipientId())
                    .orElseThrow(() -> new RuntimeException("Recipient not found"));
            
            Long buyerId = recipient.getRole().name().equals("SELLER") ? sender.getId() : recipient.getId();
            
            conversation = conversationRepository.findByProductIdAndBuyerId(request.getProductId(), buyerId)
                    .orElseGet(() -> {
                        Product product = productRepository.findById(request.getProductId())
                                .orElseThrow(() -> new RuntimeException("Product not found"));
                        
                        Conversation newConv = new Conversation();
                        newConv.setProduct(product);
                        newConv.setBuyer(sender.getId().equals(buyerId) ? sender : recipient);
                        newConv.setSeller(sender.getId().equals(buyerId) ? recipient : sender);
                        return conversationRepository.save(newConv);
                    });
        }

        Message message = new Message();
        message.setConversation(conversation);
        message.setSender(sender);
        message.setContent(request.getContent());
        message.setRead(false);
        
        Message savedMessage = messageRepository.save(message);
        
        conversation.setLastMessageAt(LocalDateTime.now());
        conversationRepository.save(conversation);

        MessageDTO messageDTO = convertToMessageDTO(savedMessage);

        // Broadcast to recipient
        UserAccount recipient = conversation.getBuyer().getId().equals(senderId) 
                ? conversation.getSeller() : conversation.getBuyer();
        messagingTemplate.convertAndSend(
                "/topic/user/" + recipient.getId() + "/messages",
                messageDTO
        );
        // Also send to the sender so their other tabs get it
        messagingTemplate.convertAndSend(
                "/topic/user/" + sender.getId() + "/messages",
                messageDTO
        );

        return messageDTO;
    }

    private ConversationDTO convertToConversationDTO(Conversation conv, Long currentUserId) {
        ConversationDTO dto = new ConversationDTO();
        dto.setId(conv.getId());
        
        if (conv.getProduct() != null) {
            dto.setProductId(conv.getProduct().getId());
            dto.setProductTitle(conv.getProduct().getTitle());
        }

        UserAccount partner = conv.getBuyer().getId().equals(currentUserId) ? conv.getSeller() : conv.getBuyer();
        dto.setPartnerId(partner.getId());
        
        if (partner.getSellerProfile() != null && partner.getSellerProfile().getShopName() != null) {
            dto.setPartnerName(partner.getSellerProfile().getShopName());
        } else if (partner.getProfile() != null && partner.getProfile().getFullName() != null) {
            dto.setPartnerName(partner.getProfile().getFullName());
        } else {
            dto.setPartnerName("User " + partner.getId());
        }

        if (!conv.getMessages().isEmpty()) {
            Message lastMsg = conv.getMessages().get(conv.getMessages().size() - 1);
            dto.setLastMessage(lastMsg.getContent());
            dto.setLastMessageAt(conv.getLastMessageAt());
        }

        // Just basic unread count logic
        long unreadCount = conv.getMessages().stream()
                .filter(m -> !m.getSender().getId().equals(currentUserId) && !m.isRead())
                .count();
        dto.setUnreadCount(unreadCount);

        return dto;
    }

    private MessageDTO convertToMessageDTO(Message msg) {
        return new MessageDTO(
                msg.getId(),
                msg.getConversation().getId(),
                msg.getSender().getId(),
                msg.getContent(),
                // if created At is null locally before flush, use LocalDateTime.now()
                msg.getCreatedAt() != null ? msg.getCreatedAt() : LocalDateTime.now(),
                msg.isRead()
        );
    }
}
