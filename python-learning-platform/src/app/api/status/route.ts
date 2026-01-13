import { NextResponse } from 'next/server';
import Redis from 'ioredis';

export async function GET() {
  const redisUrl = process.env.REDIS_URL;
  const hasKV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

  let dbWorking = false;
  let error = null;
  let dbType = 'In-Memory (не сохраняется)';

  // Check standard Redis first
  if (redisUrl) {
    dbType = 'Redis';
    try {
      const client = new Redis(redisUrl);
      await client.set('_health_check', Date.now().toString());
      const value = await client.get('_health_check');
      dbWorking = !!value;
      await client.quit();
    } catch (e: any) {
      error = e.message;
    }
  }
  // Then check Vercel KV
  else if (hasKV) {
    dbType = 'Vercel KV';
    try {
      const { kv } = await import('@vercel/kv');
      await kv.set('_health_check', Date.now());
      const value = await kv.get('_health_check');
      dbWorking = !!value;
    } catch (e: any) {
      error = e.message;
    }
  }

  const isConfigured = !!redisUrl || hasKV;

  return NextResponse.json({
    database: dbType,
    connected: isConfigured,
    working: dbWorking,
    error,
    message: isConfigured
      ? (dbWorking ? '✅ База данных работает! Данные сохраняются.' : `❌ Ошибка подключения: ${error}`)
      : '⚠️ База данных не настроена. Данные сбрасываются при перезапуске сервера.',
    timestamp: new Date().toISOString(),
  });
}
