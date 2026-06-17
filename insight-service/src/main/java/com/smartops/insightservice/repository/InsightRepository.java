package com.smartops.insightservice.repository;

import com.smartops.insightservice.model.Insight;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InsightRepository
        extends MongoRepository<Insight, String> {
}
