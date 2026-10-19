package com.collegelostfound.service;

import com.collegelostfound.model.AuditLog;
import com.collegelostfound.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void log(String actorId, String actorEmail, String action, String targetType, String targetId, String details) {
        AuditLog log = new AuditLog(actorId, actorEmail, action, targetType, targetId, details);
        auditLogRepository.save(log);
    }
}
