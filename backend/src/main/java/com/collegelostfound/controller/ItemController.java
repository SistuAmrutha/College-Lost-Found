package com.collegelostfound.controller;

import com.collegelostfound.dto.*;
import com.collegelostfound.model.ItemStatus;
import com.collegelostfound.model.ItemType;
import com.collegelostfound.security.UserPrincipal;
import com.collegelostfound.service.ImageStorageService;
import com.collegelostfound.service.ItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/items")
@Tag(name = "Items", description = "Endpoints for creating, browsing, filtering, and managing lost and found listings")
public class ItemController {

    private final ItemService itemService;
    private final ImageStorageService imageStorageService;

    public ItemController(ItemService itemService, ImageStorageService imageStorageService) {
        this.itemService = itemService;
        this.imageStorageService = imageStorageService;
    }

    @GetMapping
    @Operation(summary = "Browse and search lost and found listings with filters")
    public ResponseEntity<Page<ItemResponse>> searchItems(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) ItemType type,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) ItemStatus status,
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo,
            @RequestParam(required = false, defaultValue = "newest") String sort,
            @PageableDefault(size = 12) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        Page<ItemResponse> items = itemService.searchItems(
                search, type, category, location, status, dateFrom, dateTo, sort, pageable, currentUser
        );
        return ResponseEntity.ok(items);
    }

    @GetMapping("/statistics")
    @Operation(summary = "Get aggregated counts of lost, found, returned, and active items")
    public ResponseEntity<ItemStatisticsResponse> getStatistics() {
        return ResponseEntity.ok(itemService.getStatistics());
    }

    @GetMapping("/my-posts")
    @Operation(summary = "Get listings created by the authenticated user")
    public ResponseEntity<Page<ItemResponse>> getMyPosts(
            @PageableDefault(size = 10) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(itemService.getMyItems(currentUser, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get item details by ID")
    public ResponseEntity<ItemResponse> getItemById(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(itemService.getItemById(id, currentUser));
    }

    @GetMapping("/{id}/related")
    @Operation(summary = "Get items related by category or location")
    public ResponseEntity<List<ItemResponse>> getRelatedItems(
            @PathVariable String id,
            @RequestParam String category,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        String currentUserId = currentUser != null ? currentUser.getId() : null;
        return ResponseEntity.ok(itemService.getRelatedItems(id, category, currentUserId));
    }

    @PostMapping
    @Operation(summary = "Create a new lost or found item post")
    public ResponseEntity<ItemResponse> createItem(
            @Valid @RequestBody CreateItemRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        ItemResponse created = itemService.createItem(request, currentUser);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing listing (owner or admin only)")
    public ResponseEntity<ItemResponse> updateItem(
            @PathVariable String id,
            @Valid @RequestBody UpdateItemRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(itemService.updateItem(id, request, currentUser));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a listing (owner or admin only)")
    public ResponseEntity<ApiResponse> deleteItem(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        itemService.deleteItem(id, currentUser);
        return ResponseEntity.ok(new ApiResponse(true, "Item deleted successfully"));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update status of an item (e.g., mark as RETURNED or CLOSED)")
    public ResponseEntity<ItemResponse> updateItemStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateItemStatusRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(itemService.updateItemStatus(id, request.getStatus(), currentUser));
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload an item image (returns URL)")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        String imageUrl = imageStorageService.storeImage(file);
        return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
    }
}
