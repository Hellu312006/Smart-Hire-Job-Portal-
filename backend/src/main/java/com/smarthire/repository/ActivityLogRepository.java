package com.smarthire.repository;

import com.smarthire.document.ActivityLogDocument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends MongoRepository<ActivityLogDocument, String> {
    Page<ActivityLogDocument> findAllByOrderByTimestampDesc(Pageable pageable);
    List<ActivityLogDocument> findTop20ByOrderByTimestampDesc();
    List<ActivityLogDocument> findByUserIdOrderByTimestampDesc(Long userId);
}
