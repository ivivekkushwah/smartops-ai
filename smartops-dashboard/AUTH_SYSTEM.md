# SmartOps AI Authentication System

## Overview

Complete, production-ready authentication system with JWT tokens, protected routes, and comprehensive error handling for the SmartOps AI enterprise monitoring dashboard.

## Architecture

### File Structure

```
lib/
├── auth-service.ts       # Auth API client with interceptors
├── auth-context.tsx      # React context for global auth state
├── api-client.ts         # General HTTP client for app requests
├── auth-utils.ts         # Utility functions for auth operations
types/
├── auth.ts              # TypeScript types and interfaces
hooks/
├── use-auth.ts          # Custom hook for auth state
components/
├── auth/
│   ├── form-input.tsx   # Reusable form input component
│   └── auth-error-handler.tsx  # Error/success message display
└── layout/
    ├── navbar.tsx       # Navigation with user menu
    └── sidebar.tsx      # App navigation menu
app/
├── (auth)/              # Public auth routes
│   ├── login/
│   ├── register/
│   └── forgot-password/
├── (protected)/         # Protected dashboard routes
│   ├── dashboard/
│   ├── services/
│   ├── logs/
│   ├── alerts/
│   ├── analytics/
│   ├── ai-insights/
│   └── settings/
proxy.ts               # Route protection middleware
```

## Authentication Flow

### 1. Login Flow

```
User Input → Validation → authService.login() → 
→ Store Tokens → Update Auth Context → Redirect to /dashboard
```

**Implementation:**
```typescript
// In login page
const { login } = useAuth();

const handleLogin = async (email: string, password: string) => {
  try {
    await login(email, password);
    router.push('/dashboard');
  } catch (error) {
    setError('Invalid credentials');
  }
};
```

### 2. Token Refresh Flow

```
HTTP 401 Response → Intercept in authService → 
→ Call refresh endpoint → Update tokens → Retry original request
```

**Automatic** - Handled in auth-service.ts request interceptor

### 3. Logout Flow

```
User Click Logout → authService.logout() → 
→ Clear Tokens → Update Context → Redirect to /login
```

## Components & Usage

### AuthProvider

Wraps the entire application to provide auth context.

```typescript
// In app/layout.tsx
import { AuthProvider } from '@/lib/auth-context';

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
```

### useAuth Hook

Access auth state and methods anywhere in the app.

```typescript
'use client';

import { useAuth } from '@/lib/auth-context';

export function MyComponent() {
  const { user, isAuthenticated, loading, login, logout } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Not logged in</div>;

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Enhanced useAuth Hook

Additional utilities from `hooks/use-auth.ts`:

```typescript
import { useAuth } from '@/hooks/use-auth';

export function UserAvatar() {
  const { user, getUserInitials, getDisplayName, isReady } = useAuth();

  if (!isReady()) return null;

  return (
    <div className="avatar">
      <span>{getUserInitials()}</span>
      <p>{getDisplayName()}</p>
    </div>
  );
}
```

## Protected Routes

### Route Protection Layers

**1. Server-side (proxy.ts)**
- Blocks access to protected routes without token in cookies
- Redirects unauthenticated users to /login
- Prevents authenticated users from accessing auth pages

**2. Client-side (Protected Layout)**
- Additional check using auth context
- Loading state while auth initializes
- Prevents flash of content

**3. Component-level (useAuth)**
- Check auth state before rendering sensitive content
- Conditional rendering based on user permissions

### Protected Pages

All dashboard pages are in `app/(protected)/` and require authentication:

```
/dashboard          - Main dashboard
/services          - Service monitoring
/logs              - Log viewer
/alerts            - Alert management
/analytics         - Analytics dashboard
/ai-insights       - AI insights
/settings          - User settings
```

## API Integration

### Backend Endpoints Required

The authentication system expects these Spring Boot endpoints:

```
POST   /api/auth/login              - User login
POST   /api/auth/register           - User registration
POST   /api/auth/logout             - User logout
GET    /api/auth/me                 - Get current user
POST   /api/auth/refresh            - Refresh access token
POST   /api/auth/forgot-password    - Request password reset
POST   /api/auth/reset-password     - Reset password with token
```

### Request/Response Format

**Login Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Login Response:**
```json
{
  "accessToken": "jwt_token_here",
  "refreshToken": "refresh_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "avatar": "avatar_url"
  }
}
```

## Token Management

### Token Storage

- **Access Token** - Stored in localStorage, expires in 1 hour
- **Refresh Token** - Stored in localStorage, used for automatic renewal
- **Cookies** - Set by backend for server-side validation

### Token Refresh

Automatic token refresh happens when:
- An API request receives a 401 response
- Auth service automatically calls refresh endpoint
- New tokens are stored and request is retried

### Token Clearing

Tokens are cleared on:
- User logout
- Token refresh failure (redirects to login)
- Session expiration

## Error Handling

### Error Types

**1. Authentication Errors (401)**
- Invalid credentials
- Expired token
- Token refresh failed

**2. Validation Errors (400)**
- Invalid email format
- Password requirements not met
- Required fields missing

**3. Server Errors (500)**
- Server issues
- Database errors

**4. Network Errors**
- Connection timeout
- No internet
- DNS resolution failure

### Error Display

Use `AuthErrorHandler` component for error display:

```typescript
import { AuthErrorHandler } from '@/components/auth/auth-error-handler';

