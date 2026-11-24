export const JAPAN_TIME_ZONE = 'Asia/Tokyo';

const japanDateKeyFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: JAPAN_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
});

export function getJapanDateKey(date: Date): string {
    return japanDateKeyFormatter.format(date);
}
