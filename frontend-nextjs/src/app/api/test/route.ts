import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'GET 請求測試成功',
    method: 'GET',
    data: {
      id: 1,
      name: 'Test Data',
      timestamp: new Date().toISOString(),
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      message: 'POST 請求測試成功',
      method: 'POST',
      received_data: body,
      timestamp: new Date().toISOString(),
    });
  } catch {
    // 移除未使用的 error 參數，使用空的 catch
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}
