# SmartOps AI - Authentication Implementation Guide

## Overview
Complete JWT-based authentication system with protected routing for the SmartOps AI enterprise dashboard.

## Architecture

### Directory Structure
```
app/
├── (auth)/                    # Public auth routes
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── forgot-password/page.tsx
│   └── layout.tsx
├── (protected)/               # Protected dashboard routes
│   ├── dashboard/page.tsx
│   ├── services/page.tsx
│   ├── logs/page.tsx
│   ├── alerts/page.tsx
│   ├── analytics/page.tsx
│   ├── ai-insights/page.tsx
│   ├── settings/page.tsx
│   └── layout.tsx            # Auth guard for all protected routes
├── layout.tsx                 # Root layout with AuthProvider
└── page.tsx                   # Redirect to /login or /dashboard

lib/
├── auth-service.ts            # API client & token management
├── auth-context.tsx           # React Context for auth state

components/
├── layout/
│   ├── navbar.tsx            # Updated with user menu & logout
│   ├── sidebar.tsx
│   └── root-layout.tsx        # Route-aware layout wrapper
└── auth/
    └── form-input.tsx        # Reusable form input with validation

proxy.ts                        # Route protection middleware
```

## Features Implemented

### 1. Authentication Pages
- **Login** (`/login`): Email/password sign-in with validation
- **Register** (`/register`): User registration with password strength requirements
- **Forgot Password** (`/forgot-password`): Password reset flow with email confirmation

### 2. Protected Routes
All dashboard routes require authentication:
- `/dashboard` - System metrics and overview
- `/services` - Service health monitoring
- `/logs` - Real-time log streaming
- `/alerts` - Alert management
- `/analytics` - Performance analytics
- `/ai-insights` - AI-powered recommendations
- `/settings` - User settings and configuration

### 3. Authentication System

#### Auth Service (`lib/auth-service.ts`)
- JWT token management (localStorage)
- Axios HTTP client with interceptors
- Automatic token refresh on 401 response
- Token expiration handling
- Methods:
  - `login(credentials)` - Authenticate user
  - `register(data)` - Create new account
  - `getCurrentUser()` - Fetch logged-in user info
  - `logout()` - Clear tokens and session
  - `refreshAccessToken(token)` - Get new access token
  - `requestPasswordReset(email)` - Initiate password reset
  - `resetPassword(token, newPassword)` - Complete password reset

#### Auth Context (`lib/auth-context.tsx`)
- Global authentication state management
- User information storage
- Loading states
- Methods exposed:
  - `login(email, password)`
  - `register(email, password, name)`
  - `logout()`
  - `requestPasswordReset(email)`
  - State: `user`, `loading`, `isAuthenticated`

#### Route Protection (`proxy.ts`)
- Middleware-based route protection
- Redirects unauthenticated users to `/login`
- Redirects authenticated users away from `/login`, `/register`, `/forgot-password`
- Automatic routing: Root (`/`) redirects based on auth status

#### Protected Layout (`app/(protected)/layout.tsx`)
- Client-side auth guard for protected routes
- Shows loading spinner during auth check
- Redirects to login if not authenticated

### 4. UI Components

#### Form Input (`components/auth/form-input.tsx`)
- Email/text/password input fields
- Password visibility toggle
- Real-time error display
- Focus/blur styling
- Disabled state for loading

#### Updated Navbar (`components/layout/navbar.tsx`)
- User profile dropdown with logged-in name
- Logout button
- Profile settings link
- User initials avatar
- Dynamic based on auth state

#### Layout Wrapper (`components/layout/root-layout.tsx`)
- Smart layout switching based on current route
- Shows navbar + sidebar for protected routes
- Shows minimal layout for auth pages
- Uses `usePathname()` for route detection

## Backend API Endpoints

The system is prepared to connect to these Spring Boot endpoints:

```
POST /api/auth/login
  Request: { email, password }
  Response: { accessToken, refreshToken, user: { id, email, name, avatar } }

POST /api/auth/register
  Request: { email, password, name }
  Response: { accessToken, refreshToken, user: { ... } }

GET /api/auth/me
  Headers: Authorization: Bearer {accessToken}
  Response: { id, email, name, avatar }

POST /api/auth/logout
  Headers: Authorization: Bearer {accessToken}
  Response: { message }

POST /api/auth/refresh
  Request: { refreshToken }
  Response: { accessToken, refreshToken }

POST /api/auth/forgot-password
  Request: { email }
  Response: { message }

POST /api/auth/reset-password
  Request: { token, newPassword }
  Response: { message }
```

## Configuration

### Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Token Storage
- Access Token: `localStorage.accessToken`
- Refresh Token: `localStorage.refreshToken`
- Both tokens are cleared on logout

## Security Features

1. **Token Management**
   - Automatic token refresh on 401 response
   - Tokens cleared on logout
   - Refresh token used for obtaining new access tokens

2. **Route Protection**
   - Middleware-based request interception
   - Client-side auth guards
   - Protected route layout

3. **Form Validation**
   - Email format validation
   - Password strength requirements (min 8 chars, uppercase, number for register)
   - Password confirmation matching
   - Terms acceptance requirement

4. **Request Interceptors**
   - Automatic Authorization header injection
   - Token refresh handling
   - Error state management

## Usage

### Sign Up
1. Navigate to `/register`
2. Enter name, email, password (with strength requirements)
3. Accept terms and conditions
4. Click "Create Account"
5. Automatically logged in and redirected to `/dashboard`

### Sign In
1. Navigate to `/login`
2. Enter email and password
3. Click "Sign In"
4. Redirected to `/dashboard` on success

### Password Reset
1. On login page, click "Forgot password?"
2. Enter email address
3. Check email for reset link
4. Click link to reset password
5. Enter new password and confirm

### Logout
1. Click user avatar in navbar
2. Click "Sign Out"
3. Redirected to `/login`
4. Tokens cleared from storage

## Integration with Spring Boot

To integrate with your Spring Boot backend:

1. Set `NEXT_PUBLIC_API_URL` to your backend URL
2. Implement the API endpoints listed above
3. Return JWT tokens in the format shown
4. Ensure CORS is configured to allow requests from Next.js domain
5. Implement token refresh endpoint for automatic token rotation

## Error Handling

- Invalid credentials: Shows error message on login form
- Network errors: Displays error alerts
- Token expiration: Automatic refresh attempt
- Auth failures: Redirects to login page
- Form validation: Shows inline error messages

## Testing the Flow

1. **Unauthenticated Access**
   - Navigate to `/dashboard` → redirected to `/login`

2. **Authentication**
   - Navigate to `/login` → submit valid credentials → redirected to `/dashboard`

3. **Protected Route Access**
   - After login, navigate to `/services`, `/logs`, etc. → accessible

4. **Logout**
   - Click user menu → Sign Out → redirected to `/login`
   - Tokens cleared from localStorage

5. **Auth Page Redirect**
   - When authenticated, navigate to `/login` → redirected to `/dashboard`

## Future Enhancements

- Multi-factor authentication (MFA)
- Social authentication (Google, GitHub)
- Role-based access control (RBAC)
- Session timeout with warning
- Account verification via email
- Biometric authentication
- Device management
- Login history and activity logs

## Notes

- All auth pages match the enterprise dark theme
- Form validation is comprehensive and user-friendly
- Loading states provide good UX feedback
- Error messages are descriptive
- Mobile responsive design maintained
- Glassmorphism aesthetic consistent with dashboard
