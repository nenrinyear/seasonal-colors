import { ImageResponse } from 'next/og';
import { normalizeHexColor } from '@/lib/hexColor';

export const runtime = 'edge';

const size = {
    width: 1200,
    height: 630,
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const hex = normalizeHexColor(searchParams.get('hex'));

    if (!hex) {
        return Response.json(
            { error: 'hex must be a 6-digit color code, such as #88aadd or 88aadd.' },
            { status: 400 },
        );
    }

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: hex,
                }}
            />
        ),
        {
            ...size,
            headers: {
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        },
    );
}
