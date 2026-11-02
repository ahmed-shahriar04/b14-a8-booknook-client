import { NextResponse } from 'next/server';

const RENDER_BACKEND_URL = 'https://b14-a8-booknook-server.onrender.com';

async function proxyRequest(req, context) {
  try {
    const rawParams = context?.params;
    const params = rawParams && typeof rawParams.then === 'function' ? await rawParams : rawParams;
    const pathSegments = params?.path || [];
    const targetPath = pathSegments.join('/');
    const search = req.nextUrl.search || '';
    const targetUrl = `${RENDER_BACKEND_URL}/${targetPath}${search}`;

    // Forward relevant incoming headers (especially Authorization and Content-Type)
    const forwardHeaders = new Headers();
    req.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (!['host', 'connection', 'content-length'].includes(lower)) {
        forwardHeaders.set(key, value);
      }
    });

    let body = undefined;
    if (['POST', 'PATCH', 'PUT'].includes(req.method)) {
      body = await req.text();
    }

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: forwardHeaders,
      body,
      cache: 'no-store',
    });

    const responseData = await response.text();

    return new NextResponse(responseData, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
      },
    });
  } catch (error) {
    console.warn('API proxy waiting for backend server:', error.message);
    return NextResponse.json(
      {
        success: false,
        message: 'Backend server is waking up from idle. Please wait a moment...',
        error: error.message,
      },
      { status: 503 }
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const PUT = proxyRequest;
export const OPTIONS = () => new NextResponse(null, { status: 200 });
