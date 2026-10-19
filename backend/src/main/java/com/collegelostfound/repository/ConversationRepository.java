package com.collegelostfound.repository;

import com.collegelostfound.model.Conversation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends MongoRepository<Conversation, String> {
    List<Conversation> findByParticipantIdsContainingOrderByUpdatedAtDesc(String userId);
    Optional<Conversation> findByParticipantIdsContainingAndParticipantIdsContainingAndRelatedItemId(String user1, String user2, String relatedItemId);
}
