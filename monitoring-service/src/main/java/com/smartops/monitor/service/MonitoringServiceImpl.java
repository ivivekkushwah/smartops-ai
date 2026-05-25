package com.smartops.monitor.service;

import com.smartops.monitor.dto.*;
import com.smartops.monitor.model.ServiceStatus;
import com.smartops.monitor.repository.ServiceStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;

import java.util.List;
import java.util.Map;
import com.smartops.monitor.dto.*;
import java.util.*;

@Service
@RequiredArgsConstructor
public class MonitoringServiceImpl implements MonitoringService {

    private final ServiceStatusRepository repository;
    private final SimpMessagingTemplate messagingTemplate;

    RestTemplate restTemplate = new RestTemplate();



    // ==========================================
    // ADD SERVICE (USER ADDS SERVICE)
    // ==========================================

    @Override
    public ServiceStatus addService(ServiceStatusRequest request, String userId) {

        System.out.println("🔥 INSIDE SERVICE LAYER");
        System.out.println("UserId: " + userId);

        ServiceStatus entity = new ServiceStatus();

        entity.setUserId(userId);                     // ✅ IMPORTANT
        entity.setServiceName(request.getServiceName());
        entity.setBaseUrl(request.getBaseUrl());

        ServiceStatus saved = repository.save(entity);   // 🔥 MUST

        System.out.println("✅ SAVED: " + saved);

        return saved;
    }

    // ==========================================
    // GET USER SERVICES
    // ==========================================

    @Override
    public List<ServiceStatus> getServicesByUser(String userId) {
        return repository.findByUserId(userId);
    }

    @Override
    public ServiceStatus getServiceById(String serviceId) {
        return repository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found"));
    }

    // ==========================================
    // SERVICE HEALTH
    // ==========================================

    @Override
    public ServiceStatus getServiceHealth(String serviceId) {
        return getServiceById(serviceId);
    }

    // ==========================================
    // DASHBOARD (USER BASED)
    // ==========================================

    @Override
    public DashboardMetricsResponse getDashboardMetrics(String userId) {

        List<ServiceStatus> services = repository.findByUserId(userId);

        long total = services.size();

        long active = services.stream()
                .filter(s -> "UP".equalsIgnoreCase(s.getStatus()))
                .count();

        double avgResponseTime = services.stream()
                .mapToDouble(ServiceStatus::getResponseTime)
                .average()
                .orElse(0.0);

        double errorRate = total == 0 ? 0 :
                ((total - active) * 100.0) / total;

        return DashboardMetricsResponse.builder()
                .totalLogs(total)
                .activeServices(active)
                .cpuMetric(avgResponseTime / 10)
                .memoryMetric(avgResponseTime / 8)
                .requestThroughput(avgResponseTime)
                .errorRate(errorRate)
                .serviceUptime(100 - errorRate)
                .kafkaMetrics(getKafkaMetrics())
                .build();
    }

    // ==========================================
    // SYSTEM HEALTH
    // ==========================================

    @Override
    public SystemHealthResponse getSystemHealth(String userId) {

        List<ServiceStatus> services = repository.findByUserId(userId);

        long active = services.stream()
                .filter(s -> "UP".equalsIgnoreCase(s.getStatus()))
                .count();

        long total = services.size();

        double healthPercent = total == 0 ? 0 :
                (active * 100.0) / total;

        String status =
                healthPercent > 80 ? "healthy" :
                        healthPercent > 50 ? "warning" :
                                "critical";

        return SystemHealthResponse.builder()
                .status(status)
                .timestamp(LocalDateTime.now().toString())
                .uptime((long) healthPercent)
                .version(System.getProperty("java.version"))
                .build();
    }

    // ==========================================
    // PERFORMANCE METRICS
    // ==========================================

    @Override
    public List<PerformanceMetricResponse> getPerformanceMetrics(
            String serviceId,
            String timeRange
    ) {

        ServiceStatus service = getServiceById(serviceId);

        List<PerformanceMetricResponse> metrics = List.of(
                PerformanceMetricResponse.builder()
                        .timestamp(service.getLastChecked())
                        .value(service.getResponseTime())
                        .label(service.getServiceName())
                        .build()
        );

        messagingTemplate.convertAndSend("/topic/metrics", metrics);

        return metrics;
    }

    // ==========================================
    // REALTIME METRICS
    // ==========================================

