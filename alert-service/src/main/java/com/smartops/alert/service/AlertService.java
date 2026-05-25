package com.smartops.alert.service;

import com.smartops.alert.dto.AlertResponse;
import com.smartops.alert.dto.AlertStatsResponse;
import com.smartops.alert.dto.CreateAlertRequest;

import java.util.List;

public interface AlertService {

    AlertResponse createAlert(
            CreateAlertRequest request
    );

    List<AlertResponse> getAllAlerts();

    List<AlertResponse> getActiveAlerts();

    AlertResponse getAlertById(String id);

    AlertResponse resolveAlert(String id);
    List<AlertResponse> getCriticalAlerts();

    AlertStatsResponse getAlertStats();

    AlertResponse acknowledgeAlert(String id);

    void deleteAlert(String id);
}