package com.smartops.alert.repository;



import com.smartops.alert.model.Alert;
import com.smartops.alert.model.AlertSeverity;
import com.smartops.alert.model.AlertStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository
        extends MongoRepository<Alert, String> {

    List<Alert> findByStatus(
            AlertStatus status
    );

    List<Alert> findBySeverity(
            AlertSeverity severity
    );

    List<Alert> findByServiceName(
            String serviceName
    );

    long countBySeverity(AlertSeverity severity);

    long countByStatus(AlertStatus status);


}