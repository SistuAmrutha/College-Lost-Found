package com.collegelostfound.repository;

import com.collegelostfound.model.Claim;
import com.collegelostfound.model.ClaimStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClaimRepository extends MongoRepository<Claim, String> {
    List<Claim> findByItemId(String itemId);
    Page<Claim> findByClaimantId(String claimantId, Pageable pageable);
    List<Claim> findByClaimantId(String claimantId);
    Optional<Claim> findByItemIdAndClaimantId(String itemId, String claimantId);
    Page<Claim> findByStatus(ClaimStatus status, Pageable pageable);
    long countByStatus(ClaimStatus status);
}
