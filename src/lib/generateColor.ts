import seedrandom from 'seedrandom';
import { getNowDate } from './date';

export type HSL = { h: number; s: number; l: number };

// 各基点月のHSL定義
const BASE_POINTS: Record<number, HSL> = {
    1:  { h:   0, s: 0.00, l: 1.00 },   // 白系
    3:  { h: 330, s: 0.70, l: 0.70 },   // ピンク系
    5:  { h:  80, s: 0.60, l: 0.60 },   // 黄緑系
    7:  { h: 190, s: 0.60, l: 0.70 },   // 水色系
    9:  { h:  30, s: 0.70, l: 0.60 },   // オレンジ系
    11: { h: 220, s: 0.70, l: 0.60 },   // 青系
};

function daysInMonth(year: number, month: number): number {
    return getNowDate(year, month, 0).getDate();
}

function computeMonthlyBases(): HSL[] {
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const keys = Object.keys(BASE_POINTS).map(Number).sort((a, b) => a - b);

    return months.map((m) => {
        if (m in BASE_POINTS) return BASE_POINTS[m];
        const before = keys.filter(k => k < m).pop() ?? keys[keys.length - 1] - 12;
        const after  = keys.filter(k => k > m).shift()   ?? keys[0] + 12;
        const t = (m - before) / (after - before);
        const b = BASE_POINTS[(before + 12) % 12 || 12]!;
        const a = BASE_POINTS[ after % 12    || 12]!;
        return {
            h: b.h + (a.h - b.h) * t,
            s: b.s + (a.s - b.s) * t,
            l: b.l + (a.l - b.l) * t,
        };
    });
}

function hslToRgb(h: number, s: number, l: number) {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const hp = h / 60;
    const x = c * (1 - Math.abs((hp % 2) - 1));
    let [r1, g1, b1] = [0, 0, 0];
    if (hp < 1)       [r1, g1] = [c, x];
    else if (hp < 2)  [r1, g1] = [x, c];
    else if (hp < 3)  [g1, b1] = [c, x];
    else if (hp < 4)  [g1, b1] = [x, c];
    else if (hp < 5)  [r1, b1] = [x, c];
    else              [r1, b1] = [c, x];
    const m = l - c / 2;
    return {
        r: Math.round((r1 + m) * 255),
        g: Math.round((g1 + m) * 255),
        b: Math.round((b1 + m) * 255),
    };
}

function catmullRomSpline(
    pts: [number, number, number][],
    tGlobal: number
): [number, number, number] {
    const n = pts.length;
    const t = Math.max(1, Math.min(tGlobal, n - 3));
    const i = Math.floor(t);
    const tLocal = t - i;
    const p0 = pts[i - 1], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2];
    const out: [number, number, number] = [0, 0, 0];
    for (let j = 0; j < 3; j++) {
        const v0 = p0[j], v1 = p1[j], v2 = p2[j], v3 = p3[j];
        out[j] = 0.5 * (
            2*v1 +
            (-v0 + v2)*tLocal +
            (2*v0 - 5*v1 + 4*v2 - v3)*tLocal*tLocal +
            (-v0 + 3*v1 - 3*v2 + v3)*tLocal*tLocal*tLocal
        );
    }
    return out;
}

/**
 * 日付シード＋スプライン補完＋大胆な乱数ノイズで毎日同じだが日替わりに
 */
export function generateColorForDate(date: Date): string {
    // RNG を日付でシード化
    const seed = date.toISOString().slice(0, 10);
    const rng = seedrandom(seed);

    const year  = date.getFullYear();
    const month = date.getMonth() + 1;
    const day   = date.getDate();
    const dim   = daysInMonth(year, month);
    const monthFrac = ((month - 1) + (day - 1) / dim) / 12;

    const monthly = computeMonthlyBases();
    const pts = [monthly[11], ...monthly, monthly[0]].map(p => [p.h, p.s, p.l] as [number, number, number]);
    const tGlobal = monthFrac * (pts.length - 1);
    const [h, s, l] = catmullRomSpline(pts, tGlobal);

    // 大胆な乱数ノイズを追加
    const hueNoise = (rng() * 2 - 1) * 20;   // ±20度
    const satNoise = (rng() * 2 - 1) * 0.1;  // ±0.1
    const ligNoise = (rng() * 2 - 1) * 0.1;  // ±0.1

    // Clamp to keep colors vibrant
    const h2 = (h + hueNoise + 360) % 360;
    const s2 = Math.min(Math.max(s + satNoise, 0.3), 0.9);
    const l2 = Math.min(Math.max(l + ligNoise, 0.3), 0.9);

    const { r, g, b } = hslToRgb(h2, s2, l2);
    const toHex = (v: number) => v.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}