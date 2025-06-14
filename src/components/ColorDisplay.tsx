'use client';

import { useState } from 'react';
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

    return (
        <>
            <main 
                className="w-screen h-screen flex items-center justify-center cursor-pointer" 
                style={{ background: hex }}
                onClick={() => setIsModalOpen(true)}
            >
                <div className="text-white text-4xl font-mono drop-shadow-lg">
                    {hex}
                </div>
            </main>
            
            <ColorModal 
                isOpen={isModalOpen}
                colorInfo={colorInfo}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
