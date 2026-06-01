// app/page.tsx (Server Component)
import type { Metadata } from 'next';
import ColorDisplay from '@/components/ColorDisplay';
import { getDailyColor } from '@/lib/dailyColor';
import { getColorInfo } from '@/lib/generateColor';

export const revalidate = 86400; // 1 日キャッシュ

export async function generateMetadata(): Promise<Metadata> {
  const { date, hex } = await getDailyColor();
  const colorInfo = getColorInfo(hex, date);
  const title = `${colorInfo.date}の色は${hex}`;
  const imageUrl = `/api/og?hex=${encodeURIComponent(hex)}`;

  return {
    title,
    description: '日付と季節から、その日の色を表示します。',
    openGraph: {
      title,
      description: '日付と季節から、その日の色を表示します。',
      url: '/',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: '日付と季節から、その日の色を表示します。',
      images: [imageUrl],
    },
  };
}

export default async function Page() {
  const { date, hex } = await getDailyColor();
  const colorInfo = getColorInfo(hex, date);
  
  return <ColorDisplay hex={hex} colorInfo={colorInfo} />;
}
