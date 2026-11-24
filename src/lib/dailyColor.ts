import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getNowDate } from '@/lib/date';
import { generateColorForDate } from '@/lib/generateColor';
import { normalizeHexColor } from '@/lib/hexColor';

const DAILY_PREFIX = 'daily:';
const KV_BATCH_SIZE = 100;

export async function getDailyColor(date = getNowDate()) {
    const key = `${DAILY_PREFIX}${date.toISOString().slice(0, 10)}`;
    const { env } = await getCloudflareContext({ async: true });
    let hex = await env.seasonal_colors.get(key);

    if (!hex) {
        hex = generateColorForDate(date);
        await env.seasonal_colors.put(key, hex, { metadata: { hex } });
    }

    return { date, hex, key };
}

export async function getDailyColorByHex(hex: string) {
    const { env: { seasonal_colors: kv } } = await getCloudflareContext({ async: true });
    let latestKey: string | undefined;
    let cursor: string | undefined;

    do {
        const page = await kv.list<{ hex: string }>({ prefix: DAILY_PREFIX, cursor });
        const legacyKeys: string[] = [];

        for (const { name, metadata } of page.keys) {
            if (!metadata?.hex) {
                legacyKeys.push(name);
            } else if (normalizeHexColor(metadata.hex) === hex && (!latestKey || name > latestKey)) {
                latestKey = name;
            }
        }

        // Older daily entries only store the HEX in the value.
        for (let end = legacyKeys.length; end > 0; end -= KV_BATCH_SIZE) {
            const batch = legacyKeys.slice(Math.max(0, end - KV_BATCH_SIZE), end);
            if (latestKey && batch[batch.length - 1] <= latestKey) break;

            const colors = await kv.get(batch, 'text');
            const match = batch.findLast((key) => normalizeHexColor(colors.get(key)) === hex);
            if (match && (!latestKey || match > latestKey)) latestKey = match;
        }

        cursor = page.list_complete ? undefined : page.cursor;
    } while (cursor);

    if (!latestKey) return null;
    return { date: new Date(latestKey.slice(DAILY_PREFIX.length)), hex };
}
