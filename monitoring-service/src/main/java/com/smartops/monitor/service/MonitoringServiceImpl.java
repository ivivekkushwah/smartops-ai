package com.smartops.monitor.service;

import com.smartops.monitor.dto.*;
import com.smartops.monitor.kafka.KafkaProducerService;
import com.smartops.monitor.model.ServiceStatus;
import com.smartops.monitor.repository.ServiceStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

import java.util.List;
import java.util.Map;
import java.util.*;

@Service
@RequiredArgsConstructor
public class MonitoringServiceImpl implements MonitoringService {

    private final ServiceStatusRepository repository;
    private final KafkaProducerService producer;


    RestTemplate restTemplate = new RestTemplate();



    // ==========================================
    // ADD SERVICE (USER ADDS SERVICE)
    // ==========================================

    @Override
    public ServiceStatus addService(ServiceStatusRequest request, String userId) {

        ServiceStatus entity = new ServiceStatus();

        entity.setUserId(userId);                     // ✅ IMPORTANT
        entity.setServiceName(request.getServiceName());
        entity.setBaseUrl(request.getBaseUrl());
        ServiceStatus saved = repository.save(entity);   // 🔥 MUST
        producer.sendLog(
                "MONITORING",
                "INFO",
                "New service added: " + request.getServiceName(),
                userId
        );
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
    public ServiceStatus getServiceById(String serviceId, String userId) {
        ServiceStatus service = repository.findById(serviceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));
        if (!userId.equals(service.getUserId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found");
        }
        return service;
    }

    // ==========================================
    // SERVICE HEALTH
    // ==========================================

    @Override
    public ServiceStatus getServiceHealth(String serviceId, String userId) {
        return getServiceById(serviceId, userId);
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

        double totalCpu = 0;
        double totalMemory = 0;
        double totalRequests = 0;
        double totalResponseTime = 0;

        for (ServiceStatus s : services) {

            double cpu = getMetricValue(
                    s.getBaseUrl(),
                    "system.cpu.usage"
            );

            double memory = getMetricValue(
                    s.getBaseUrl(),
                    "jvm.memory.used"
            );

            totalCpu += cpu * 100;

            // bytes → MB
            totalMemory += memory / (1024 * 1024);

            if (s.getResponseTime() > 0) {
                totalResponseTime += s.getResponseTime();
            }

            totalRequests += 1;
        }

        double avgCpu =
                services.isEmpty() ? 0 : totalCpu / services.size();

        double avgMemory =
                services.isEmpty() ? 0 : totalMemory / services.size();

        double avgResponseTime =
                services.isEmpty() ? 0 : totalResponseTime / services.size();

        double errorRate =
                total == 0 ? 0 :
                        ((total - active) * 100.0) / total;

        return DashboardMetricsResponse.builder()
                .totalLogs(total)
                .activeServices(active)
                .cpuMetric(avgCpu)
                .memoryMetric(avgMemory)
                .requestThroughput(totalRequests)
                .errorRate(errorRate)
                .serviceUptime(100 - errorRate)
                .kafkaMetrics(getKafkaMetrics(userId))
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
            String timeRange,
            String userId
    ) {

        ServiceStatus service = getServiceById(serviceId, userId);

        List<PerformanceMetricResponse> metrics = List.of(
                PerformanceMetricResponse.builder()
                        .timestamp(service.getLastChecked())
                        .value(service.getResponseTime())
                        .label(service.getServiceName())
                        .build()
        );

        return metrics;
    }

    // ==========================================
    // REALTIME METRICS
    // ==========================================

    @Override
    public RealTimeMetricsResponse getRealtimeMetrics(String userId) {

        List<ServiceStatus> services = repository.findByUserId(userId);

        double totalCpu = 0;
        double totalMemory = 0;
        double totalResponseTime = 0;

        int activeConnections = 0;

        for (ServiceStatus s : services) {

            if ("UP".equalsIgnoreCase(s.getStatus())) {
                activeConnections++;
            }

            double cpu = getMetricValue(
                    s.getBaseUrl(),
                    "system.cpu.usage"
            );

            double memory = getMetricValue(
                    s.getBaseUrl(),
                    "jvm.memory.used"
            );

            totalCpu += cpu * 100;

            // bytes → MB
            totalMemory += memory / (1024 * 1024);

            if (s.getResponseTime() > 0) {
                totalResponseTime += s.getResponseTime();
            }
        }

        double avgCpu =
                services.isEmpty() ? 0 : totalCpu / services.size();

        double avgMemory =
                services.isEmpty() ? 0 : totalMemory / services.size();

        double avgResponseTime =
                services.isEmpty() ? 0 : totalResponseTime / services.size();

        double errorRate =
                services.isEmpty()
                        ? 0
                        : ((services.size() - activeConnections) * 100.0)
                        / services.size();

        RealTimeMetricsResponse metrics =
                RealTimeMetricsResponse.builder()
                        .cpuUsage(avgCpu)
                        .memoryUsage(avgMemory)
                        .requestRate(avgResponseTime)
                        .errorRate(errorRate)
                        .activeConnections(activeConnections)
                        .build();

        return metrics;
    }

    // ==========================================
    // SERVICE LOGS
    // ==========================================

    @Override
    public List<Map<String, Object>> getServiceLogs(String serviceId, int limit, String userId) {

        ServiceStatus service = getServiceById(serviceId, userId);

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
    public Map<String, Object> getServiceUptime(String serviceId, String userId) {

        ServiceStatus service = getServiceById(serviceId, userId);

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
    public KafkaMetricsResponse getKafkaMetrics(String userId) {

        long totalServices = repository.findByUserId(userId).size();

        KafkaMetricsResponse kafkaMetrics =
                KafkaMetricsResponse.builder()
                        .topicsCount(1)
                        .producerCount(1)
                        .consumerCount(1)
                        .throughputMbps(totalServices * 1.5)
                        .build();

        return kafkaMetrics;
    }

    // ==========================================
    // CORE MONITORING LOGIC (AUTO CHECK)
    // ==========================================
    private double getMetricValue(String url, String metricName) {

        try {

            Map response =
                    restTemplate.getForObject(
                            url + "/actuator/metrics/" + metricName,
                            Map.class
                    );

            List<Map<String, Object>> measurements =
                    (List<Map<String, Object>>) response.get("measurements");

            if (measurements != null && !measurements.isEmpty()) {

                Object value = measurements.get(0).get("value");

                return Double.parseDouble(value.toString());
            }

        } catch (Exception e) {

        }

        return 0;
    }


    @Override
    @Scheduled(
            fixedRateString =
                    "${monitoring.polling-rate}"
    )
    public void monitorServices() {




        List<ServiceStatus> services = repository.findAll();

        for (ServiceStatus s : services) {

            long start = System.currentTimeMillis();

            String previousStatus = s.getStatus(); // 🔥 IMPORTANT

            producer.sendLog(
                    "MONITORING",
                    "INFO",
                    "Checking service: " + s.getServiceName(),
                    s.getUserId()
            );

            try {
                restTemplate.getForObject(
                        s.getBaseUrl() + "/actuator/health",
                        String.class
                );

                long time = System.currentTimeMillis() - start;

                s.setStatus("UP");
                s.setResponseTime(time);

                producer.sendLog(
                        "MONITORING",
                        "INFO",
                        "Service UP: " + s.getServiceName(),
                        s.getUserId()
                );



            } catch (Exception e) {

                producer.sendLog(
                        "MONITORING",
                        "ERROR",
                        "Service DOWN: " + s.getServiceName(),
                        s.getUserId()
                );



                s.setStatus("DOWN");
                s.setResponseTime(-1L);

            }

            // 🔥 IMPORTANT (you deleted this)
            s.setLastChecked(LocalDateTime.now());

            // 🔥 IMPORTANT (you deleted this)
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
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));

        // 🔒 Security check (VERY IMPORTANT)
        if (!service.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found");
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
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));

        // 🔒 Security check
        if (!service.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found");
        }

        producer.sendLog(
                "MONITORING",
                "WARN",
                "Service deleted: " + service.getServiceName(),
                userId
        );

        repository.delete(service);
    }

    @Override
    public void deleteServicesByUserId(String userId) {
        repository.deleteByUserId(userId);
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

                    yield getMetricValue(
                            s.getBaseUrl(),
                            "system.cpu.usage"
                    ) * 100;
                }

                case "memory" -> {

                    yield getMetricValue(
                            s.getBaseUrl(),
                            "jvm.memory.used"
                    ) / (1024 * 1024);
                }

                case "requests" -> {

                    yield s.getResponseTime();
                }

                case "errors" -> {

                    yield "DOWN".equalsIgnoreCase(s.getStatus()) ? 1 : 0;
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
