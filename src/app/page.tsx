// app/page.tsx (Server Component)
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import ColorDisplay from '@/components/ColorDisplay';
import { getDailyColor, getDailyColorDatesByHex } from '@/lib/dailyColor';
import { formatJapanDate } from '@/lib/date';
import { getColorInfo } from '@/lib/generateColor';
import { normalizeHexColor } from '@/lib/hexColor';
import { createColorPath, createTweetIntentUrl } from '@/lib/share';

export const revalidate = 86400; // 1 日キャッシュ

type SearchParams = Record<string, string | string[] | undefined>;
type PageProps = {
  searchParams?: Promise<SearchParams>;
};

export async function generateMetadata({ searchParams }: PageProps = {}): Promise<Metadata> {
  const { dateLabel, hex, isPermalink } = await getPageColor(searchParams);
  const title = `${dateLabel}の色は${hex}`;
  const description = '日付と季節から、その日の色を表示します。';
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
  const { dateLabel, hex, rgb, isPermalink, occurrenceDates } = await getPageColor(searchParams);

  const heading = isPermalink ? `${dateLabel}の色` : '今日の色';

  return (
    <ColorDisplay
      hex={hex}
      rgb={rgb}
      heading={occurrenceDates.length > 1 ? '共有された色' : heading}
      occurrenceDates={occurrenceDates}
      intentUrl={createTweetIntentUrl(dateLabel, hex)}
      isPermalink={isPermalink}
    />
  );
}

async function getPageColor(searchParams?: PageProps['searchParams']) {
  const query = (await searchParams)?.hex;
  return resolvePageColor(Array.isArray(query) ? query[0] : query);
}

const resolvePageColor = cache(async (query: string | undefined) => {
  if (query === undefined) {
    const { date, hex } = await getDailyColor();
    return toPageColor(hex, date, false);
  }

  const hex = normalizeHexColor(query);
  if (!hex) notFound();

  const dates = await getDailyColorDatesByHex(hex);
  const [latestDate] = dates;
  if (!latestDate) notFound();

  return toPageColor(hex, latestDate, true, dates.map(formatJapanDate));
});

function toPageColor(hex: string, date: Date, isPermalink: boolean, occurrenceDates: string[] = []) {
  const { date: dateLabel, rgb } = getColorInfo(hex, date);
  return { hex, dateLabel, rgb, isPermalink, occurrenceDates };
}
