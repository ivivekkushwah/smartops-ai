package com.smartops.monitor.repository;

import com.smartops.monitor.model.LogDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Collection;
import java.util.List;

public interface LogRepository
        extends MongoRepository<LogDocument, String> {

    List<LogDocument> findByServiceName(String serviceName);

    List<LogDocument> findByLevel(String level);

    Collection<Object> findByMessageContainingIgnoreCase(String query);
}