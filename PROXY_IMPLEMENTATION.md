# API Proxy Implementation

## Overview

The admin dashboard template now includes a comprehensive API proxy system to handle CORS issues when connecting to backend services. This allows the frontend to communicate with any backend API without running into cross-origin restrictions.

## Features

### ✅ Complete HTTP Method Support

- GET, POST, PUT, DELETE, PATCH, OPTIONS
- Automatic preflight CORS handling
- Request body forwarding for applicable methods

### ✅ CORS Bypass

- Routes all API calls through `/api/proxy/[...path]`
- Adds proper CORS headers to all responses
- Handles preflight OPTIONS requests

### ✅ Security & Performance

- Filters out sensitive headers before forwarding
- Comprehensive error handling with proper HTTP status codes
- Request timeout management (30 seconds)
- Detailed logging for debugging

### ✅ Environment Configuration

- Configurable proxy usage via `NEXT_PUBLIC_USE_PROXY`
- Backend URL configuration via `NEXT_PUBLIC_BASE_URL`
- Development and production ready

## Configuration

### Environment Variables (.env.local)

```bash
# Enable/disable proxy usage
NEXT_PUBLIC_USE_PROXY=true

# Backend API URL (proxied through Next.js)
NEXT_PUBLIC_BASE_URL=https://your-backend-api.com

# Other configurations...
NEXT_PUBLIC_TIMEOUT=30000
```

### HTTP Client Configuration

The `httpClient.ts` automatically detects proxy configuration:

```typescript
// Automatically uses proxy if NEXT_PUBLIC_USE_PROXY=true
const baseURL = config.api.useProxy ? config.api.proxyUrl : config.api.baseUrl;
```

## Usage Examples

### Direct API Calls (automatically proxied)

```typescript
// These calls automatically go through /api/proxy when proxy is enabled
const response = await httpClient.get("/users");
const user = await httpClient.post("/auth/login", credentials);
```

### Manual Proxy Testing

You can test the proxy directly:

```bash
# Test GET request
curl http://localhost:3000/api/proxy/your-endpoint

# Test POST request with JSON
curl -X POST http://localhost:3000/api/proxy/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"password"}'
```

## API Proxy Route Details

### Location

`/src/app/api/proxy/[...path]/route.ts`

### Supported Methods

- **GET**: Fetch data
- **POST**: Create resources
- **PUT**: Update resources
- **PATCH**: Partial updates
- **DELETE**: Remove resources
- **OPTIONS**: CORS preflight

### Error Handling

- **502 Bad Gateway**: Backend connection failed
- **504 Gateway Timeout**: Request timeout
- **503 Service Unavailable**: Network error
- **500 Internal Server Error**: Other proxy errors

### Request Flow

1. Client makes request to `/api/proxy/endpoint`
2. Proxy extracts path and query parameters
3. Filters and forwards headers to backend
4. Forwards request body (for POST/PUT/PATCH)
5. Returns backend response with CORS headers

## Security Considerations

### Filtered Headers

The proxy automatically removes these headers:

- `host`, `content-length`, `connection`
- `upgrade-insecure-requests`
- `sec-fetch-*` headers
- `referer`, `origin`

### Authentication

- JWT tokens are automatically forwarded via Authorization header
- Backend authentication is handled transparently

## Testing

### With Real Backend

The template has been tested with:

- Backend: `https://ocms-backend.k8.isw.la`
- Authentication: JWT-based login system
- CRUD operations: Users, cards, device profiles

### Development Testing

1. Set `NEXT_PUBLIC_USE_PROXY=true`
2. Configure `NEXT_PUBLIC_BASE_URL`
3. Start development server: `npm run dev`
4. Test login functionality
5. Monitor console for proxy logs

## Integration Status

### ✅ Template Integration

- Proxy routes created in template
- HTTP client updated to use proxy
- Configuration management updated
- TypeScript configuration fixed
- Environment variables configured

### ✅ Test Project Validation

- Successfully generated test project
- Proxy functionality working
- Real backend integration tested
- Authentication flow verified

## Next Steps

When generating new projects with `create-ko-next-app`, the proxy functionality is:

- ✅ **Automatically included** in all generated projects
- ✅ **Pre-configured** with sensible defaults
- ✅ **Ready for production** use
- ✅ **Environment-based** enabling/disabling

Simply configure your backend URL and set `NEXT_PUBLIC_USE_PROXY=true` to start using the proxy system!
