# Services Layer Guide

## Overview

The SmartOps AI frontend uses a clean service layer architecture for backend integration. All API calls go through reusable service modules.

## Architecture

```
Components (UI)
    ↓
Hooks (use-*, state management)
    ↓
Services (API calls)
    ↓
API Client (HTTP layer)
    ↓
Backend APIs
```

## Service Modules

### 1. Dashboard Service (`services/dashboard-service.ts`)

Handles all dashboard-related metrics and monitoring data.

**Methods:**
- `getMetrics()` - Current system metrics
- `getSystemHealth()` - Overall system health status
- `getPerformanceMetrics(metric, timeRange)` - Historical metrics
- `getRealTimeMetrics()` - Real-time data
- `getKafkaMetrics()` - Kafka cluster stats

**Usage:**

```typescript
import { dashboardService } from '@/services/dashboard-service';

const metrics = await dashboardService.getMetrics();
console.log(`CPU: ${metrics.cpuMetric}%`);
console.log(`Memory: ${metrics.memoryMetric}%`);
```

### 2. Service Health Service (`services/service-health.ts`)

Monitors microservice health and status.

**Methods:**
- `getServices()` - All services with health status
- `getServiceHealth(id)` - Single service details
- `getServiceMetrics(id, timeRange)` - Service performance metrics
- `getServiceLogs(id, limit)` - Service logs
- `getServiceUptime(id)` - Uptime information
- `checkAllServices()` - Quick health summary

**Usage:**

```typescript
import { serviceHealthService } from '@/services/service-health';

const services = await serviceHealthService.getServices();
services.forEach(svc => {
  console.log(`${svc.name}: ${svc.status}`);
});
```

### 3. Log Service (`services/log-service.ts`)

Retrieves and streams application logs.

**Methods:**
- `getLogs(filter)` - Logs with filtering
- `getRecentLogs(limit)` - Latest logs
- `getServiceLogs(serviceId)` - Service-specific logs
- `getLogsByLevel(level)` - Filter by severity
- `searchLogs(query)` - Full-text search
- `getLogStats()` - Log statistics
- `subscribeToLogs(onMessage)` - WebSocket subscription

**Usage:**

```typescript
import { logService } from '@/services/log-service';

// Fetch logs
const logs = await logService.getRecentLogs(50);

// Subscribe to live updates
const unsubscribe = logService.subscribeToLogs(
  (newLog) => {
    console.log('New log:', newLog);
  },
  (error) => {
    console.error('Connection error:', error);
  }
);

// Cleanup when done
unsubscribe();
```

### 4. Alert Service (`services/alert-service.ts`)

Manages alerts and notifications.

**Methods:**
- `getAlerts(filter)` - All alerts
- `getActiveAlerts()` - Only active alerts
- `getCriticalAlerts()` - Critical severity
- `getAlertStats()` - Alert statistics
- `acknowledgeAlert(id)` - Mark as acknowledged
- `resolveAlert(id)` - Mark as resolved
- `deleteAlert(id)` - Remove alert
- `subscribeToAlerts(onAlert)` - WebSocket subscription

**Usage:**

```typescript
import { alertService } from '@/services/alert-service';

// Fetch alerts
const alerts = await alertService.getActiveAlerts();

// Take action on alert
await alertService.acknowledgeAlert(alertId);
await alertService.resolveAlert(alertId);

// Subscribe to new alerts
const unsubscribe = alertService.subscribeToAlerts(
  (alert) => {
    if (alert.severity === 'critical') {
      showNotification(alert.message);
    }
  }
);
```

## Custom Hooks

### useDashboard

Fetches dashboard metrics with polling.

```typescript
const { metrics, loading, error, refetch } = useDashboard(5000);

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;

return <Dashboard metrics={metrics} />;
```

### useServices

Fetches service health status with polling.

```typescript
const { services, loading, error, refetch } = useServices(30000);

if (loading) return <LoadingSpinner />;

return (
  <div>
    {services.map(svc => (
      <ServiceCard key={svc.id} service={svc} />
    ))}
  </div>
);
```

### useAlerts

Manages alerts with WebSocket subscription.

```typescript
const {
  alerts,
  stats,
  loading,
  error,
  refetch,
  acknowledge,
  resolve,
  delete: deleteAlert
} = useAlerts(true);

// Handle new alerts
const handleNewAlert = async (alertId) => {
  await acknowledge(alertId);
  showNotification('Alert acknowledged');
};
```

