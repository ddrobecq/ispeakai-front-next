import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:5000/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const backendLoginUrl = `${BACKEND_URL}/auth/login`;
    console.log('[LOGIN API] Received request:', { email: body.email });
    console.log('[LOGIN API] Calling backend:', backendLoginUrl);

    const response = await fetch(backendLoginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('[LOGIN API] Backend response status:', response.status);
    const data = await response.json();
    console.log('[LOGIN API] Backend response:', data);

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Set auth token in httpOnly cookie for security
    const res = NextResponse.json(data, { status: 200 });
    res.cookies.set('auth-token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return res;
  } catch (error: any) {
    console.error('[LOGIN API] Error:', error.message);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
