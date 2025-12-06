import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/ui/Navigation";
import FloatingAssistant from "@/components/ui/FloatingAssistant";
import { HealthDataProvider } from "@/contexts/HealthDataContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Health Intelligence Platform",
    description: "AI-powered health document analysis and insights",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <HealthDataProvider>
                    <Navigation />
                    <main className="min-h-screen bg-gradient-primary">
                        {children}
                    </main>
                    <FloatingAssistant />
                </HealthDataProvider>
            </body>
        </html>
    );
}

