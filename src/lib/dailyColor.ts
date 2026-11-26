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

export async function getDailyColorDatesByHex(hex: string): Promise<Date[]> {
    const { env: { seasonal_colors: kv } } = await getCloudflareContext({ async: true });
    const matchingKeys: string[] = [];
    let cursor: string | undefined;

    do {
        const page = await kv.list<{ hex: string }>({ prefix: DAILY_PREFIX, cursor });
        const legacyKeys: string[] = [];

        for (const { name, metadata } of page.keys) {
            if (!metadata?.hex) {
                legacyKeys.push(name);
            } else if (normalizeHexColor(metadata.hex) === hex) {
                matchingKeys.push(name);
            }
        }

        // Legacy entries store HEX only in the value.
        for (let start = 0; start < legacyKeys.length; start += KV_BATCH_SIZE) {
            const batch = legacyKeys.slice(start, start + KV_BATCH_SIZE);
            const colors = await kv.get(batch, 'text');
            matchingKeys.push(...batch.filter((key) => normalizeHexColor(colors.get(key)) === hex));
        }

        cursor = page.list_complete ? undefined : page.cursor;
    } while (cursor);

    return matchingKeys.sort().reverse().map((key) => parseJapanDateKey(key.slice(DAILY_PREFIX.length)));
}
