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
            @Valid @RequestBody CreateAlertRequest request,
            @RequestHeader("X-User-Id") String userId
    ) {
        // The gateway derives this header from the JWT; never trust the body owner.
        request.setUserId(userId);
        return alertService.createAlert(request);
    }


    // =========================
    // GET ALL ALERTS
    // =========================

    @GetMapping
    public List<AlertResponse> getAllAlerts(
            @RequestHeader("X-User-Id") String userId
    ) {

        return alertService.getAllAlerts(userId);
    }


    // =========================
    // GET ACTIVE ALERTS
    // =========================

    @GetMapping("/active")
    public List<AlertResponse> getActiveAlerts(
            @RequestHeader("X-User-Id") String userId
    ) {

        return alertService.getActiveAlerts(userId);
    }


    // =========================
    // GET CRITICAL ALERTS
    // =========================

    @GetMapping("/critical")
    public List<AlertResponse> getCriticalAlerts(
            @RequestHeader("X-User-Id") String userId
    ) {

        return alertService.getCriticalAlerts(userId);
    }


    // =========================
    // GET ALERT STATS
    // =========================

    @GetMapping("/stats")
    public AlertStatsResponse getAlertStats(
            @RequestHeader("X-User-Id") String userId
    ) {

        return alertService.getAlertStats(userId);
    }


    // =========================
    // GET ALERT BY ID
    // =========================

    @GetMapping("/{id}")
    public AlertResponse getAlertById(
            @PathVariable String id,
            @RequestHeader("X-User-Id") String userId
    ) {

        return alertService.getAlertById(id, userId);
    }


    // =========================
    // RESOLVE ALERT
    // =========================

    @PutMapping("/{id}/resolve")
    public AlertResponse resolveAlert(
            @PathVariable String id,
            @RequestHeader("X-User-Id") String userId
    ) {

        return alertService.resolveAlert(id, userId);
    }


    // =========================
    // ACKNOWLEDGE ALERT
    // =========================

    @PutMapping("/{id}/acknowledge")
    public AlertResponse acknowledgeAlert(
            @PathVariable String id,
            @RequestHeader("X-User-Id") String userId
    ) {

        return alertService.acknowledgeAlert(id, userId);
    }


    // =========================
    // DELETE ALERT
    // =========================

    @DeleteMapping("/{id}")
    public void deleteAlert(
            @PathVariable String id,
            @RequestHeader("X-User-Id") String userId
    ) {

        alertService.deleteAlert(id, userId);
    }
}
