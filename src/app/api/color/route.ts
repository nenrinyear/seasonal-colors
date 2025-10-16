// app/api/color/route.ts
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { generateColorForDate } from "@/lib/generateColor";
import { getNowDate } from "@/lib/date";


export async function GET() {
    const { env } = await getCloudflareContext({ async: true }); // env.seasonal_colors が参照可能
    const key = `daily:${getNowDate().toISOString().slice(0, 10)}`;

    let hex = await env.seasonal_colors.get(key);
    if (!hex) {
        hex = generateColorForDate(getNowDate());
        await env.seasonal_colors.put(key, hex, { expirationTtl: 86400 });
    }
    return Response.json({ hex });
}
