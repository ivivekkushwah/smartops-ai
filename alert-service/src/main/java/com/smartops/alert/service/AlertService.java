package com.smartops.alert.service;

import com.smartops.alert.dto.AlertResponse;
import com.smartops.alert.dto.AlertStatsResponse;
import com.smartops.alert.dto.CreateAlertRequest;

import java.util.List;
public interface AlertService {

    AlertResponse createAlert(
            CreateAlertRequest request
    );

    List<AlertResponse> getAllAlerts(
            String userId
    );

    List<AlertResponse> getActiveAlerts(
            String userId
    );

    AlertResponse getAlertById(
            String id,
            String userId
    );

    AlertResponse resolveAlert(
            String id,
            String userId
    );

    AlertResponse acknowledgeAlert(
            String id,
            String userId
    );

    List<AlertResponse> getCriticalAlerts(
            String userId
    );

    AlertStatsResponse getAlertStats(
            String userId
    );

    void deleteAlert(
            String id,
            String userId
    );

    void deleteAlertsByUserId(
            String userId
    );
}