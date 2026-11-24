const USE_FIXED_DEV_DATE = false;
const YEAR = 2023;
const MONTH = 10;
const DAY = 1;

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

export function getNowDate(): Date {
    if (USE_FIXED_DEV_DATE && process.env.NODE_ENV === 'development') {
        const month = String(MONTH).padStart(2, '0');
        const day = String(DAY).padStart(2, '0');
        return parseJapanDateKey(`${YEAR}-${month}-${day}`);
    }

    return new Date();
}

export function parseJapanDateKey(dateKey: string): Date {
    return new Date(`${dateKey}T00:00:00+09:00`);
}
