import { NextResponse } from 'next/server';

export async function GET() {
  const hasKV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

  let kvWorking = false;
  let error = null;

  if (hasKV) {
    try {
      const { kv } = await import('@vercel/kv');
      // Test write and read
      await kv.set('_health_check', Date.now());
      const value = await kv.get('_health_check');
      kvWorking = !!value;
    } catch (e: any) {
      error = e.message;
    }
  }

  return NextResponse.json({
    database: hasKV ? 'Vercel KV (Redis)' : 'In-Memory (не сохраняется)',
    connected: hasKV,
    working: kvWorking,
    error,
    message: hasKV
      ? (kvWorking ? '✅ База данных работает! Данные сохраняются.' : '❌ Ошибка подключения к KV')
      : '⚠️ KV не настроен. Данные сбрасываются при перезапуске сервера.',
    timestamp: new Date().toISOString(),
  });
}
