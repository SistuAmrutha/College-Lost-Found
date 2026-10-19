package com.collegelostfound.service;

import com.collegelostfound.dto.NotificationResponse;
import com.collegelostfound.exception.ResourceNotFoundException;
import com.collegelostfound.model.Notification;
import com.collegelostfound.model.NotificationType;
import com.collegelostfound.repository.NotificationRepository;
import com.collegelostfound.security.UserPrincipal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Page<NotificationResponse> getUserNotifications(UserPrincipal currentUser, Pageable pageable) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(currentUser.getId(), pageable)
                .map(NotificationResponse::fromNotification);
    }

    public long getUnreadCount(UserPrincipal currentUser) {
        return notificationRepository.countByRecipientIdAndIsReadFalse(currentUser.getId());
    }

    public NotificationResponse markAsRead(String id, UserPrincipal currentUser) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getRecipientId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Notification not found");
        }

        notification.setRead(true);
        Notification saved = notificationRepository.save(notification);
        return NotificationResponse.fromNotification(saved);
    }

    public void markAllAsRead(UserPrincipal currentUser) {
        List<Notification> unread = notificationRepository.findByRecipientIdAndIsReadFalse(currentUser.getId());
        for (Notification n : unread) {
            n.setRead(true);
        }
        notificationRepository.saveAll(unread);
    }

    public void deleteNotification(String id, UserPrincipal currentUser) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getRecipientId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Notification not found");
        }

        notificationRepository.delete(notification);
    }

    public void createNotification(String recipientId, NotificationType type, String title, String message, String relatedEntityId, String relatedEntityType) {
        Notification notification = new Notification(recipientId, type, title, message, relatedEntityId, relatedEntityType);
        notificationRepository.save(notification);
    }
}
