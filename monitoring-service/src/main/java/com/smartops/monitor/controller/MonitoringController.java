package com.smartops.monitor.controller;

import com.smartops.monitor.dto.*;
import com.smartops.monitor.model.ServiceStatus;
import com.smartops.monitor.service.MonitoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/monitor")
@RequiredArgsConstructor
public class MonitoringController {

    private final MonitoringService monitoringService;

    // ==========================================
    // ADD SERVICE (NEW - CORE FEATURE)
    // ==========================================

    @PostMapping("/services")
    public ServiceStatus addService(
            @RequestBody ServiceStatusRequest request,
            @RequestHeader("X-User-Id") String userId
    ) {
        System.out.println("🔥 ADD SERVICE API HIT");
        System.out.println(request.toString());
        return monitoringService.addService(request, userId);
    }

    // ==========================================
    // GET USER SERVICES
    // ==========================================

    @GetMapping("/services")
    public List<ServiceStatus> getUserServices(
            @RequestHeader("X-User-Id") String userId
    ) {
        System.out.println("🔥 get SERVICE API HIT"); // keep this
        return monitoringService.getServicesByUser(userId);
    }

    // ==========================================
    // GET SINGLE SERVICE
    // ==========================================

    @GetMapping("/services/{serviceId}")
    public ServiceStatus getServiceById(
            @PathVariable String serviceId
    ) {
        System.out.println("🔥 get by id SERVICE API HIT"); // keep this
        return monitoringService.getServiceById(serviceId);
    }

    // 🔥 UPDATE SERVICE
    @PutMapping("/services/{id}")
    public ResponseEntity<ServiceStatus> updateService(
            @PathVariable String id,
            @RequestBody ServiceStatusRequest request,
            @RequestHeader("X-User-Id") String userId
    ) {

        ServiceStatus updated = monitoringService.updateService(id, request, userId);
        return ResponseEntity.ok(updated);
    }

    // 🔥 DELETE SERVICE
    @DeleteMapping("/services/{id}")
    public ResponseEntity<?> deleteService(
            @PathVariable String id,
            @RequestHeader("X-User-Id") String userId
    ) {

        monitoringService.deleteService(id, userId);
        return ResponseEntity.ok("Service deleted successfully");
    }

    // ==========================================
    // SERVICE HEALTH
    // ==========================================

    @GetMapping("/services/{serviceId}/health")
    public ServiceStatus getServiceHealth(
            @PathVariable String serviceId
    ) {
        System.out.println("🔥 /services/{serviceId}/health SERVICE API HIT"); // keep this
        return monitoringService.getServiceHealth(serviceId);
    }



    // ==========================================
    // SERVICE METRICS
    // ==========================================

    @GetMapping("/services/{serviceId}/metrics")
    public List<PerformanceMetricResponse> getServiceMetrics(
            @PathVariable String serviceId,
            @RequestParam(defaultValue = "hour") String timeRange
    ) {
        System.out.println("🔥 /services/{serviceId}/metrics SERVICE API HIT");
        return monitoringService.getPerformanceMetrics(
                serviceId,
                timeRange
        );
    }

    // ==========================================
    // SERVICE LOGS
    // ==========================================

    @GetMapping("/services/{serviceId}/logs")
    public List<Map<String, Object>> getServiceLogs(
            @PathVariable String serviceId,
            @RequestParam(defaultValue = "100") int limit
    ) {
        System.out.println("🔥 /services/{serviceId}/logs SERVICE API HIT");
        return monitoringService.getServiceLogs(serviceId, limit);
    }

    // ==========================================
    // SERVICE UPTIME
    // ==========================================

    @GetMapping("/services/{serviceId}/uptime")
    public Map<String, Object> getServiceUptime(
            @PathVariable String serviceId
    ) {
        System.out.println("🔥 /services/{serviceId}/uptime SERVICE API HIT");
        return monitoringService.getServiceUptime(serviceId);
    }

    // ==========================================
    // USER DASHBOARD (FILTERED)
    // ==========================================

    @GetMapping("/dashboard")
    public DashboardMetricsResponse getUserDashboard(
            @RequestHeader("X-User-Id") String userId
    ) {
        System.out.println("🔥 /dashboard SERVICE API HIT");
        return monitoringService.getDashboardMetrics(userId);
    }

    @GetMapping("/health")
    public SystemHealthResponse getSystemHealth(
            @RequestHeader("X-User-Id") String userId
    ) {
        System.out.println("🔥 /health SERVICE API HIT");
        return monitoringService.getSystemHealth(userId);
    }

    // ==========================================
    // REALTIME METRICS
    // ==========================================

    @GetMapping("/realtime")
    public RealTimeMetricsResponse getRealtimeMetrics(
            @RequestHeader("X-User-Id") String userId
    ) {
        return monitoringService.getRealtimeMetrics(userId);
    }

    // ==========================================
    // KAFKA METRICS (GLOBAL OR USER)
    // ==========================================

    @GetMapping("/kafka")
    public KafkaMetricsResponse getKafkaMetrics() {
        return monitoringService.getKafkaMetrics();
    }

    // ==========================================
    // MANUAL TRIGGER (DEBUG)
    // ==========================================

    @GetMapping("/check")
    public String triggerMonitoring() {
        monitoringService.monitorServices();
        return "Monitoring triggered";
    }

    @GetMapping("/metrics/{type}")
    public List<PerformanceMetricResponse> getMetricsByType(
            @PathVariable String type,
            @RequestParam(defaultValue = "day") String timeRange,
            @RequestHeader("X-User-Id") String userId
    ) {
        return monitoringService.getMetricsByType(type, timeRange, userId);
    }
}