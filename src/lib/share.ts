import { getHexColorHashtag } from '@/lib/hexColor';

export const SITE_URL = 'https://color.nenrin.me/';
export const DAILY_COLOR_HASHTAG = '今日のカラー';

export function createColorPath(hex: string): string {
    return `/?hex=${getHexColorHashtag(hex)}`;
}

export function createColorUrl(hex: string): string {
    return new URL(createColorPath(hex), SITE_URL).toString();
}

export function createTweetText(dateLabel: string | null, hex: string): string {
    const colorTag = `#${getHexColorHashtag(hex)}`;
    if (!dateLabel) {
        return `共有された色は ${colorTag} です`;
    }

    return `${dateLabel}の色は ${colorTag} です\n#${DAILY_COLOR_HASHTAG}`;
}