    @Override
    public RealTimeMetricsResponse getRealtimeMetrics(String userId) {

        List<ServiceStatus> services = repository.findByUserId(userId);

        double avgResponseTime = services.stream()
                .mapToDouble(ServiceStatus::getResponseTime)
                .average()
                .orElse(0.0);

        int activeConnections = (int) services.stream()
                .filter(s -> "UP".equalsIgnoreCase(s.getStatus()))
                .count();

        RealTimeMetricsResponse metrics =
                RealTimeMetricsResponse.builder()
                        .cpuUsage(avgResponseTime / 10)
                        .memoryUsage(avgResponseTime / 8)
                        .requestRate(avgResponseTime)
                        .errorRate(100 - activeConnections * 100.0 / Math.max(services.size(), 1))
                        .activeConnections(activeConnections)
                        .build();

        messagingTemplate.convertAndSend("/topic/realtime", metrics);

        return metrics;
    }

    // ==========================================
    // SERVICE LOGS
    // ==========================================

    @Override
    public List<Map<String, Object>> getServiceLogs(String serviceId, int limit) {

        ServiceStatus service = getServiceById(serviceId);

        Map<String, Object> log = new HashMap<>();

        log.put("timestamp", service.getLastChecked());
        log.put("level",
                "UP".equalsIgnoreCase(service.getStatus()) ? "INFO" : "ERROR");
        log.put("message",
                "UP".equalsIgnoreCase(service.getStatus())
                        ? "Service is running normally"
                        : "Service is DOWN or slow");
        log.put("serviceName", service.getServiceName());
        log.put("responseTime", service.getResponseTime());

        return List.of(log);
    }

    // ==========================================
    // SERVICE UPTIME
    // ==========================================

    @Override
    public Map<String, Object> getServiceUptime(String serviceId) {

        ServiceStatus service = getServiceById(serviceId);

        long uptime = "UP".equalsIgnoreCase(service.getStatus()) ? 100 : 0;

        return Map.of(
                "uptime", uptime,
                "lastChecked", service.getLastChecked(),
                "status", service.getStatus()
        );
    }

    // ==========================================
    // KAFKA METRICS
    // ==========================================

    @Override
    public KafkaMetricsResponse getKafkaMetrics() {

        long count = repository.count();

        KafkaMetricsResponse kafkaMetrics =
                KafkaMetricsResponse.builder()
                        .topicsCount((int) count)
                        .producerCount((int) count)
                        .consumerCount((int) count)
                        .throughputMbps(count * 2.5)
                        .build();

        messagingTemplate.convertAndSend("/topic/kafka", kafkaMetrics);

        return kafkaMetrics;
    }

    // ==========================================
    // CORE MONITORING LOGIC (AUTO CHECK)
    // ==========================================

    @Override
    @Scheduled(fixedRate = 5000)
    public void monitorServices() {

        List<ServiceStatus> services = repository.findAll();

        for (ServiceStatus s : services) {

            long start = System.currentTimeMillis();

            try {
                restTemplate.getForObject(s.getBaseUrl(), String.class);

                long time = System.currentTimeMillis() - start;

                s.setStatus("UP");
                s.setResponseTime(time);

            } catch (Exception e) {

                s.setStatus("DOWN");
                s.setResponseTime(-1L); // ✅ FIXED
            }

            s.setLastChecked(LocalDateTime.now());

            repository.save(s);
        }
    }

    @Override
    public ServiceStatus updateService(
            String id,
            ServiceStatusRequest request,
            String userId
    ) {

        ServiceStatus service = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        // 🔒 Security check (VERY IMPORTANT)
        if (!service.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        // 🔄 Update fields
        service.setServiceName(request.getServiceName());
        service.setBaseUrl(request.getBaseUrl());

        // Optional reset
        service.setStatus("UNKNOWN");
        service.setResponseTime(0L);

        return repository.save(service);
    }

    @Override
    public void deleteService(String id, String userId) {

        ServiceStatus service = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        // 🔒 Security check
        if (!service.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        repository.delete(service);
    }

    @Override
    public List<PerformanceMetricResponse> getMetricsByType(
            String type,
            String timeRange,
            String userId
    ) {

        List<ServiceStatus> services = repository.findByUserId(userId);

        List<PerformanceMetricResponse> result = new ArrayList<>();

        for (ServiceStatus s : services) {

            double value = switch (type.toLowerCase()) {

                case "cpu" -> {
                    // 🔥 Approx using response time
                    yield s.getResponseTime() > 0 ? s.getResponseTime() : 0;
                }

                case "memory" -> {
                    // 🔥 Approx (same as above for now)
                    yield s.getResponseTime() > 0 ? s.getResponseTime() : 0;
                }

                case "requests" -> {
                    // 🔥 From logs (Kafka/Mongo)
                    yield repository.countById(s.getId());
                }

                case "errors" -> {
                    // 🔥 From logs
                    yield repository.countErrorsById(s.getId());
                }

                default -> 0;
            };

            result.add(
                    new PerformanceMetricResponse(
                            LocalDateTime.now(),
                            value,
                            s.getServiceName()
                    )
            );
        }

        return result;
    }



}