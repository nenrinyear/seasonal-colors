import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getJapanDateKey, getNowDate, parseJapanDateKey } from '@/lib/date';
import { generateColorForDate } from '@/lib/generateColor';
import { normalizeHexColor } from '@/lib/hexColor';

const DAILY_PREFIX = 'daily:';
const KV_BATCH_SIZE = 100;

export async function getDailyColor(date = getNowDate()) {
    const key = `${DAILY_PREFIX}${getJapanDateKey(date)}`;
    const { env: { seasonal_colors: kv } } = await getCloudflareContext({ async: true });
    let hex = await kv.get(key);

    if (!hex) {
        hex = generateColorForDate(date);
        await kv.put(key, hex, { metadata: { hex } });
    }

    return { date, hex, key };
}

export async function getDailyColorByHex(hex: string) {
    const { env: { seasonal_colors: kv } } = await getCloudflareContext({ async: true });
    let latestMetadataMatch: string | undefined;
    let cursor: string | undefined;
    const legacyKeys: string[] = [];

    do {
        const page = await kv.list<{ hex: string }>({ prefix: DAILY_PREFIX, cursor });

        // KV lists ISO-date keys in ascending order. Older entries cannot beat a known match.
        for (const { name, metadata } of page.keys) {
            if (!metadata?.hex) {
                legacyKeys.push(name);
            } else if (normalizeHexColor(metadata.hex) === hex) {
                latestMetadataMatch = name;
                legacyKeys.length = 0;
            }
        }

        cursor = page.list_complete ? undefined : page.cursor;
    } while (cursor);

    // Legacy entries store HEX only in the value. Fetch the newest batches first.
    for (let end = legacyKeys.length; end > 0; end -= KV_BATCH_SIZE) {
        const batch = legacyKeys.slice(Math.max(0, end - KV_BATCH_SIZE), end);
        const colors = await kv.get(batch, 'text');
        const match = batch.findLast((key) => normalizeHexColor(colors.get(key)) === hex);
        if (match) return { date: dateFromDailyKey(match), hex };
    }

    return latestMetadataMatch ? { date: dateFromDailyKey(latestMetadataMatch), hex } : null;
}

function dateFromDailyKey(key: string) {
    return parseJapanDateKey(key.slice(DAILY_PREFIX.length));
}
