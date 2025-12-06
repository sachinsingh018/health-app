"use client";

import Link from "next/link";
import { useState } from "react";
import AppIcon from "@/components/ui/AppIcon";

export default function FloatingAssistant() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link href="/assistant">
            <div
                className="fixed bottom-6 right-6 z-50 cursor-pointer group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Tooltip */}
                {isHovered && (
                    <div className="absolute bottom-full right-0 mb-3 px-4 py-2 bg-card/95 backdrop-blur-md text-accent-neon text-sm rounded-2xl shadow-neon border border-accent-neon/30 whitespace-nowrap animate-slide-up flex items-center gap-2">
                        Ask anything <AppIcon name="heart" size={16} color="#4EFFD2" />
                    </div>
                )}

                {/* Floating Button */}
                <div className="bg-gradient-to-br from-accent-neon/20 to-accent-neon/10 border border-accent-neon/40 text-accent-neon rounded-full p-4 shadow-neon-lg transition-all duration-300 hover:scale-110 hover:shadow-neon hover:animate-pulse-neon flex items-center justify-center w-16 h-16 backdrop-blur-sm">
                    <AppIcon name="chat" size={32} color="#4EFFD2" className="animate-float" />
                </div>
            </div>
        </Link>
    );
}

