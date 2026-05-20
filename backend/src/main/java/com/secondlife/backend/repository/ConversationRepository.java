package com.secondlife.backend.repository;

import com.secondlife.backend.domain.model.Conversation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    
    @Query("SELECT c FROM Conversation c WHERE c.buyer.id = :userId OR c.seller.id = :userId ORDER BY c.lastMessageAt DESC")
    Page<Conversation> findByUserIdOrderByLastMessageAtDesc(Long userId, Pageable pageable);

    @Query("SELECT c FROM Conversation c WHERE c.product.id = :productId AND c.buyer.id = :buyerId")
    Optional<Conversation> findByProductIdAndBuyerId(Long productId, Long buyerId);
}
