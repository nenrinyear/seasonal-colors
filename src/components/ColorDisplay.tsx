'use client';

import { useEffect, useMemo, useState } from 'react';

interface ColorInfo {
    hex: string;
    rgb: { r: number; g: number; b: number };
    hsl: { h: number; s: number; l: number };
    date: string;
    season: string;
    monthlyBase: {
        hue: number;
        saturation: number;
        lightness: number;
        description: string;
    };
}

interface ColorDisplayProps {
    hex: string;
    colorInfo: ColorInfo;
}

export default function ColorDisplay({ hex, colorInfo }: ColorDisplayProps) {
    const [copied, setCopied] = useState(false);
    const foregroundColor = getReadableTextColor(colorInfo.rgb);
    const isLightBackground = foregroundColor === '#171717';

    const postText = useMemo(() => {
        return `${colorInfo.date}の色は${hex}です | color.nenrin.me`;
    }, [colorInfo.date, hex]);

    const intentUrl = useMemo(() => {
        const params = new URLSearchParams({ text: postText });
        return `https://twitter.com/intent/tweet?${params.toString()}`;
    }, [postText]);

    useEffect(() => {
        if (!copied) return;

        const timer = window.setTimeout(() => {
            setCopied(false);
        }, 1800);

        return () => window.clearTimeout(timer);
    }, [copied]);

    const copyColor = async () => {
        try {
            await navigator.clipboard.writeText(hex);
            setCopied(true);
        } catch {
            const textarea = document.createElement('textarea');
            textarea.value = hex;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            textarea.remove();
            setCopied(true);
        }
    };

    return (
        <main
            className="flex min-h-screen w-screen items-center justify-center overflow-hidden px-6 py-6"
            style={{ background: hex }}
        >
            <div className="flex flex-col items-center text-center">
                <p
                    className="mb-5 text-sm font-bold"
                    style={{ color: foregroundColor }}
                >
                    color.nenrin.me
                </p>
                <button
                    type="button"
                    onClick={copyColor}
                    className="font-mono text-5xl font-bold transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-white/80 sm:text-7xl"
                    style={{ color: foregroundColor }}
                >
                    {hex}
                </button>
                <p className={`mt-6 rounded-full px-4 py-2 text-sm font-bold backdrop-blur-sm ${
                    isLightBackground ? 'bg-white/60 text-gray-950' : 'bg-black/20 text-white'
                }`}>
                    {copied ? 'コピーしました' : 'HEXをクリックしてコピー'}
                </p>
                <a
                    href={intentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 rounded-full bg-gray-950 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-white/80"
                >
                    Xにポスト
                </a>
            </div>
        </main>
    );
}

function getReadableTextColor(rgb: ColorInfo['rgb']) {
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance > 0.62 ? '#171717' : '#ffffff';
}
