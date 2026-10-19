package com.collegelostfound.repository;

import com.collegelostfound.model.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {
    Page<Message> findByConversationIdOrderByCreatedAtAsc(String conversationId, Pageable pageable);
    List<Message> findByConversationIdOrderByCreatedAtAsc(String conversationId);
    long countByConversationIdAndReadByNotContaining(String conversationId, String userId);
}
