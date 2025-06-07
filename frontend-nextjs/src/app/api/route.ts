import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: '🎉 Next.js API is working!',
    status: 'success',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    note: 'Frontend Next.js API 功能正常運行',
  });
}
