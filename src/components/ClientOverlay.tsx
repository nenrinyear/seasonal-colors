// components/ClientOverlay.tsx (Client Component)
'use client';
import { useState } from 'react';

export default function ClientOverlay({ bg }: { bg: string }) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <div
                className="absolute inset-0"
                onClick={()=>setOpen(true)}
            />
            {open && (
                <div
                    className="fixed inset-0 flex items-center justify-center backdrop-filter backdrop-blur-md"
                    onClick={()=>setOpen(false)}
                >
                    <div className="bg-white/80 p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl mb-2">今日の色の詳細</h2>
                        <p>HEX: {bg}</p>
                        {/* 必要なら HSL, RGB 表示なども追加 */}
                    </div>
                </div>
            )}
        </>
    );
}
