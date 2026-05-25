package com.smartops.monitor.service;

import com.smartops.monitor.dto.*;
import com.smartops.monitor.model.ServiceStatus;

import java.util.List;
import java.util.Map;



public interface MonitoringService {

    // ==========================================
    // ADD SERVICE (NEW)
    // ==========================================

    ServiceStatus addService(ServiceStatusRequest request, String userId);

    // ==========================================
    // USER SERVICES
    // ==========================================

    List<ServiceStatus> getServicesByUser(String userId);

    ServiceStatus getServiceById(String serviceId);

    // ==========================================
    // SERVICE HEALTH
    // ==========================================

    ServiceStatus getServiceHealth(String serviceId);

    // ==========================================
    // SERVICE METRICS
    // ==========================================

    List<PerformanceMetricResponse> getPerformanceMetrics(
            String serviceId,
            String timeRange
    );

    // ==========================================
    // SERVICE LOGS
    // ==========================================

    List<Map<String, Object>> getServiceLogs(
            String serviceId,
            int limit
    );

    // ==========================================
    // SERVICE UPTIME
    // ==========================================

    Map<String, Object> getServiceUptime(String serviceId);

    // ==========================================
    // DASHBOARD (USER BASED)
    // ==========================================

    DashboardMetricsResponse getDashboardMetrics(String userId);

    SystemHealthResponse getSystemHealth(String userId);

    RealTimeMetricsResponse getRealtimeMetrics(String userId);

    // ==========================================
    // KAFKA METRICS
    // ==========================================

    KafkaMetricsResponse getKafkaMetrics();

    // ==========================================
    // MONITORING CORE (SCHEDULER)
    // ==========================================

    void monitorServices();

    ServiceStatus updateService(String id, ServiceStatusRequest request, String userId);

    void deleteService(String id, String userId);

    List<PerformanceMetricResponse> getMetricsByType(String type, String timeRange, String userId);
}