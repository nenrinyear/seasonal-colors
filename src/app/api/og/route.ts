import { normalizeHexColor } from '@/lib/hexColor';
import { createSolidColorPng } from '@/lib/png';

export const runtime = 'edge';

const IMAGE_WIDTH = 1200;
const IMAGE_HEIGHT = 630;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const hex = normalizeHexColor(searchParams.get('hex'));

    if (!hex) {
        return Response.json(
            { error: 'hex must be a 6-digit color code, such as #88aadd or 88aadd.' },
            { status: 400 },
        );
    }

    const png = createSolidColorPng(IMAGE_WIDTH, IMAGE_HEIGHT, hexToRgb(hex));
    const body = new ArrayBuffer(png.byteLength);
    new Uint8Array(body).set(png);

    return new Response(body, {
        headers: {
            'Cache-Control': 'public, max-age=31536000, immutable',
            'Content-Length': png.byteLength.toString(),
            'Content-Type': 'image/png',
        },
    });
}

function hexToRgb(hex: string) {
    return {
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16),
    };
}
