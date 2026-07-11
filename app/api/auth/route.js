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
    const adminPassword = 'ocakbasi0123';
    
    if (password !== adminPassword) {
      return NextResponse.json({ error: 'Geçersiz şifre' }, { status: 401 });
    }
    
    const expectedToken = 'static-admin-token-ocakbasi0123';
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
