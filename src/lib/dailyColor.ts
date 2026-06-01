import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getNowDate } from '@/lib/date';
import { generateColorForDate } from '@/lib/generateColor';

export async function getDailyColor(date = getNowDate()) {
    const key = `daily:${date.toISOString().slice(0, 10)}`;
    const { env } = await getCloudflareContext({ async: true });
    let hex = await env.seasonal_colors.get(key);

    if (!hex) {
        hex = generateColorForDate(date);
        await env.seasonal_colors.put(key, hex);
    }

    return { date, hex, key };
}
