import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    message: 'Frontend API 健康檢查通過',
    timestamp: new Date().toISOString(),
    api_url: process.env.NEXT_PUBLIC_API_URL,
    app_url: process.env.NEXT_PUBLIC_APP_URL,
  });
}
