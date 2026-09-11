package com.smartops.alert.repository;

import com.smartops.alert.model.Alert;
import com.smartops.alert.model.AlertSeverity;
import com.smartops.alert.model.AlertStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface AlertRepository
        extends MongoRepository<Alert, String> {

    List<Alert> findByUserId(String userId);

    List<Alert> findByUserIdAndStatus(
            String userId,
            AlertStatus status
    );

    List<Alert> findByUserIdAndSeverity(
            String userId,
            AlertSeverity severity
    );

    Optional<Alert> findByIdAndUserId(
            String id,
            String userId
    );

    long countByUserId(String userId);

    long countByUserIdAndStatus(
            String userId,
            AlertStatus status
    );

    long countByUserIdAndSeverity(
            String userId,
            AlertSeverity severity
    );

    void deleteByUserId(String userId);
}