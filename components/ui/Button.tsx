"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "gold" | "warning" | "outline";
    children: ReactNode;
}

export default function Button({ variant = "primary", children, className = "", ...props }: ButtonProps) {
    const baseClasses = "rounded-full font-semibold px-6 py-3 transition-all duration-300 active:scale-95";

    const variants = {
        primary: "border border-accent-neon/20 text-accent-neon hover:bg-accent-neon/10 hover:shadow-neon hover:scale-[1.02]",
        gold: "border border-accent-gold/30 text-accent-gold hover:bg-accent-gold/10 hover:shadow-gold hover:scale-[1.02]",
        warning: "border border-warning/40 text-warning hover:bg-warning/10 hover:shadow-warning hover:scale-[1.02]",
        outline: "border border-accent-neon/30 text-accent-neon/80 hover:bg-accent-neon/5 hover:border-accent-neon/50",
    };

    return (
        <button
            className={`${baseClasses} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

