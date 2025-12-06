"use client";

import { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    interactive?: boolean;
    glow?: "neon" | "gold" | "none";
}

export default function Card({ children, interactive = false, glow = "none", className = "", ...props }: CardProps) {
    const baseClasses = "bg-gradient-to-b from-card to-surface backdrop-blur-sm rounded-3xl border border-accent-gold/20 transition-all duration-300";

    const interactiveClasses = interactive
        ? "cursor-pointer hover:ring-2 hover:ring-accent-neon/40 hover:scale-[1.02] hover:shadow-neon-sm"
        : "";

    const glowClasses = {
        neon: "hover:shadow-neon",
        gold: "hover:shadow-gold",
        none: "",
    };

    return (
        <div
            className={`${baseClasses} ${interactiveClasses} ${glowClasses[glow]} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}

