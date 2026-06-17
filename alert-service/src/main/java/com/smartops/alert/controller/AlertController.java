package com.smartops.alert.controller;

import com.smartops.alert.dto.AlertResponse;
import com.smartops.alert.dto.AlertStatsResponse;
import com.smartops.alert.dto.CreateAlertRequest;
import com.smartops.alert.service.AlertService;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {

    private final AlertService alertService;

    // =========================
    // CREATE ALERT
    // =========================

    @PostMapping
    public AlertResponse createAlert(
            @Valid
            @RequestBody CreateAlertRequest request
    ) {

        return alertService.createAlert(request);
    }

    // =========================
    // GET ALL ALERTS
    // =========================

    @GetMapping
    public List<AlertResponse> getAllAlerts() {

        return alertService.getAllAlerts();
    }

    // =========================
    // GET ACTIVE ALERTS
    // =========================

    @GetMapping("/active")
    public List<AlertResponse> getActiveAlerts() {

        return alertService.getActiveAlerts();
    }

    // =========================
    // GET ALERT BY ID
    // =========================

    @GetMapping("/{id}")
    public AlertResponse getAlertById(
            @PathVariable String id
    ) {

        return alertService.getAlertById(id);
    }

    // =========================
    // RESOLVE ALERT
    // =========================

    @PutMapping("/{id}/resolve")
    public AlertResponse resolveAlert(
            @PathVariable String id
    ) {

        return alertService.resolveAlert(id);
    }

    @GetMapping("/critical")
    public List<AlertResponse> getCriticalAlerts() {

        return alertService.getCriticalAlerts();
    }

    @GetMapping("/stats")
    public AlertStatsResponse getAlertStats() {

        return alertService.getAlertStats();
    }



    @PutMapping("/{id}/acknowledge")
    public AlertResponse acknowledgeAlert(
            @PathVariable String id
    ) {

        return alertService.acknowledgeAlert(id);
    }

    @DeleteMapping("/{id}")
    public void deleteAlert(
            @PathVariable String id
    ) {

        alertService.deleteAlert(id);
    }
}