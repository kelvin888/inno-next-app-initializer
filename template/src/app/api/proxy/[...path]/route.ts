import { NextRequest, NextResponse } from 'next/server';

// Get backend URL from environment variable
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

// Headers to skip when forwarding to backend
const SKIP_HEADERS = new Set([
    'host',
    'content-length',
    'connection',
    'upgrade-insecure-requests',
    'sec-fetch-site',
    'sec-fetch-mode',
    'sec-fetch-dest',
    'referer',
    'origin'
]);

// HTTP methods that can include a request body
const METHODS_WITH_BODY = new Set(['POST', 'PUT', 'PATCH']);

// CORS headers for responses
const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

/**
 * API Proxy Route Handler
 * 
 * Handles all HTTP methods and forwards them to the backend API.
 * This bypasses CORS issues and keeps the backend URL secure.
 * 
 * Usage: /api/proxy/your-endpoint -> BACKEND_BASE_URL/your-endpoint
 */

export async function GET(request: NextRequest) {
    return handleRequest(request, 'GET');
}

export async function POST(request: NextRequest) {
    return handleRequest(request, 'POST');
}

export async function PUT(request: NextRequest) {
    return handleRequest(request, 'PUT');
}

export async function DELETE(request: NextRequest) {
    return handleRequest(request, 'DELETE');
}

export async function PATCH(request: NextRequest) {
    return handleRequest(request, 'PATCH');
}

function buildBackendUrl(request: NextRequest): string {
    const url = new URL(request.url);
    const apiPath = url.pathname.replace('/api/proxy', '');
    const searchParams = url.searchParams.toString();

    const cleanBackendUrl = BACKEND_BASE_URL.replace(/\/$/, '');
    const cleanApiPath = apiPath.startsWith('/') ? apiPath : `/${apiPath}`;
    const queryString = searchParams ? `?${searchParams}` : '';

    return `${cleanBackendUrl}${cleanApiPath}${queryString}`;
}

function buildProxyHeaders(request: NextRequest): Record<string, string> {
    const headers: Record<string, string> = {
        'User-Agent': `{{PROJECT_NAME}}/1.0`,
        'Accept': 'application/json',
    };

    for (const [key, value] of request.headers.entries()) {
        if (!SKIP_HEADERS.has(key.toLowerCase())) {
            headers[key] = value;
        }
    }

    return headers;
}

async function getRequestBody(request: NextRequest, method: string): Promise<string | undefined> {
    if (!METHODS_WITH_BODY.has(method)) {
        return undefined;
    }

    const contentType = request.headers.get('content-type');
    if (contentType?.includes('application/json')) {
        const jsonData = await request.json();
        return JSON.stringify(jsonData);
    }

    return await request.text();
}

function parseErrorResponse(error: Error): { message: string; statusCode: number } {
    let errorMessage = 'Internal proxy error';
    let statusCode = 500;

    if (error.message.includes('fetch failed')) {
        errorMessage = 'Failed to connect to backend server. Please check if the backend is running and accessible.';
        statusCode = 502; // Bad Gateway
    } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timeout. The backend server took too long to respond.';
        statusCode = 504; // Gateway Timeout
    } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your internet connection.';
        statusCode = 503; // Service Unavailable
    }

    return { message: errorMessage, statusCode };
}

async function handleRequest(request: NextRequest, method: string) {
    try {
        const backendUrl = buildBackendUrl(request);
        console.log(`[API Proxy] ${method} ${backendUrl}`);

        const headers = buildProxyHeaders(request);
        const body = await getRequestBody(request, method);

        const fetchOptions: RequestInit = {
            method,
            headers,
            body,
            signal: AbortSignal.timeout(30000), // 30 second timeout
        };

        const response = await fetch(backendUrl, fetchOptions);

        if (!response.ok) {
            console.error(`[API Proxy] Backend responded with ${response.status}: ${response.statusText}`);
        }

        const responseData = await response.text();
        let parsedData;

        try {
            parsedData = JSON.parse(responseData);
        } catch {
            parsedData = responseData;
        }

        return new NextResponse(JSON.stringify(parsedData), {
            status: response.status,
            headers: {
                'Content-Type': 'application/json',
                ...CORS_HEADERS,
            },
        });

    } catch (error) {
        console.error('[API Proxy] Error:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            backendUrl: BACKEND_BASE_URL,
            method,
            timestamp: new Date().toISOString()
        });

        const { message: errorMessage, statusCode } = parseErrorResponse(
            error instanceof Error ? error : new Error('Unknown error')
        );

        return new NextResponse(
            JSON.stringify({
                code: statusCode,
                message: errorMessage,
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            }),
            {
                status: statusCode,
                headers: {
                    'Content-Type': 'application/json',
                    ...CORS_HEADERS,
                },
            }
        );
    }
}

// Handle preflight OPTIONS requests for CORS
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}