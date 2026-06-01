// app/page.tsx (Server Component)
import type { Metadata } from 'next';
import ColorDisplay from '@/components/ColorDisplay';
import { getDailyColor } from '@/lib/dailyColor';
import { getNowDate } from '@/lib/date';
import { getColorInfo } from '@/lib/generateColor';
import { normalizeHexColor } from '@/lib/hexColor';
import { createColorPath } from '@/lib/share';

export const revalidate = 86400; // 1 日キャッシュ

type SearchParams = Record<string, string | string[] | undefined>;
type PageProps = {
  searchParams?: Promise<SearchParams>;
};

export async function generateMetadata({ searchParams }: PageProps = {}): Promise<Metadata> {
  const { date, hex, isPermalink } = await getPageColor(searchParams);
  const colorInfo = getColorInfo(hex, date);
  const title = isPermalink ? `${hex} | color.nenrin.me` : `${colorInfo.date}の色は${hex}`;
  const imageUrl = `/api/og?hex=${encodeURIComponent(hex)}`;
  const pageUrl = isPermalink ? createColorPath(hex) : '/';

  return {
    title,
    description: '日付と季節から、その日の色を表示します。',
    openGraph: {
      title,
      description: '日付と季節から、その日の色を表示します。',
      url: pageUrl,
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

export default async function Page({ searchParams }: PageProps) {
  const { date, hex } = await getPageColor(searchParams);
  const colorInfo = getColorInfo(hex, date);
  
  return <ColorDisplay hex={hex} colorInfo={colorInfo} />;
}

async function getPageColor(searchParams?: PageProps['searchParams']) {
  const requestedHex = normalizeHexColor(getSearchParamValue((await searchParams)?.hex));

  if (requestedHex) {
    return { date: getNowDate(), hex: requestedHex, isPermalink: true };
  }

  return { ...(await getDailyColor()), isPermalink: false };
}

function getSearchParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
