package com.collegelostfound.service;

import com.collegelostfound.dto.*;
import com.collegelostfound.exception.BadRequestException;
import com.collegelostfound.exception.ForbiddenException;
import com.collegelostfound.exception.ResourceNotFoundException;
import com.collegelostfound.model.*;
import com.collegelostfound.repository.ItemRepository;
import com.collegelostfound.security.UserPrincipal;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class ItemService {

    private final ItemRepository itemRepository;
    private final MongoOperations mongoTemplate;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;

    public ItemService(ItemRepository itemRepository,
                       MongoOperations mongoTemplate,
                       AuditLogService auditLogService,
                       NotificationService notificationService) {
        this.itemRepository = itemRepository;
        this.mongoTemplate = mongoTemplate;
        this.auditLogService = auditLogService;
        this.notificationService = notificationService;
    }

    public ItemResponse createItem(CreateItemRequest request, UserPrincipal currentUser) {
        Item item = new Item(
                request.getTitle().trim(),
                request.getDescription().trim(),
                request.getType(),
                request.getCategory().trim(),
                request.getImageUrls(),
                request.getLocation().trim(),
                request.getDateOccurred(),
                request.getApproximateTime(),
                request.getIdentifyingFeatures(),
                request.getAdditionalNotes(),
                currentUser.getId(),
                currentUser.getFullName()
        );

        Item saved = itemRepository.save(item);

        auditLogService.log(currentUser.getId(), currentUser.getUsername(), "ITEM_CREATED", "ITEM", saved.getId(),
                "Created " + saved.getType() + " item: " + saved.getTitle());

        return ItemResponse.fromItem(saved, currentUser.getId());
    }

    public ItemResponse getItemById(String id, UserPrincipal currentUser) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));

        String currentUserId = currentUser != null ? currentUser.getId() : null;
        return ItemResponse.fromItem(item, currentUserId);
    }

    public Page<ItemResponse> searchItems(String search, ItemType type, String category, String location,
                                          ItemStatus status, String dateFrom, String dateTo, String sort,
                                          Pageable pageable, UserPrincipal currentUser) {
        Query query = new Query();
        List<Criteria> criteriaList = new ArrayList<>();

        if (type != null) {
            criteriaList.add(Criteria.where("type").is(type));
        }

        if (StringUtils.hasText(category)) {
            criteriaList.add(Criteria.where("category").regex("^" + Pattern.quote(category) + "$", "i"));
        }

        if (StringUtils.hasText(location)) {
            criteriaList.add(Criteria.where("location").regex(Pattern.quote(location), "i"));
        }

        if (status != null) {
            criteriaList.add(Criteria.where("status").is(status));
        } else {
            // By default, exclude RETURNED and CLOSED items from active browse page
            criteriaList.add(Criteria.where("status").in(ItemStatus.OPEN, ItemStatus.CLAIM_PENDING));
        }

        if (StringUtils.hasText(search)) {
            Pattern searchPattern = Pattern.compile(Pattern.quote(search), Pattern.CASE_INSENSITIVE);
            criteriaList.add(new Criteria().orOperator(
                    Criteria.where("title").regex(searchPattern),
                    Criteria.where("description").regex(searchPattern),
                    Criteria.where("identifyingFeatures").regex(searchPattern),
                    Criteria.where("location").regex(searchPattern)
            ));
        }

        if (StringUtils.hasText(dateFrom) && StringUtils.hasText(dateTo)) {
            criteriaList.add(Criteria.where("dateOccurred").gte(dateFrom).lte(dateTo));
        } else if (StringUtils.hasText(dateFrom)) {
            criteriaList.add(Criteria.where("dateOccurred").gte(dateFrom));
        } else if (StringUtils.hasText(dateTo)) {
            criteriaList.add(Criteria.where("dateOccurred").lte(dateTo));
        }

        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        long total = mongoTemplate.count(query, Item.class);

        // Sorting
        Sort sortOrder = Sort.by(Sort.Direction.DESC, "createdAt");
        if ("oldest".equalsIgnoreCase(sort)) {
            sortOrder = Sort.by(Sort.Direction.ASC, "createdAt");
        }
        Pageable actualPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sortOrder);
        query.with(actualPageable);

        List<Item> items = mongoTemplate.find(query, Item.class);
        String currentUserId = currentUser != null ? currentUser.getId() : null;

        List<ItemResponse> responseList = items.stream()
                .map(item -> ItemResponse.fromItem(item, currentUserId))
                .collect(Collectors.toList());

        return new PageImpl<>(responseList, actualPageable, total);
    }

    public Page<ItemResponse> getMyItems(UserPrincipal currentUser, Pageable pageable) {
        Page<Item> page = itemRepository.findByOwnerId(currentUser.getId(), pageable);
        return page.map(item -> ItemResponse.fromItem(item, currentUser.getId()));
    }

    public List<ItemResponse> getRelatedItems(String currentItemId, String category, String currentUserId) {
        if (!StringUtils.hasText(category)) return List.of();
        Query query = new Query(Criteria.where("category").is(category)
                .and("_id").ne(currentItemId)
                .and("status").in(ItemStatus.OPEN, ItemStatus.CLAIM_PENDING));
        query.with(Sort.by(Sort.Direction.DESC, "createdAt")).limit(4);

        List<Item> items = mongoTemplate.find(query, Item.class);
        return items.stream()
                .map(item -> ItemResponse.fromItem(item, currentUserId))
                .collect(Collectors.toList());
    }

    public ItemResponse updateItem(String id, UpdateItemRequest request, UserPrincipal currentUser) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        boolean isAdmin = currentUser.getRole() == Role.ROLE_ADMIN;
        boolean isOwner = item.getOwnerId().equals(currentUser.getId());

        if (!isOwner && !isAdmin) {
            throw new ForbiddenException("You are not authorized to update this item");
        }

        item.setTitle(request.getTitle().trim());
        item.setDescription(request.getDescription().trim());
        item.setCategory(request.getCategory().trim());
        if (request.getImageUrls() != null) {
            item.setImageUrls(request.getImageUrls());
        }
        item.setLocation(request.getLocation().trim());
        item.setDateOccurred(request.getDateOccurred());
        item.setApproximateTime(request.getApproximateTime());
        item.setIdentifyingFeatures(request.getIdentifyingFeatures());
        item.setAdditionalNotes(request.getAdditionalNotes());
        item.setUpdatedAt(Instant.now());

        Item saved = itemRepository.save(item);
        auditLogService.log(currentUser.getId(), currentUser.getUsername(), "ITEM_UPDATED", "ITEM", saved.getId(),
                "Updated item: " + saved.getTitle());

        return ItemResponse.fromItem(saved, currentUser.getId());
    }

    public void deleteItem(String id, UserPrincipal currentUser) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        boolean isAdmin = currentUser.getRole() == Role.ROLE_ADMIN;
        boolean isOwner = item.getOwnerId().equals(currentUser.getId());

        if (!isOwner && !isAdmin) {
            throw new ForbiddenException("You are not authorized to delete this item");
        }

        itemRepository.delete(item);
        auditLogService.log(currentUser.getId(), currentUser.getUsername(), "ITEM_DELETED", "ITEM", id,
                "Deleted item: " + item.getTitle());
    }

    public ItemResponse updateItemStatus(String id, ItemStatus newStatus, UserPrincipal currentUser) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        boolean isAdmin = currentUser.getRole() == Role.ROLE_ADMIN;
        boolean isOwner = item.getOwnerId().equals(currentUser.getId());

        if (!isOwner && !isAdmin) {
            throw new ForbiddenException("You are not authorized to change the status of this item");
        }

        ItemStatus oldStatus = item.getStatus();
        validateStatusTransition(oldStatus, newStatus);

        item.setStatus(newStatus);
        item.setUpdatedAt(Instant.now());
        if (newStatus == ItemStatus.RETURNED) {
            item.setReturnedAt(Instant.now());
        }

        Item saved = itemRepository.save(item);

        auditLogService.log(currentUser.getId(), currentUser.getUsername(), "ITEM_STATUS_CHANGED", "ITEM", id,
                "Changed status from " + oldStatus + " to " + newStatus);

        return ItemResponse.fromItem(saved, currentUser.getId());
    }

    private void validateStatusTransition(ItemStatus current, ItemStatus target) {
        if (current == target) return;

        // Permitted transitions
        switch (current) {
            case OPEN:
                if (target == ItemStatus.CLAIM_PENDING || target == ItemStatus.RETURNED || target == ItemStatus.CLOSED) return;
                break;
            case CLAIM_PENDING:
                if (target == ItemStatus.OPEN || target == ItemStatus.RETURNED || target == ItemStatus.CLOSED) return;
                break;
            case RETURNED:
                if (target == ItemStatus.CLOSED || target == ItemStatus.OPEN) return;
                break;
            case CLOSED:
                if (target == ItemStatus.OPEN) return;
                break;
        }

        throw new BadRequestException("Invalid status transition from " + current + " to " + target);
    }

    public ItemStatisticsResponse getStatistics() {
        long totalLost = itemRepository.countByType(ItemType.LOST);
        long totalFound = itemRepository.countByType(ItemType.FOUND);
        long totalReturned = itemRepository.countByStatus(ItemStatus.RETURNED);
        long totalItems = itemRepository.count();
        long totalActive = totalItems - totalReturned - itemRepository.countByStatus(ItemStatus.CLOSED);

        return new ItemStatisticsResponse(totalItems, totalLost, totalFound, totalReturned, Math.max(0, totalActive));
    }
}
