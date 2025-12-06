"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
    const pathname = usePathname();

    const navItems = [
        { href: "/", label: "Home" },
        { href: "/upload", label: "Upload" },
        { href: "/timeline", label: "Timeline" },
        { href: "/doctor", label: "Doctor" },
        { href: "/cardiology", label: "Cardiology" },
        { href: "/assistant", label: "Assistant" },
    ];

    return (
        <nav className="bg-primary/70 backdrop-blur-md border-b border-accent-gold/20 sticky top-0 z-50 shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="text-xl font-heading font-bold text-gradient-mint hover:scale-105 transition-transform duration-300">
                        Health Intelligence
                    </Link>
                    <div className="flex gap-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive
                                            ? "text-accent-neon"
                                            : "text-accent-gold/70 hover:text-accent-neon"
                                        }`}
                                >
                                    {item.label}
                                    {isActive && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent-neon to-primary animate-pulse-neon" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
}