export function LoginPage() {
  const [error, setError] = useState('');

  return (
    <>
      <AuthErrorHandler error={error} onDismiss={() => setError('')} />
      {/* Login form */}
    </>
  );
}
```

## Validation

### Built-in Validators

Located in `lib/auth-utils.ts`:

```typescript
import { validationUtils } from '@/lib/auth-utils';

// Email validation
validationUtils.isValidEmail('user@example.com'); // true

// Password validation
const result = validationUtils.isValidPassword('MyPass123!');
// { isValid: true, errors: [] }

// Password strength
validationUtils.getPasswordStrength('MyPass123!'); // 'strong'

// Name validation
validationUtils.isValidName('John Doe'); // true
```

## Configuration

### Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080

# Or for production
NEXT_PUBLIC_API_URL=https://api.example.com
```

## Loading States

### Auth Initialization

The `AuthProvider` loads auth state on mount:

```typescript
// In AuthProvider
useEffect(() => {
  const initializeAuth = async () => {
    setLoading(true);
    try {
      if (authService.isAuthenticated()) {
        const user = await authService.getCurrentUser();
        setUser(user);
      }
    } finally {
      setLoading(false);
    }
  };
  initializeAuth();
}, []);
```

### Loading Indicator

Protected pages show loading spinner while auth initializes:

```typescript
if (loading) {
  return <div className="spinner">Loading...</div>;
}
```

## Security Considerations

### Implemented Security Features

1. **JWT Tokens** - Secure token-based authentication
2. **HTTP Interceptors** - Automatic token attachment to requests
3. **Token Refresh** - Automatic renewal without user action
4. **Protected Routes** - Server and client-side protection
5. **Secure Storage** - localStorage for tokens (HttpOnly cookies for servers)
6. **CSRF Protection** - Built into Next.js
7. **XSS Prevention** - React escaping + sanitization
8. **Password Requirements** - Strong password enforcement

### Best Practices

1. Never log tokens in console (removed in production)
2. Always validate on backend
3. Use HTTPS in production
4. Implement rate limiting for login attempts
5. Clear tokens on logout
6. Implement account lockout after failed attempts
7. Add two-factor authentication (future enhancement)

## Development

### Testing Login

1. Visit http://localhost:3000
2. Redirects to /login
3. Enter credentials
4. Login successful → redirects to /dashboard
5. Click user avatar → click "Sign Out"
6. Logged out → redirects to /login

### Testing Protected Routes

1. Try accessing /dashboard without login → redirects to /login
2. Login successfully → access /dashboard
3. Try accessing /login while logged in → redirects to /dashboard

## Future Enhancements

- [ ] Two-factor authentication (2FA)
- [ ] OAuth2/Social login (Google, GitHub)
- [ ] Account recovery with email verification
- [ ] Session management and device tracking
- [ ] Role-based access control (RBAC)
- [ ] Biometric authentication support
- [ ] Token revocation/blacklisting
- [ ] Audit logging for auth events

## Troubleshooting

### "Redirects in a loop"
- Check that auth tokens are valid
- Verify API is returning correct token format
- Check localStorage is not corrupted

### "401 Errors on all requests"
- Verify access token is in localStorage
- Check Authorization header format: `Bearer {token}`
- Verify token has not expired

### "Cannot access protected routes"
- Check AuthProvider wraps entire app in layout.tsx
- Verify user is actually logged in
- Check proxy.ts middleware is configured correctly

### "Automatic token refresh not working"
- Verify refresh endpoint returns new tokens
- Check refresh token is stored in localStorage
- Monitor network tab for automatic refresh requests

## Support

For authentication-related issues, check:
1. Console for error messages
2. Network tab for API responses
3. localStorage for token presence
4. Backend logs for server errors
