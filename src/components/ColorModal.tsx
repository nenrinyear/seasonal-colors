'use client';

import { useEffect } from 'react';

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

interface ColorModalProps {
    isOpen: boolean;
    colorInfo: ColorInfo;
    intentUrl: string;
    onClose: () => void;
}

export default function ColorModal({ isOpen, colorInfo, intentUrl, onClose }: ColorModalProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
            <div
                className={`absolute inset-0 backdrop-blur-sm transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                onClick={onClose}
            />
            
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="color-modal-title"
                className={`relative m-4 w-full max-w-sm rounded-lg bg-white p-5 shadow-2xl transition-all duration-300 ${
                isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
            >
                <div className="mb-4 flex items-center justify-between gap-4">
                    <h2 id="color-modal-title" className="text-xl font-bold text-gray-900">今日の色</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="閉じる"
                        className="flex size-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div
                    className="mb-4 h-28 w-full rounded-lg border border-gray-200"
                    style={{ backgroundColor: colorInfo.hex }}
                />

                <div className="space-y-3 text-gray-900">
                    <p className="font-mono text-3xl font-bold">{colorInfo.hex}</p>
                    <p className="text-sm leading-6 text-gray-600">
                        {colorInfo.date}の{colorInfo.season}の色です。季節のベースカラーに、その日だけのゆらぎを加えています。
                    </p>
                    <div className="rounded-lg bg-gray-50 px-4 py-3">
                        <p className="text-xs font-bold text-gray-500">季節のベース</p>
                        <p className="mt-1 text-sm text-gray-700">{colorInfo.monthlyBase.description}</p>
                    </div>
                </div>

                <div className="mt-5">
                    <a
                        href={intentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-lg bg-gray-950 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        Xにポスト
                    </a>
                </div>
            </section>
        </div>
    );
}
