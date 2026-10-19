package com.collegelostfound.repository;

import com.collegelostfound.model.Item;
import com.collegelostfound.model.ItemStatus;
import com.collegelostfound.model.ItemType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends MongoRepository<Item, String> {
    Page<Item> findByType(ItemType type, Pageable pageable);
    Page<Item> findByOwnerId(String ownerId, Pageable pageable);
    List<Item> findByOwnerId(String ownerId);
    Page<Item> findByStatus(ItemStatus status, Pageable pageable);
    long countByType(ItemType type);
    long countByStatus(ItemStatus status);
}
