import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const res = NextResponse.json({ message: 'Logged out successfully' });
    
    // Clear the httpOnly cookie
    res.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Immediately expire
    });

    return res;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[BFF /api/auth/logout] Error:', errorMsg);
    return NextResponse.json(
      { error: 'Internal server error', details: errorMsg },
      { status: 500 }
    );
  }
}
