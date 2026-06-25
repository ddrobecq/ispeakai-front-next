import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:3000/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = request.cookies.get('auth-token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    console.log('[BFF /api/chat/conversation] Request body:', body);
    console.log('[BFF /api/chat/conversation] Token exists:', !!token);
    console.log('[BFF /api/chat/conversation] Backend URL:', BACKEND_URL);

    const response = await fetch(`${BACKEND_URL}/chat/conversation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    console.log('[BFF /api/chat/conversation] Response status:', response.status);
    console.log('[BFF /api/chat/conversation] Response data:', data);

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[BFF /api/chat/conversation] Error:', errorMsg);
    return NextResponse.json(
      { error: 'Internal server error', details: errorMsg },
      { status: 500 }
    );
  }
}
