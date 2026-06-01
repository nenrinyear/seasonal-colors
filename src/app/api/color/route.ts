// app/api/color/route.ts
import { getDailyColor } from "@/lib/dailyColor";

export async function GET() {
    const { hex } = await getDailyColor();
    return Response.json({ hex });
}
