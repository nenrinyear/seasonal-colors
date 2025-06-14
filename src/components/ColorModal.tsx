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
    onClose: () => void;
}

export default function ColorModal({ isOpen, colorInfo, onClose }: ColorModalProps) {
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
        };  }, [isOpen, onClose]);

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
            
            {/* モーダル本体 */}
            <div className={`relative bg-white rounded-lg shadow-2xl p-6 m-4 max-w-md w-full transition-all duration-300 ${
                isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}>
                {/* ヘッダー */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">今日の色</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* 色のプレビュー */}
                <div 
                    className="w-full h-24 rounded-lg mb-4 border-2 border-gray-200"
                    style={{ backgroundColor: colorInfo.hex }}
                />
                <div className="space-y-4">
                    <div>
                        <span className="text-sm font-medium text-gray-500">日付</span>
                        <p className="text-lg text-gray-800">{colorInfo.date}</p>
                    </div>
                    
                    <div>
                        <span className="text-sm font-medium text-gray-500">季節</span>
                        <p className="text-lg text-gray-800">{colorInfo.season}</p>
                    </div>
                    
                    <div>
                        <span className="text-sm font-medium text-gray-500">月間ベースカラー</span>
                        <p className="text-sm text-gray-600 mb-2">{colorInfo.monthlyBase.description}</p>            <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="grid grid-cols-3 gap-2 text-xs">
                                <div>
                                    <span className="text-gray-500">色相</span>
                                    <p className="font-mono text-gray-800 font-semibold">{colorInfo.monthlyBase.hue}°</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">彩度</span>
                                    <p className="font-mono text-gray-800 font-semibold">{colorInfo.monthlyBase.saturation}%</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">明度</span>
                                    <p className="font-mono text-gray-800 font-semibold">{colorInfo.monthlyBase.lightness}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <span className="text-xs font-medium text-gray-500">HEX</span>
                            <p className="text-sm font-mono text-gray-800">{colorInfo.hex}</p>
                        </div>
                        <div>
                            <span className="text-xs font-medium text-gray-500">RGB</span>
                            <p className="text-sm font-mono text-gray-800">
                                {colorInfo.rgb.r}, {colorInfo.rgb.g}, {colorInfo.rgb.b}
                            </p>
                        </div>
                        <div>
                            <span className="text-xs font-medium text-gray-500">HSL</span>
                            <p className="text-sm font-mono text-gray-800">
                                {colorInfo.hsl.h}°, {colorInfo.hsl.s}%, {colorInfo.hsl.l}%
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
                    >
                        閉じる
                    </button>
                </div>
            </div>
        </div>
    );
}
