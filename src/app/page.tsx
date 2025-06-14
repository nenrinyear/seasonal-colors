// app/page.tsx (Server Component)
import { getNowDate } from '@/lib/date';
import { generateColorForDate, getColorInfo } from '@/lib/generateColor';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import ColorDisplay from '@/components/ColorDisplay';

export const revalidate = 86400; // 1 日キャッシュ

export default async function Page() {
  const nowDate = getNowDate();
  const key = `daily:${nowDate.toISOString().slice(0, 10)}`;
  const { env } = await getCloudflareContext({ async: true }); // env.MY_KV が参照可能
  let hex = await env.seasonal_colors.get(key);
  if (!hex) {
    hex = generateColorForDate(nowDate);
    await env.seasonal_colors.put(key, hex);
  }
  
  const colorInfo = getColorInfo(hex, nowDate);
  
  return <ColorDisplay hex={hex} colorInfo={colorInfo} />;
}
