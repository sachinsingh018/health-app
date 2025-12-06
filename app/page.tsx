"use client";

import Link from "next/link";
import Image from "next/image";
import AppIcon from "@/components/ui/AppIcon";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Banner Section */}
            <section className="relative w-full h-[70vh] min-h-[500px] overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src="https://t3.ftcdn.net/jpg/02/81/21/10/360_F_281211036_24KPea5poawt4mXYlEjRUwsCgomtjoVc.jpg"
                        alt="Cardiology ECG background"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Deep Green Overlay */}
                <div className="absolute inset-0 bg-primary/70"></div>

                {/* Mint Gradient from Bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-accent-neon/20 via-transparent to-transparent"></div>

                {/* Backdrop Blur Layer */}
                <div className="absolute inset-0 backdrop-blur-sm"></div>

                {/* Animated ECG Line */}
                <div className="absolute bottom-20 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-neon to-transparent animate-pulse-neon opacity-60"></div>

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
                    <div className="max-w-3xl space-y-6 animate-fade-in">
                        <h1 className="text-6xl md:text-7xl font-heading font-bold text-white mb-4 tracking-tight drop-shadow-lg">
                            Your Heart, Decoded.
                        </h1>
                        <p className="text-xl md:text-2xl text-accent-neon/90 mb-8 font-medium drop-shadow-md">
                            Upload your health data and get Gen-Z friendly cardiology insights.
                        </p>
                        <Link
                            href="/upload"
                            className="inline-block btn-primary text-lg px-8 py-4 hover:scale-[1.03] hover:shadow-neon-lg transition-all duration-300"
                        >
                            Get Started →
                        </Link>
                    </div>

                    {/* Floating Pulse Icon */}
                    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-float">
                        <div className="w-16 h-16 rounded-full bg-accent-neon/20 border-2 border-accent-neon/40 flex items-center justify-center backdrop-blur-sm">
                            <svg
                                className="w-8 h-8 text-accent-neon animate-pulse"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Links Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-heading font-bold text-gradient-mint mb-4">
                        Explore Your Health Data
                    </h2>
                    <p className="text-accent-gold/80 text-lg">
                        Navigate through your personalized health insights
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    <Link
                        href="/upload"
                        className="card-interactive p-6 text-center group"
                    >
                        <div className="mb-4 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                            <div className="rounded-xl bg-[#0F2520] p-2 border border-[#4EFFD2]/20 hover:drop-shadow-[0_0_6px_#4EFFD2]">
                                <AppIcon name="upload" size={28} color="#4EFFD2" />
                            </div>
                        </div>
                        <h3 className="text-xl font-heading font-bold text-accent-neon mb-2">Upload</h3>
                        <p className="text-accent-gold/70 text-sm">Upload your health documents</p>
                    </Link>
                    <Link
                        href="/timeline"
                        className="card-interactive p-6 text-center group"
                    >
                        <div className="mb-4 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                            <div className="rounded-xl bg-[#0F2520] p-2 border border-[#4EFFD2]/20 hover:drop-shadow-[0_0_6px_#4EFFD2]">
                                <AppIcon name="event" size={28} color="#4EFFD2" />
                            </div>
                        </div>
                        <h3 className="text-xl font-heading font-bold text-accent-neon mb-2">Timeline</h3>
                        <p className="text-accent-gold/70 text-sm">View your health timeline</p>
                    </Link>
                    <Link
                        href="/doctor"
                        className="card-interactive p-6 text-center group"
                    >
                        <div className="mb-4 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                            <div className="rounded-xl bg-[#0F2520] p-2 border border-[#D4B77D]/20 hover:drop-shadow-[0_0_6px_#D4B77D]">
                                <AppIcon name="doctor" size={28} color="#D4B77D" />
                            </div>
                        </div>
                        <h3 className="text-xl font-heading font-bold text-accent-neon mb-2">Doctor</h3>
                        <p className="text-accent-gold/70 text-sm">Doctor-ready snapshot</p>
                    </Link>
                    <Link
                        href="/cardiology"
                        className="card-interactive p-6 text-center group"
                    >
                        <div className="mb-4 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                            <div className="rounded-xl bg-[#0F2520] p-2 border border-[#4EFFD2]/20 hover:drop-shadow-[0_0_6px_#4EFFD2]">
                                <AppIcon name="heartbeat" size={28} color="#4EFFD2" />
                            </div>
                        </div>
                        <h3 className="text-xl font-heading font-bold text-accent-neon mb-2">Cardiology</h3>
                        <p className="text-accent-gold/70 text-sm">Cardiac health insights</p>
                    </Link>
                    <Link
                        href="/assistant"
                        className="card-interactive p-6 text-center group md:col-span-2 lg:col-span-1"
                    >
                        <div className="mb-4 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                            <div className="rounded-xl bg-[#0F2520] p-2 border border-[#4EFFD2]/20 hover:drop-shadow-[0_0_6px_#4EFFD2]">
                                <AppIcon name="chat" size={28} color="#4EFFD2" />
                            </div>
                        </div>
                        <h3 className="text-xl font-heading font-bold text-accent-neon mb-2">Assistant</h3>
                        <p className="text-accent-gold/70 text-sm">Chat with AI assistant</p>
                    </Link>
                </div>
            </section>
        </div>
    );
}

