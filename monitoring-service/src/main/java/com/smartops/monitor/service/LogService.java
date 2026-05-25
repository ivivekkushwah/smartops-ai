package com.smartops.monitor.service;

import com.smartops.common.event.LogEvent;
import com.smartops.monitor.dto.LogStatsResponse;
import com.smartops.monitor.model.LogDocument;
import com.smartops.monitor.repository.LogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
@Service
@RequiredArgsConstructor
public class LogService {

    private final LogRepository logRepository;

    // ==========================================
    // SAVE LOG
    // ==========================================

    public LogDocument saveLog(LogEvent event) {

        LogDocument log = new LogDocument();

        log.setServiceName(event.getServiceName());
        log.setLevel(event.getLevel().toUpperCase());
        log.setMessage(event.getMessage());
        log.setTimestamp(event.getTimestamp());

        return logRepository.save(log);
    }

    // ==========================================
    // GET ALL LOGS (SORTED DESC)
    // ==========================================

    public List<LogDocument> getAllLogs() {
        return logRepository.findAll(
                Sort.by(Sort.Direction.DESC, "timestamp")
        );
    }

    // ==========================================
    // GET RECENT LOGS
    // ==========================================

    public List<LogDocument> getRecentLogs(int limit) {

        return logRepository.findAll(
                        Sort.by(Sort.Direction.DESC, "timestamp")
                )
                .stream()
                .limit(limit)
                .toList();
    }

    // ==========================================
    // GET LOGS BY SERVICE
    // ==========================================

    public List<LogDocument> getLogsByService(
            String serviceName,
            int limit
    ) {

        return logRepository
                .findByServiceName(serviceName)
                .stream()
                .sorted((a, b) ->
                        b.getTimestamp()
                                .compareTo(a.getTimestamp()))
                .limit(limit)
                .toList();
    }

    // ==========================================
    // GET LOGS BY LEVEL
    // ==========================================

    public List<LogDocument> getLogsByLevel(String level) {

        return logRepository
                .findByLevel(level.toUpperCase());
    }

    // ==========================================
    // SEARCH LOGS
    // ==========================================

    public List<Object> searchLogs(
            String query,
            int limit
    ) {

        return logRepository
                .findByMessageContainingIgnoreCase(query)
                .stream()
                .sorted(
                )
                .limit(limit)
                .toList();
    }

    // ==========================================
    // FILTER LOGS (ADVANCED)
    // ==========================================

    public List<LogDocument> filterLogs(
            String level,
            String serviceName,
            int limit
    ) {

        List<LogDocument> logs = logRepository.findAll();

        return logs.stream()
                .filter(log ->
                        level == null ||
                                log.getLevel().equalsIgnoreCase(level))
                .filter(log ->
                        serviceName == null ||
                                log.getServiceName().equalsIgnoreCase(serviceName))
                .sorted((a, b) ->
                        b.getTimestamp()
                                .compareTo(a.getTimestamp()))
                .limit(limit)
                .toList();
    }

    // ==========================================
    // LOG STATISTICS (NO HARDCODE)
    // ==========================================

    public LogStatsResponse getLogStats() {

        List<LogDocument> logs = logRepository.findAll();

        long total = logs.size();

        long error = logs.stream()
                .filter(log ->
                        "ERROR".equalsIgnoreCase(log.getLevel()))
                .count();

        long warn = logs.stream()
                .filter(log ->
                        "WARN".equalsIgnoreCase(log.getLevel()))
                .count();

        long info = logs.stream()
                .filter(log ->
                        "INFO".equalsIgnoreCase(log.getLevel()))
                .count();

        // calculate logs per minute dynamically
        double logsPerMinute = calculateLogsPerMinute(logs);

        return LogStatsResponse.builder()
                .totalLogs(total)
                .logsPerMinute((long) logsPerMinute)
                .errorCount(error)
                .warningCount(warn)
                .infoCount(info)
                .build();
    }

    // ==========================================
    // HELPER: LOG RATE
    // ==========================================

    private double calculateLogsPerMinute(
            List<LogDocument> logs
    ) {

        if (logs.isEmpty()) return 0;

        LocalDateTime first =
                logs.stream()
                        .map(LogDocument::getTimestamp)
                        .min(LocalDateTime::compareTo)
                        .orElse(LocalDateTime.now());

        LocalDateTime last =
                logs.stream()
                        .map(LogDocument::getTimestamp)
                        .max(LocalDateTime::compareTo)
                        .orElse(LocalDateTime.now());

        long minutes =
                Duration.between(first, last).toMinutes();

        if (minutes == 0) minutes = 1;

        return (double) logs.size() / minutes;
    }
}