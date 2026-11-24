// app/page.tsx (Server Component)
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import ColorDisplay from '@/components/ColorDisplay';
import { getDailyColor, getDailyColorByHex } from '@/lib/dailyColor';
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
  const title = `${colorInfo.date}の色は${hex}`;
  const description = isPermalink
    ? '共有された色を表示します。今日の色も見ることができます。'
    : '日付と季節から、その日の色を表示します。';
  const imageUrl = `/api/og?hex=${hex.slice(1)}`;
  const pageUrl = isPermalink ? createColorPath(hex) : '/';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
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
      description,
      images: [imageUrl],
    },
  };
}

export default async function Page({ searchParams }: PageProps) {
  const { date, hex, isPermalink } = await getPageColor(searchParams);
  const colorInfo = getColorInfo(hex, date);
  
  return <ColorDisplay hex={hex} colorInfo={colorInfo} isPermalink={isPermalink} />;
}

async function getPageColor(searchParams?: PageProps['searchParams']) {
  const query = (await searchParams)?.hex;
  return resolvePageColor(Array.isArray(query) ? query[0] : query);
}

const resolvePageColor = cache(async (query: string | undefined) => {
  if (query === undefined) {
    return { ...(await getDailyColor()), isPermalink: false };
  }

  const hex = normalizeHexColor(query);
  if (!hex) notFound();

  const color = await getDailyColorByHex(hex);
  if (!color) notFound();

  return { ...color, isPermalink: true };
});
