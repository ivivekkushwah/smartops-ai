package com.smartops.monitor.controller;

import com.smartops.monitor.dto.LogStatsResponse;
import com.smartops.monitor.model.LogDocument;
import com.smartops.monitor.service.LogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import org.springframework.validation.annotation.Validated;

import java.util.List;


@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
@Validated
public class LogController {

    private final LogService logService;

    // ==========================================
    // GET ALL LOGS
    // ==========================================

    @GetMapping
    public List<LogDocument> getAllLogs(@RequestHeader("X-User-Id") String userId) {
        return logService.getAllLogs(userId);
    }

    // ==========================================
    // GET RECENT LOGS
    // ==========================================

    @GetMapping("/recent")
    public List<LogDocument> getRecentLogs(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam(defaultValue = "100") @Min(1) @Max(100) int limit
    ) {
        return logService.getRecentLogs(userId, limit);
    }

    // ==========================================
    // GET LOGS BY SERVICE
    // ==========================================

    @GetMapping("/service/{serviceName}")
    public List<LogDocument> getLogsByService(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String serviceName,
            @RequestParam(defaultValue = "50") @Min(1) @Max(100) int limit
    ) {
        return logService.getLogsByService(userId, serviceName, limit);
    }

    // ==========================================
    // GET LOGS BY LEVEL
    // ==========================================

    @GetMapping("/level")
    public List<LogDocument> getLogsByLevel(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam @NotBlank String level
    ) {
        return logService.getLogsByLevel(userId, level);
    }

    // ==========================================
    // SEARCH LOGS
    // ==========================================

    @GetMapping("/search")
    public List<LogDocument> searchLogs(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam @NotBlank String query,
            @RequestParam(defaultValue = "50") @Min(1) @Max(100) int limit
    ) {
        return logService.searchLogs(userId, query, limit);
    }

    // ==========================================
    // LOG STATISTICS
    // ==========================================

    @GetMapping("/stats")
    public LogStatsResponse getLogStats(@RequestHeader("X-User-Id") String userId) {
        return logService.getLogStats(userId);
    }
}
