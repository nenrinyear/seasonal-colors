'use client';

import { useMemo, useState } from 'react';
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

    const postText = useMemo(() => {
        return `${colorInfo.date}の色は ${hex} です。`;
    }, [colorInfo.date, hex]);

    const intentUrl = useMemo(() => {
        const params = new URLSearchParams({ text: postText });
        return `https://twitter.com/intent/tweet?${params.toString()}`;
    }, [postText]);

    return (
        <>
            <main 
                className="relative w-screen h-screen flex items-center justify-center cursor-pointer"
                style={{ background: hex }}
                onClick={() => setIsModalOpen(true)}
            >
                <a
                    href={intentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(event) => event.stopPropagation()}
                    className="absolute right-4 top-4 z-10 rounded-full bg-gray-950 px-4 py-2 text-sm font-bold text-white shadow-lg transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-white/80"
                >
                    Xにポスト
                </a>

                <div className="text-white text-4xl font-mono drop-shadow-lg">
                    {hex}
                </div>
            </main>
            
            <ColorModal 
                isOpen={isModalOpen}
                colorInfo={colorInfo}
                intentUrl={intentUrl}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
