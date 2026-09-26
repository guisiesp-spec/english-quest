import { NextResponse } from 'next/server';
import os from 'os';

export const runtime = 'nodejs';

export async function GET() {
  const interfaces = os.networkInterfaces();
  const ips: string[] = [];
  for (const nets of Object.values(interfaces)) {
    for (const net of nets ?? []) {
      if (net.family === 'IPv4' && !net.internal) {
        ips.push(net.address);
      }
    }
  }
  return NextResponse.json({ ips });
}
