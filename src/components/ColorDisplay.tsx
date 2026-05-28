'use client';

import { useEffect, useMemo, useState } from 'react';
import ColorModal from './ColorModal';

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const foregroundColor = getReadableTextColor(colorInfo.rgb);
    const isLightBackground = foregroundColor === '#171717';

    const postText = useMemo(() => {
        return `${colorInfo.date}の色は ${hex} です。`;
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
        <>
            <main
                className="relative min-h-screen w-screen cursor-copy overflow-hidden px-6 py-6"
                style={{ background: hex }}
                onClick={copyColor}
            >
                <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={(event) => {
                            event.stopPropagation();
                            setIsModalOpen(true);
                        }}
                        className="rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-gray-900 shadow-lg transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/80"
                    >
                        説明
                    </button>
                    <a
                        href={intentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        className="rounded-full bg-gray-950 px-4 py-2 text-sm font-bold text-white shadow-lg transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-white/80"
                    >
                        Xにポスト
                    </a>
                </div>

                <div className="flex min-h-[calc(100vh-3rem)] flex-col items-center justify-center text-center text-white drop-shadow-lg">
                    <p
                        className="mb-4 text-sm font-bold tracking-[0.22em]"
                        style={{ color: foregroundColor }}
                    >
                        A COLOR A DAY
                    </p>
                    <div
                        className="font-mono text-5xl font-bold sm:text-7xl"
                        style={{ color: foregroundColor }}
                    >
                        {hex}
                    </div>
                    <p className={`mt-6 rounded-full px-4 py-2 text-sm font-bold backdrop-blur-sm ${
                        isLightBackground ? 'bg-white/60 text-gray-950' : 'bg-black/20 text-white'
                    }`}>
                        {copied ? 'コピーしました' : '画面をクリックしてコピー'}
                    </p>
                </div>
            </main>

            <ColorModal
                isOpen={isModalOpen}
                colorInfo={colorInfo}
                intentUrl={intentUrl}
                copied={copied}
                onCopy={copyColor}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}

function getReadableTextColor(rgb: ColorInfo['rgb']) {
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance > 0.62 ? '#171717' : '#ffffff';
}
