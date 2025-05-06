// app/page.tsx (Server Component)
import ClientOverlay from '@/components/ClientOverlay';
import { getNowDate } from '@/lib/date';
import { generateColorForDate } from '@/lib/generateColor';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export const revalidate = 86400; // 1 日キャッシュ

export default async function Page() {
  const key = `daily:${getNowDate().toISOString().slice(0, 10)}`;
  const { env } = await getCloudflareContext({ async: true }); // env.MY_KV が参照可能
  let hex = await env.seasonal_colors.get(key);
  if (!hex) {
    hex = generateColorForDate(getNowDate());
    await env.seasonal_colors.put(key, hex);
  }
  return (
    <main className="w-screen h-screen flex items-center justify-center" style={{ background: hex }}>
      <div className="text-white text-4xl font-mono">{hex}</div>
    </main>
  );
}
