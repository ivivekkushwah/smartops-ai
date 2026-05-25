package com.smartops.monitor.repository;

import com.smartops.monitor.model.ServiceStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ServiceStatusRepository
        extends MongoRepository<ServiceStatus, String> {

    Optional<ServiceStatus> findByServiceName(String serviceName);

    List<ServiceStatus> findByUserId(String userId);

    double countById(String id);

    double countErrorsById(String id);
}