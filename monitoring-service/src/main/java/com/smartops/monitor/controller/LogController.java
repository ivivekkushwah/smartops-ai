package com.smartops.monitor.controller;

import com.smartops.monitor.dto.LogStatsResponse;
import com.smartops.monitor.model.LogDocument;
import com.smartops.monitor.service.LogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class LogController {

    private final LogService logService;

    // ==========================================
    // GET ALL LOGS
    // ==========================================

    @GetMapping
    public List<LogDocument> getAllLogs() {
        return logService.getAllLogs();
    }

    // ==========================================
    // GET RECENT LOGS
    // ==========================================

    @GetMapping("/recent")
    public List<LogDocument> getRecentLogs(
            @RequestParam(defaultValue = "100") int limit
    ) {
        return logService.getRecentLogs(limit);
    }

    // ==========================================
    // GET LOGS BY SERVICE
    // ==========================================

    @GetMapping("/service/{serviceName}")
    public List<LogDocument> getLogsByService(
            @PathVariable String serviceName,
            @RequestParam(defaultValue = "50") int limit
    ) {
        return logService.getLogsByService(serviceName, limit);
    }

    // ==========================================
    // GET LOGS BY LEVEL
    // ==========================================

    @GetMapping("/level")
    public List<LogDocument> getLogsByLevel(
            @RequestParam String level
    ) {
        return logService.getLogsByLevel(level.toUpperCase()); // ✅ FIX
    }

    // ==========================================
    // SEARCH LOGS
    // ==========================================

    @GetMapping("/search")
    public List<Object> searchLogs(
            @RequestParam String query,
            @RequestParam(defaultValue = "50") int limit
    ) {
        return logService.searchLogs(query, limit); // ✅ FIX TYPE
    }

    // ==========================================
    // LOG STATISTICS
    // ==========================================

    @GetMapping("/stats")
    public LogStatsResponse getLogStats() {
        return logService.getLogStats();
    }
}