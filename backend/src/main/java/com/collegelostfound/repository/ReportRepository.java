package com.collegelostfound.repository;

import com.collegelostfound.model.Report;
import com.collegelostfound.model.ReportStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportRepository extends MongoRepository<Report, String> {
    Page<Report> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<Report> findByStatusOrderByCreatedAtDesc(ReportStatus status, Pageable pageable);
    boolean existsByItemIdAndReporterId(String itemId, String reporterId);
    long countByStatus(ReportStatus status);
}
