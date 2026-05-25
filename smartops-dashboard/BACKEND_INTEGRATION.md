# Backend Integration Guide - SmartOps AI

This document provides complete instructions for integrating the SmartOps AI frontend with your Spring Boot microservices backend.

## Overview

The frontend is ready for integration with:
- **API Gateway** - Central endpoint for all REST APIs
- **WebSocket Server** - Real-time updates via STOMP + SockJS
- **Microservices** - Auth, Monitoring, Logs, Alerts, Service Registry

## Quick Start

### 1. Configure Environment Variables

Create `.env.local` from the example file:

```bash
cp .env.local.example .env.local
```

Update with your backend URLs:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=ws://localhost:8082/ws
NEXT_PUBLIC_DASHBOARD_POLL_INTERVAL=5000
NEXT_PUBLIC_SERVICE_POLL_INTERVAL=30000
NEXT_PUBLIC_ENABLE_WEBSOCKET=true
```

### 2. Required Backend Services

The frontend expects these services running:

| Service | Port | Endpoints |
|---------|------|-----------|
| API Gateway | 8080 | `/api/*` |
| WebSocket Server | 8082 | `/ws` |
| Monitoring Service | 8084 | `/api/monitoring/*` |
| Log Service | 8085 | `/api/logs/*` |
| Alert Service | 8086 | `/api/alerts/*` |
| Auth Service | 8081 | `/api/auth/*` |
| Eureka Server | 8761 | Service registry |

## API Endpoints

### Authentication Endpoints

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://..."
  }
}
```

### Dashboard Metrics

```
GET /api/monitoring/metrics

Response:
{
  "totalLogs": 15234,
  "activeServices": 6,
  "cpuMetric": 45.2,
  "memoryMetric": 62.8,
  "errorRate": 0.5,
  "requestThroughput": 2400,
  "kafkaMetrics": {
    "topicsCount": 12,
    "producerCount": 8,
    "consumerCount": 15,
    "throughputMbps": 125.5
  },
  "serviceUptime": 99.97
}
```

### Service Health

```
GET /api/services/health

Response:
[
  {
    "id": "auth-service-1",
    "name": "AUTH-SERVICE",
    "status": "online",
    "responseTime": 42,
    "uptime": 99.97,
    "cpu": 34,
    "memory": 61,
    "port": 8081,
    "lastHealthCheck": "2026-05-09T12:00:00Z",
    "errorRate": 0.2
  },
  ...
]
```

### Logs Endpoints

```
GET /api/logs?level=ERROR&limit=50

Response:
[
  {
    "id": "log-123",
    "timestamp": "2026-05-09T12:00:00Z",
    "level": "ERROR",
    "serviceId": "auth-service-1",
    "message": "Database connection failed",
    "source": "com.example.service.DB",
    "metadata": {
      "connectionString": "jdbc:mysql://...",
      "duration": 5000
    }
  },
  ...
]
```

### Alerts Endpoints

```
GET /api/alerts

Response:
[
  {
    "id": "alert-123",
    "title": "High CPU Usage",
    "message": "CPU usage exceeded 80%",
    "severity": "warning",
    "status": "active",
    "serviceId": "monitoring-service-1",
    "source": "CPU_MONITOR",
    "timestamp": "2026-05-09T12:00:00Z"
  },
  ...
]

PUT /api/alerts/alert-123/acknowledge
PUT /api/alerts/alert-123/resolve
DELETE /api/alerts/alert-123
```

## WebSocket Integration

### Connection

```typescript
const wsUrl = 'ws://localhost:8082/ws';
const socket = new WebSocket(wsUrl);

socket.onopen = () => {
  console.log('WebSocket connected');
};
```

### Topics

Subscribe to real-time updates:

```typescript
// Logs
/topic/logs

// Alerts  
/topic/alerts

// Service status
/topic/services

// Metrics updates
/topic/metrics
```

### Message Format

```json
{
  "type": "LOG",
  "data": {
    "id": "log-123",
    "timestamp": "2026-05-09T12:00:00Z",
    "level": "ERROR",
    "message": "Service unavailable"
  }
}
```

## Data Structures

### DashboardMetrics

```typescript
interface DashboardMetrics {
  totalLogs: number;
  activeServices: number;
  cpuMetric: number;      // percentage
  memoryMetric: number;   // percentage
  errorRate: number;      // percentage
  requestThroughput: number; // requests/second
  kafkaMetrics: KafkaMetrics;
  serviceUptime: number;  // percentage
}
```

### ServiceStatus

```typescript
interface ServiceStatus {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'degraded';
  responseTime: number;   // milliseconds
  uptime: number;         // percentage
  cpu: number;            // percentage
  memory: number;         // percentage
  port: number;
  lastHealthCheck: string;
  errorRate: number;      // percentage
}
```

### Log

```typescript
interface Log {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  serviceId: string;
  message: string;
  source: string;
  metadata?: Record<string, any>;
  traceId?: string;
}
```

### Alert

```typescript
interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'active' | 'resolved' | 'acknowledged';
  serviceId: string;
  source: string;
  timestamp: string;
  resolvedAt?: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
}
```

## Error Handling

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (token expired)
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error
- `503` - Service Unavailable

### Error Response Format

```json
{
  "status": 400,
  "error": "BAD_REQUEST",
  "message": "Invalid parameters",
  "timestamp": "2026-05-09T12:00:00Z",
  "path": "/api/logs"
}
```

### Frontend Error Handling

All API errors are caught and handled automatically:

```typescript
// Services automatically log errors
// useHooks provide error state
const { data, error, loading } = useDashboard();

if (error) {
  // Error is displayed to user
}
```

## Polling Configuration

The frontend polls the backend at configurable intervals:

```typescript
// Dashboard metrics - every 5 seconds
NEXT_PUBLIC_DASHBOARD_POLL_INTERVAL=5000

// Service health - every 30 seconds  
NEXT_PUBLIC_SERVICE_POLL_INTERVAL=30000

// Logs - every 10 seconds (if not using WebSocket)
NEXT_PUBLIC_LOG_POLL_INTERVAL=10000
```

Adjust these based on your backend's performance and requirements.

## Authentication Flow

1. **Login** - User credentials → JWT tokens (access + refresh)
2. **Token Storage** - Tokens stored in localStorage
3. **Request Attachment** - Access token automatically attached to requests
4. **Token Refresh** - Automatic refresh on 401 response
5. **Logout** - Clear tokens and redirect to login

## CORS Configuration

Your backend must allow requests from the frontend domain:

```java
@Configuration
public class CorsConfig {
  @Bean
  public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
      @Override
      public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
          .allowedOrigins("http://localhost:3000", "https://yourdomain.com")
          .allowedMethods("*")
          .allowedHeaders("*")
          .allowCredentials(true);
      }
    };
  }
}
```

## WebSocket CORS

Configure STOMP with SockJS for WebSocket:

```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
  @Override
  public void registerStompEndpoints(StompEndpointRegistry registry) {
    registry.addEndpoint("/ws")
      .setAllowedOrigins("http://localhost:3000", "https://yourdomain.com")
      .withSockJS();
  }
}
```

## Deployment Checklist

- [ ] Configure all backend service URLs in `.env.local`
- [ ] Ensure CORS is enabled on backend
- [ ] Test authentication flow
- [ ] Verify all API endpoints return expected data
- [ ] Test WebSocket connections
- [ ] Configure proper error handling
- [ ] Set up monitoring and logging
- [ ] Test with production data volume
- [ ] Enable HTTPS/WSS for production
- [ ] Configure rate limiting on backend

## Testing Integration

### Manual Testing

1. Start backend services
2. Set environment variables
3. Run dev server: `pnpm dev`
4. Open http://localhost:3000/login
5. Log in with test credentials
6. Verify dashboard loads real data
7. Check browser console for errors

### API Testing Tools

Use Postman or curl to test endpoints:

```bash
# Test login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Test metrics
curl http://localhost:8080/api/monitoring/metrics \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test logs
curl "http://localhost:8080/api/logs?limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Troubleshooting

### Connection Refused

- Check if backend services are running
- Verify API URLs in `.env.local`
- Check firewall/network settings

### 401 Unauthorized

- Token may have expired
- Check token in localStorage
- Verify token format (Bearer token)
- Ensure backend validates JWT correctly

### CORS Errors

- Verify CORS is enabled on backend
- Check allowed origins match frontend URL
- Verify preflight requests return 200

### WebSocket Connection Failed

- Check WebSocket URL
- Verify STOMP endpoint is registered
- Check SockJS fallback is enabled
- Verify CORS allows WebSocket upgrades

### Slow Response Times

- Check backend service performance
- Verify database connections
- Monitor network latency
- Adjust polling intervals if needed

## Next Steps

1. Implement required API endpoints in Spring Boot
2. Set up proper error responses
3. Configure service discovery (Eureka)
4. Implement JWT authentication
5. Set up WebSocket message broker
6. Test end-to-end flow
7. Deploy to production

## Support

For issues or questions:
1. Check browser console for error messages
2. Check backend server logs
3. Verify all environment variables are set
4. Test APIs directly with curl/Postman
5. Check network tab in browser dev tools

---

**Last Updated:** May 9, 2026
**Status:** Ready for Backend Integration
