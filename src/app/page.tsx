// app/page.tsx (Server Component)
import ColorDisplay from '@/components/ColorDisplay';
import { getDailyColor } from '@/lib/dailyColor';
import { getColorInfo } from '@/lib/generateColor';

export const revalidate = 86400; // 1 日キャッシュ

export default async function Page() {
  const { date, hex } = await getDailyColor();
  const colorInfo = getColorInfo(hex, date);
  
  return <ColorDisplay hex={hex} colorInfo={colorInfo} />;
}
