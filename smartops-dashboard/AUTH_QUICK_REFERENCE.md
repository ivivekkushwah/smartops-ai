# Authentication System - Quick Reference

## Most Common Tasks

### Use Auth State in a Component
```typescript
'use client';

import { useAuth } from '@/lib/auth-context';

export function MyComponent() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Not logged in</div>;
  
  return <div>Welcome {user?.name}</div>;
}
```

### Use Enhanced Auth Hook
```typescript
import { useAuth } from '@/hooks/use-auth';

export function UserProfile() {
  const { getUserInitials, getDisplayName, isLoggedIn, isReady } = useAuth();
  
  if (!isReady()) return null;
  return <p>{getDisplayName()} ({getUserInitials()})</p>;
}
```

### Handle Login
```typescript
const { login } = useAuth();

try {
  await login(email, password);
  // User logged in, redirect handled automatically
} catch (error) {
  // Show error: Invalid credentials
}
```

### Logout
```typescript
const { logout } = useAuth();

await logout();
// User logged out, redirects to /login
```

### Get User Info
```typescript
const { user } = useAuth();

console.log(user?.id);      // User ID
console.log(user?.email);   // User email
console.log(user?.name);    // User name
console.log(user?.avatar);  // User avatar URL
```

## Protected Routes Pattern

```typescript
// Routes automatically protected by:
// 1. proxy.ts (server-side)
// 2. (protected)/layout.tsx (client-side)
// 3. useAuth hook (component-level)

// These routes require authentication:
/dashboard
/services
/logs
/alerts
/analytics
/ai-insights
/settings

// These routes are public:
/login
/register
/forgot-password
```

## Form Validation

```typescript
import { validationUtils } from '@/lib/auth-utils';

// Email
if (!validationUtils.isValidEmail(email)) {
  // Invalid email
}

// Password
const { isValid, errors } = validationUtils.isValidPassword(password);
const strength = validationUtils.getPasswordStrength(password);
// Returns: 'weak' | 'fair' | 'good' | 'strong'

// Name
if (!validationUtils.isValidName(name)) {
  // Invalid name
}
```

## Error Handling

```typescript
import { errorUtils } from '@/lib/auth-utils';

try {
  // API call
} catch (error) {
  // Get error message
  const message = errorUtils.getErrorMessage(error);
  
  // Check error type
  if (errorUtils.isNetworkError(error)) {
    // Network error
  } else if (errorUtils.isAuthError(error)) {
    // Auth error (401/403)
  } else if (errorUtils.isValidationError(error)) {
    // Validation error (400)
  }
  
  // Get field errors
  const fieldErrors = errorUtils.getFieldErrors(error);
  // { email: 'Email already exists', ... }
}
```

## API Requests

```typescript
import { apiClient } from '@/lib/api-client';

// GET
const data = await apiClient.get('/api/endpoint');

// POST
const response = await apiClient.post('/api/endpoint', { data });

// PUT
await apiClient.put('/api/endpoint/1', { updated });

// PATCH
await apiClient.patch('/api/endpoint/1', { partial });

// DELETE
await apiClient.delete('/api/endpoint/1');
```

## Token Management

```typescript
import { tokenUtils } from '@/lib/auth-utils';

// Get tokens
const accessToken = tokenUtils.getAccessToken();
const refreshToken = tokenUtils.getRefreshToken();

// Check if authenticated
if (tokenUtils.isAuthenticated()) {
  // User is logged in and token not expired
}

// Clear tokens (logout)
tokenUtils.clearTokens();

// Check expiration
if (tokenUtils.isTokenExpired()) {
  // Token needs refresh
}
```

## Display Errors in UI

```typescript
import { AuthErrorHandler, AuthSuccessHandler } from '@/components/auth/auth-error-handler';

export function MyForm() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  return (
    <>
      <AuthErrorHandler 
        error={error} 
        onDismiss={() => setError('')}
        duration={5000}
        autoClose={true}
      />
      <AuthSuccessHandler
        message={success}
        onDismiss={() => setSuccess('')}
      />
      {/* Form */}
    </>
  );
}
```

## Environment Configuration

```env
# Development
NEXT_PUBLIC_API_URL=http://localhost:8080

# Production
NEXT_PUBLIC_API_URL=https://api.example.com
```

## API Response Format

```typescript
// Login response
{
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "avatar": "url"
  }
}

// Current user response
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "User Name",
  "avatar": "url"
}

// Error response
{
  "message": "Invalid credentials",
  "code": "INVALID_CREDENTIALS",
  "status": 401
}
```

## Interceptor Flow

```
Request
  ↓
[Add Bearer token from localStorage]
  ↓
Send to API
  ↓
Response
  ↓
[Check for 401]
  ├─→ YES: Attempt token refresh
  │    ├─→ Success: Update tokens & retry
  │    └─→ Failed: Clear tokens & redirect to /login
  └─→ NO: Return response
```

## Key Files Reference

| File | Purpose |
|------|---------|
| `lib/auth-service.ts` | Core auth API client |
| `lib/auth-context.tsx` | Global auth state |
| `lib/api-client.ts` | HTTP client for requests |
| `lib/auth-utils.ts` | Validation & utilities |
| `types/auth.ts` | TypeScript types |
| `hooks/use-auth.ts` | Enhanced auth hook |
| `proxy.ts` | Route protection |
| `app/(protected)/layout.tsx` | Protected layout |
| `components/auth/auth-error-handler.tsx` | Error display |
| `components/layout/navbar.tsx` | User menu |

## Testing Quick Commands

```bash
# Build
pnpm build

# Development server
pnpm dev

# Check for errors
pnpm lint

# Type check
pnpm type-check
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| User not logged in after refresh | Check localStorage has tokens |
| Automatic redirect loops | Verify API token format |
| Cannot access protected routes | Check AuthProvider in layout.tsx |
| Error messages not showing | Use `AuthErrorHandler` component |
| Tokens not attaching to requests | Check axios interceptors in auth-service.ts |

## Production Checklist

- [ ] Set `NEXT_PUBLIC_API_URL` to production endpoint
- [ ] Test all auth flows with backend
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up error monitoring
- [ ] Test on multiple browsers
- [ ] Verify mobile responsiveness
- [ ] Document API endpoints
- [ ] Set up SSL certificates
- [ ] Configure firewall rules

## Need Help?

1. **Documentation:** See `AUTH_SYSTEM.md`
2. **Implementation Details:** See `AUTHENTICATION_CHECKLIST.md`
3. **Code Examples:** Check `app/(auth)/login/page.tsx`
4. **Error Handling:** Check `lib/auth-utils.ts`
5. **Types:** Check `types/auth.ts`