### useNotification

Toast notifications for user feedback.

```typescript
const { notify, success, error, warning, info } = useNotification();

// Simple notification
notify('Operation completed', 'success');

// Specific type
success('User created successfully');
error('Failed to update profile');
warning('This action cannot be undone');
```

## API Client

### Core Functionality

The `ApiClient` handles:

- HTTP requests with Axios
- JWT token attachment
- Automatic token refresh on 401
- Request/response logging (dev)
- Error handling and formatting
- Timeout management

**Usage:**

```typescript
import { apiClient } from '@/lib/api-client';

// GET
const response = await apiClient.get('/api/logs');

// POST
const response = await apiClient.post('/api/alerts', {
  title: 'CPU High',
  message: 'CPU usage exceeded 80%'
});

// PUT
await apiClient.put('/api/alerts/123/resolve');

// DELETE
await apiClient.delete('/api/logs/123');
```

## Error Handling

All services include error handling:

```typescript
try {
  const metrics = await dashboardService.getMetrics();
} catch (error) {
  // Error is automatically logged
  // Display error to user
  showError('Failed to load metrics');
}
```

Hooks provide error state:

```typescript
const { error } = useDashboard();

if (error) {
  return (
    <ErrorAlert
      message={error.message}
      action={() => refetch()}
    />
  );
}
```

## Constants

API endpoints and configuration in `lib/constants.ts`:

```typescript
import { ENDPOINTS, POLLING_INTERVALS, API_CONFIG } from '@/lib/constants';

// Use endpoints
const url = ENDPOINTS.LOGS;

// Use polling intervals
const interval = POLLING_INTERVALS.DASHBOARD; // 5000ms

// Use API config
const baseUrl = API_CONFIG.BASE_URL;
```

## Best Practices

1. **Always use hooks instead of calling services directly**
   ```typescript
   // Good
   const { metrics } = useDashboard();

   // Avoid
   const metrics = await dashboardService.getMetrics();
   ```

2. **Handle loading and error states**
   ```typescript
   if (loading) return <Skeleton />;
   if (error) return <ErrorBoundary />;
   return <Content />;
   ```

3. **Use WebSocket subscriptions for real-time data**
   ```typescript
   const { alerts } = useAlerts(true); // Enable WebSocket
   ```

4. **Configure polling intervals appropriately**
   ```typescript
   // Fast updates (charts)
   useDashboard(5000);

   // Slower updates (health checks)
   useServices(30000);
   ```

5. **Always cleanup subscriptions**
   ```typescript
   useEffect(() => {
     const unsubscribe = logService.subscribeToLogs(onMessage);
     return () => unsubscribe();
   }, []);
   ```

## Adding New Services

To add a new service:

1. Create `services/new-service.ts`
2. Define interfaces for data types
3. Create service object with methods
4. Use ApiClient for HTTP calls
5. Handle errors and logging
6. Create corresponding hook if needed

**Example:**

```typescript
// services/new-service.ts
import { apiClient } from '@/lib/api-client';

export interface NewData {
  id: string;
  name: string;
  // ...
}

export const newService = {
  async getData(): Promise<NewData[]> {
    try {
      const response = await apiClient.get<NewData[]>('/api/new');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw error;
    }
  },
};

// hooks/use-new-data.ts
import { useState, useEffect } from 'react';
import { newService, NewData } from '@/services/new-service';

export function useNewData() {
  const [data, setData] = useState<NewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await newService.getData();
        setData(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { data, loading, error };
}
```

## Testing

### Mock Services

For testing, create mock implementations:

```typescript
// services/dashboard-service.ts
export const dashboardService = 
  process.env.NODE_ENV === 'test' 
    ? mockDashboardService
    : realDashboardService;
```

### Test Hooks

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useDashboard } from '@/hooks/use-dashboard';

test('loads dashboard metrics', async () => {
  const { result } = renderHook(() => useDashboard());

  await waitFor(() => {
    expect(result.current.metrics).toBeDefined();
  });
});
```

## Performance Tips

1. **Use polling intervals wisely** - Don't poll too frequently
2. **Cache data appropriately** - Use React Query for caching
3. **Debounce search** - Avoid excessive API calls
4. **Lazy load data** - Load only what's needed
5. **Cancel pending requests** - Clean up on unmount

---

**Status:** Production Ready
**Last Updated:** May 9, 2026
