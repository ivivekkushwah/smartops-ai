package com.smartops.monitor.repository;

import com.smartops.monitor.model.LogDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface LogRepository
        extends MongoRepository<LogDocument, String> {

    List<LogDocument> findByUserIdOrderByTimestampDesc(String userId);

    List<LogDocument> findByUserIdAndServiceNameOrderByTimestampDesc(String userId, String serviceName);

    List<LogDocument> findByUserIdAndLevelOrderByTimestampDesc(String userId, String level);

    List<LogDocument> findByUserIdAndMessageContainingIgnoreCaseOrderByTimestampDesc(String userId, String query);

    void deleteByUserId(String userId);
}
