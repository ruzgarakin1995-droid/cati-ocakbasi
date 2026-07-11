export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createSession, validateSession, removeSession } from '../../../lib/store';

export async function POST(request) {
  try {
    const { password, action } = await request.json();
    
    if (action === 'logout') {
      const authHeader = request.headers.get('authorization');
      const token = authHeader?.replace('Bearer ', '');
      if (token) {
        await removeSession(token);
      }
      return NextResponse.json({ success: true });
    }
    
    // Login
    const adminPassword = process.env.ADMIN_PASSWORD || 'ocakbasi0123';
    
    // Check if token matches our static format
    if (token && token.startsWith('static-admin-token-')) {
      const tokenPass = token.replace('static-admin-token-', '');
      if (tokenPass === adminPassword) {
        return NextResponse.json({ success: true, message: 'Valid token' }, { status: 200 });
      }
    }
    
    const expectedToken = 'static-admin-token-' + (process.env.ADMIN_PASSWORD || 'ocakbasi0123');
    await createSession(expectedToken);
    
    return NextResponse.json({ success: true, token: expectedToken });
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    const isValid = await validateSession(token);
    return NextResponse.json({ authenticated: isValid });
  } catch (error) {
    return NextResponse.json({ authenticated: false });
  }
}
