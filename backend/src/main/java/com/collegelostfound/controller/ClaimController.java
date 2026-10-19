package com.collegelostfound.controller;

import com.collegelostfound.dto.ClaimResponse;
import com.collegelostfound.dto.CreateClaimRequest;
import com.collegelostfound.dto.UpdateClaimStatusRequest;
import com.collegelostfound.security.UserPrincipal;
import com.collegelostfound.service.ClaimService;
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
@RequestMapping("/api")
@Tag(name = "Claims", description = "Endpoints for claiming found items and resolving claims")
public class ClaimController {

    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    @PostMapping("/claims")
    @Operation(summary = "Submit a claim for an item")
    public ResponseEntity<ClaimResponse> createClaim(
            @Valid @RequestBody CreateClaimRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        ClaimResponse response = claimService.createClaim(request, currentUser);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/claims/my-claims")
    @Operation(summary = "Get claims submitted by the current authenticated user")
    public ResponseEntity<Page<ClaimResponse>> getMyClaims(
            @PageableDefault(size = 10) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(claimService.getMyClaims(currentUser, pageable));
    }

    @GetMapping("/items/{itemId}/claims")
    @Operation(summary = "Get all claims submitted for a specific item (owner or admin only)")
    public ResponseEntity<List<ClaimResponse>> getItemClaims(
            @PathVariable String itemId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(claimService.getItemClaims(itemId, currentUser));
    }

    @PatchMapping("/claims/{id}/status")
    @Operation(summary = "Approve or reject a claim (owner or admin only)")
    public ResponseEntity<ClaimResponse> updateClaimStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateClaimStatusRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(claimService.updateClaimStatus(id, request, currentUser));
    }
}
