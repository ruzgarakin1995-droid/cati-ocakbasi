import { NextResponse } from 'next/server';
import { getWaiterRequests, setWaiterRequests, validateSession } from '../../../lib/store';

export const dynamic = 'force-dynamic';

async function checkAuth(request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  return await validateSession(token);
}

export async function GET(request) {
  // Admin only: get all waiter requests
  if (!(await checkAuth(request))) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  
  try {
    const requests = await getWaiterRequests();
    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json({ error: 'Talepler alınamadı' }, { status: 500 });
  }
}

export async function POST(request) {
  // Public: create new waiter request
  try {
    const data = await request.json();
    if (!data.tableNo) {
      return NextResponse.json({ error: 'Masa numarası zorunludur' }, { status: 400 });
    }
    
    const newRequest = {
      id: 'WAIT-' + Date.now().toString(36).toUpperCase(),
      tableNo: data.tableNo,
      status: 'pending', // pending, completed
      createdAt: new Date().toISOString()
    };
    
    const requests = await getWaiterRequests();
    requests.unshift(newRequest); // Add to top
    await setWaiterRequests(requests);
    
    return NextResponse.json(newRequest);
  } catch (error) {
    return NextResponse.json({ error: 'Talep oluşturulamadı' }, { status: 500 });
  }
}

export async function PUT(request) {
  // Admin only: update waiter request status
  if (!(await checkAuth(request))) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  
  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'ID ve statü zorunludur' }, { status: 400 });
    }

    const requests = await getWaiterRequests();
    const index = requests.findIndex(r => r.id === id || r._id === id);
    if (index === -1) return NextResponse.json({ error: 'Talep bulunamadı (ID: ' + id + ')' }, { status: 404 });
    
    requests[index].status = status;
    requests[index].updatedAt = new Date().toISOString();
    
    // If completed, we could optionally remove it to save space, 
    // but for now we just change the status to 'completed'
    await setWaiterRequests(requests);
    
    return NextResponse.json(requests[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Talep güncellenemedi' }, { status: 500 });
  }
}
