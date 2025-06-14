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

    // ノイズを追加
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

/**
 * 色の詳細情報を返す
 */
export function getColorInfo(hex: string, date: Date) {
    // hex を RGB に変換
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    // RGB から HSL に変換
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const diff = max - min;
    
    let h = 0;
    if (diff !== 0) {
        if (max === rNorm) {
            h = ((gNorm - bNorm) / diff) % 6;
        } else if (max === gNorm) {
            h = (bNorm - rNorm) / diff + 2;
        } else {
            h = (rNorm - gNorm) / diff + 4;
        }
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
        const l = (max + min) / 2;
    const s = diff === 0 ? 0 : diff / (1 - Math.abs(2 * l - 1));
    
    // 月間ベース値を計算
    const monthlyBases = computeMonthlyBases();
    const currentMonth = date.getMonth();
    const currentMonthBase = monthlyBases[currentMonth];
    
    return {
        hex,
        rgb: { r, g, b },
        hsl: { h, s: Math.round(s * 100), l: Math.round(l * 100) },
        date: date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        season: getSeason(date.getMonth() + 1),
        monthlyBase: {
            hue: Math.round(currentMonthBase.h),
            saturation: Math.round(currentMonthBase.s * 100),
            lightness: Math.round(currentMonthBase.l * 100),
            description: getMonthColorDescription(date.getMonth() + 1)
        }
    };
}

function getSeason(month: number): string {
    if (month >= 3 && month <= 5) return '春';
    if (month >= 6 && month <= 8) return '夏';
    if (month >= 9 && month <= 11) return '秋';
    return '冬';
}

function getMonthColorDescription(month: number): string {
    const descriptions: Record<number, string> = {
        1: '白系 - 雪景色のような純白から始まる新年',
        2: '白～ピンク系 - 梅の花が咲く時期への移行',
        3: 'ピンク系 - 桜の季節、春の始まり',
        4: 'ピンク～黄緑系 - 新緑への移り変わり',
        5: '黄緑系 - 若葉が美しい初夏',
        6: '黄緑～水色系 - 梅雨から夏への移行',
        7: '水色系 - 夏の空と海を表現',
        8: '水色～オレンジ系 - 夕焼けの美しい晩夏',
        9: 'オレンジ系 - 紅葉の始まり、秋の訪れ',
        10: 'オレンジ～青系 - 深まる秋の色合い',
        11: '青系 - 澄んだ秋空から冬への準備',
        12: '青～白系 - 冬の到来、雪の季節へ'
    };
    return descriptions[month] || '';
}