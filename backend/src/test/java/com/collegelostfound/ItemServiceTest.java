package com.collegelostfound;

import com.collegelostfound.dto.CreateItemRequest;
import com.collegelostfound.dto.ItemResponse;
import com.collegelostfound.dto.UpdateItemRequest;
import com.collegelostfound.exception.BadRequestException;
import com.collegelostfound.exception.ForbiddenException;
import com.collegelostfound.model.*;
import com.collegelostfound.repository.ItemRepository;
import com.collegelostfound.security.UserPrincipal;
import com.collegelostfound.service.AuditLogService;
import com.collegelostfound.service.ItemService;
import com.collegelostfound.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.MongoOperations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ItemServiceTest {

    @Mock
    private ItemRepository itemRepository;

    @Mock
    private MongoOperations mongoTemplate;

    @Mock
    private AuditLogService auditLogService;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private ItemService itemService;

    private UserPrincipal ownerUser;
    private UserPrincipal otherUser;
    private Item testItem;

    @BeforeEach
    void setUp() {
        ownerUser = new UserPrincipal("owner1", "Alex Rivera", "alex@college.edu", "pass", Role.ROLE_STUDENT, AccountStatus.ACTIVE);
        otherUser = new UserPrincipal("user2", "Priya Sharma", "priya@college.edu", "pass", Role.ROLE_STUDENT, AccountStatus.ACTIVE);

        testItem = new Item("Black Wallet", "Lost near library", ItemType.LOST, "Wallets and Money", null,
                "Library", "2026-10-10", "10:00 AM", "Initials", "Notes", "owner1", "Alex Rivera");
        testItem.setId("item123");
    }

    @Test
    void createItem_Success() {
        CreateItemRequest request = new CreateItemRequest();
        request.setTitle("Water Bottle");
        request.setDescription("Blue bottle left on desk");
        request.setType(ItemType.FOUND);
        request.setCategory("Water Bottles");
        request.setLocation("Library");
        request.setDateOccurred("2026-10-11");

        Item saved = new Item("Water Bottle", "Blue bottle left on desk", ItemType.FOUND, "Water Bottles", null,
                "Library", "2026-10-11", null, null, null, "owner1", "Alex Rivera");
        saved.setId("item999");

        when(itemRepository.save(any(Item.class))).thenReturn(saved);

        ItemResponse response = itemService.createItem(request, ownerUser);

        assertNotNull(response);
        assertEquals("item999", response.getId());
        assertEquals(ItemType.FOUND, response.getType());
        verify(itemRepository).save(any(Item.class));
    }

    @Test
    void updateItem_ByOwner_Success() {
        UpdateItemRequest request = new UpdateItemRequest();
        request.setTitle("Updated Title");
        request.setDescription("Updated Description");
        request.setCategory("Wallets and Money");
        request.setLocation("Library 2nd Floor");
        request.setDateOccurred("2026-10-10");

        when(itemRepository.findById("item123")).thenReturn(Optional.of(testItem));
        when(itemRepository.save(any(Item.class))).thenReturn(testItem);

        ItemResponse response = itemService.updateItem("item123", request, ownerUser);

        assertNotNull(response);
        assertEquals("Updated Title", testItem.getTitle());
    }

    @Test
    void updateItem_ByNonOwnerNonAdmin_ThrowsForbidden() {
        UpdateItemRequest request = new UpdateItemRequest();
        request.setTitle("Hacked Title");
        request.setDescription("Hacked Description");
        request.setCategory("Wallets and Money");
        request.setLocation("Library");
        request.setDateOccurred("2026-10-10");

        when(itemRepository.findById("item123")).thenReturn(Optional.of(testItem));

        assertThrows(ForbiddenException.class, () -> itemService.updateItem("item123", request, otherUser));
        verify(itemRepository, never()).save(any(Item.class));
    }

    @Test
    void updateStatus_InvalidTransition_ThrowsBadRequest() {
        testItem.setStatus(ItemStatus.RETURNED);
        when(itemRepository.findById("item123")).thenReturn(Optional.of(testItem));

        // Invalid: RETURNED cannot jump directly to CLAIM_PENDING
        assertThrows(BadRequestException.class, () ->
                itemService.updateItemStatus("item123", ItemStatus.CLAIM_PENDING, ownerUser));
    }
}
