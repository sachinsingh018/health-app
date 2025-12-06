"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useHealthData } from "@/contexts/HealthDataContext";
import AppIcon from "@/components/ui/AppIcon";

interface CardiologyInsights {
    riskProfile: {
        hypertension: string;
        tachycardiaBradycardia: string;
        cholesterolIssues: string;
        diabetes: string;
        obesity: string;
        smoking: string;
        familyHistory: string;
    };
    possibleConditions: Array<{
        condition: string;
        confidence: "low" | "medium" | "high";
        evidence: string;
    }>;
    redFlags: Array<{
        flag: string;
        severity: "low" | "medium" | "high" | "critical";
        description: string;
        action: string;
    }>;
    advice: Array<{
        category: string;
        recommendation: string;
    }>;
    questionsForDoctor: string[];
}

export default function CardiologyPage() {
    const { healthData, isLoading } = useHealthData();
    const insights = healthData.cardiology;
    const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleQuestion = (index: number) => {
        const newExpanded = new Set(expandedQuestions);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedQuestions(newExpanded);
    };

    const getRiskGaugeValue = (status: string): number => {
        switch (status) {
            case "present":
                return 100;
            case "absent":
                return 0;
            default:
                return 50; // "not mentioned" - neutral
        }
    };

    const getRiskGaugeColor = (status: string): string => {
        switch (status) {
            case "High":
            case "present":
                return "bg-warning";
            case "Moderate":
                return "bg-accent-yellow";
            case "Low":
            case "absent":
                return "bg-accent-neon";
            default:
                return "bg-accent-gold/50";
        }
    };

    const getRiskLabel = (status: string): string => {
        switch (status) {
            case "present":
                return "Present";
            case "absent":
                return "Absent";
            default:
                return "Not Mentioned";
        }
    };

    const getRiskLabelColor = (status: string): string => {
        switch (status) {
            case "High":
            case "present":
                return "text-warning";
            case "Moderate":
                return "text-accent-yellow";
            case "Low":
            case "absent":
                return "text-accent-neon";
            default:
                return "text-accent-gold";
        }
    };

    const getConfidenceColor = (confidence: string) => {
        switch (confidence) {
            case "high":
                return "bg-red-600 text-red-100 border-red-500";
            case "medium":
                return "bg-accent-600 text-accent-100 border-accent-500";
            default:
                return "bg-primary-600 text-primary-100 border-primary-500";
        }
    };

    const getSeverityBadgeColor = (severity: string) => {
        switch (severity) {
            case "critical":
                return "bg-red-700 text-red-100 border-red-600";
            case "high":
                return "bg-red-600 text-red-100 border-red-500";
            case "medium":
                return "bg-accent-600 text-accent-100 border-accent-500";
            default:
                return "bg-primary-600 text-primary-100 border-primary-500";
        }
    };

    const formatRiskFactorName = (key: string): string => {
        return key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())
            .trim();
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl">
            <div className="card p-8 animate-fade-in">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <AppIcon name="heartbeat" size={26} color="#4EFFD2" />
                        <h1 className="text-5xl font-heading font-bold text-gradient-mint tracking-tight">
                            Cardiology Intelligence
                        </h1>
                    </div>
                    <p className="text-xl text-accent-gold/80">
                        Comprehensive AI-powered cardiovascular health analysis
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-400"></div>
                    </div>
                ) : insights ? (
                    <div className="space-y-10">
                        {/* Risk Profile with Visual Gauge Bars */}
                        <section className="card p-8">
                            <h2 className="text-3xl font-heading font-bold text-gradient-gold mb-6">
                                Risk Profile
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Object.entries(insights.riskProfile).map(([key, value], index) => {
                                    const gaugeValue = getRiskGaugeValue(value);
                                    const gaugeColor = getRiskGaugeColor(value);
                                    const labelColor = getRiskLabelColor(value);
                                    const label = getRiskLabel(value);
                                    const name = formatRiskFactorName(key);
                                    const isHighRisk = value === "High" || value === "present";

                                    return (
                                        <div
                                            key={key}
                                            className="card-interactive p-5 animate-slide-up"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <div className="mb-3">
                                                <div className="text-accent-gold/80 text-sm mb-1">
                                                    {name}
                                                </div>
                                                <div className={`text-lg font-bold ${labelColor}`}>
                                                    {label}
                                                </div>
                                            </div>
                                            {/* Animated Gauge Bar */}
                                            <div className="w-full bg-card/50 rounded-full h-4 overflow-hidden border border-accent-gold/20">
                                                <div
                                                    className={`h-full ${gaugeColor} transition-all duration-1000 ease-out rounded-full ${isHighRisk ? "animate-pulse" : ""
                                                        }`}
                                                    style={{ width: `${gaugeValue}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between text-xs text-accent-gold/60 mt-2">
                                                <span>Low Risk</span>
                                                <span>High Risk</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Possible Conditions - Enhanced Cards */}
                        {insights.possibleConditions.length > 0 && (
                            <section>
                                <h2 className="text-3xl font-heading font-bold text-gradient-mint mb-6">
                                    Possible Conditions
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {insights.possibleConditions.map((condition, index) => (
                                        <div
                                            key={index}
                                            className="card-interactive p-6 border-2 border-accent-neon/30 hover:border-accent-neon/60 hover:shadow-neon animate-slide-up"
                                            style={{ animationDelay: `${index * 100}ms` }}
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <h3 className="text-2xl font-bold text-primary-100 flex-1">
                                                    {condition.condition}
                                                </h3>
                                                <span
                                                    className={`px-4 py-2 rounded-full text-xs font-bold border-2 ${getConfidenceColor(
                                                        condition.confidence
                                                    )}`}
                                                >
                                                    {condition.confidence.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="bg-card/50 rounded-2xl p-4 border border-accent-neon/20 backdrop-blur-sm">
                                                <div className="text-accent-neon font-semibold text-sm mb-2">
                                                    Evidence:
                                                </div>
                                                <p className="text-accent-gold/90 leading-relaxed">
                                                    {condition.evidence}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Red Flags - Warning Boxes */}
                        {insights.redFlags.length > 0 && (
                            <section>
                                <h2 className="text-3xl font-heading font-bold text-warning mb-6 flex items-center gap-3">
                                    <AppIcon name="warning" size={32} color="#FF5A5F" className="animate-pulse hover:rotate-6 transition-transform" />
                                    Red Flags
                                </h2>
                                <div className="space-y-4">
                                    {insights.redFlags.map((flag, index) => (
                                        <div
                                            key={index}
                                            className="bg-warning/10 border-2 border-warning/60 rounded-3xl p-6 shadow-warning animate-shake"
                                            style={{ animationDelay: `${index * 100}ms` }}
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <h3 className="text-xl font-bold text-red-200 flex-1">
                                                    {flag.flag}
                                                </h3>
                                                <span
                                                    className={`px-4 py-2 rounded-full text-xs font-bold border-2 ${getSeverityBadgeColor(
                                                        flag.severity
                                                    )}`}
                                                >
                                                    {flag.severity.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="bg-red-950/30 rounded-lg p-4 mb-4 border border-red-500/20">
                                                <p className="text-red-100 leading-relaxed">
                                                    {flag.description}
                                                </p>
                                            </div>
                                            <div className="bg-accent-neon/10 rounded-2xl p-4 border border-accent-neon/30">
                                                <div className="text-accent-neon font-bold text-sm mb-2 flex items-center gap-2">
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    Recommended Action:
                                                </div>
                                                <p className="text-accent-gold font-semibold">
                                                    {flag.action}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Advice & Questions Section with Empathy Image */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left: Advice and Questions */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Advice - Green Success Tone */}
                                {insights.advice.length > 0 && (
                                    <section>
                                        <h2 className="text-3xl font-heading font-bold text-gradient-mint mb-6 flex items-center gap-3">
                                            <svg
                                                className="w-8 h-8 text-accent-neon animate-pulse"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            Lifestyle Recommendations
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {insights.advice.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="card-interactive p-6 border-2 border-accent-gold/30 hover:border-accent-gold/60 hover:shadow-gold animate-slide-up"
                                                    style={{ animationDelay: `${index * 100}ms` }}
                                                >
                                                    <div className="flex items-start gap-3 mb-3">
                                                        <div className="bg-accent-gold/20 rounded-full p-2 border border-accent-gold/30">
                                                            <svg
                                                                className="w-5 h-5 text-accent-gold"
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="text-accent-gold font-bold text-lg mb-2">
                                                                {item.category}
                                                            </div>
                                                            <p className="text-accent-neon/80 leading-relaxed">
                                                                {item.recommendation}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Questions For Doctor - Accordion List */}
                                {insights.questionsForDoctor.length > 0 && (
                                    <section>
                                        <h2 className="text-3xl font-heading font-bold text-gradient-mint mb-6 flex items-center gap-3">
                                            <svg
                                                className="w-8 h-8"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            Questions For Your Cardiologist
                                        </h2>
                                        <div className="space-y-3">
                                            {insights.questionsForDoctor.map((question, index) => {
                                                const isExpanded = expandedQuestions.has(index);
                                                return (
                                                    <div
                                                        key={index}
                                                        className="card overflow-hidden border-2 border-accent-neon/20 hover:border-accent-neon/40 transition-all duration-300"
                                                    >
                                                        <button
                                                            onClick={() => toggleQuestion(index)}
                                                            className="w-full flex items-center justify-between p-5 text-left hover:bg-card/50 transition-colors"
                                                        >
                                                            <div className="flex items-center gap-4 flex-1">
                                                                <div className="flex-shrink-0 w-8 h-8 bg-accent-neon/20 border border-accent-neon/40 rounded-full flex items-center justify-center text-accent-neon font-bold shadow-neon-sm">
                                                                    {index + 1}
                                                                </div>
                                                                <span className="text-accent-gold font-semibold text-lg">
                                                                    {question}
                                                                </span>
                                                            </div>
                                                            <svg
                                                                className={`w-6 h-6 text-accent-neon transition-transform flex-shrink-0 ${isExpanded ? "rotate-180" : ""
                                                                    }`}
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M19 9l-7 7-7-7"
                                                                />
                                                            </svg>
                                                        </button>
                                                        {isExpanded && (
                                                            <div className="px-5 pb-5 pt-0 animate-slide-up">
                                                                <div className="bg-card/50 rounded-2xl p-4 border border-accent-gold/20 backdrop-blur-sm">
                                                                    <p className="text-accent-gold/90 text-sm">
                                                                        This is an important question to discuss
                                                                        with your cardiologist. Bring this
                                                                        question to your appointment and take
                                                                        notes on their response.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </section>
                                )}
                            </div>

                            {/* Right: Empathy Image Card */}
                            <div className="lg:col-span-1">
                                <div className="card-interactive p-0 overflow-hidden h-full animate-fade-in hover:shadow-neon transition-all duration-300 sticky top-24">
                                    <div className="relative w-full h-full min-h-[400px]">
                                        <div
                                            className="absolute inset-0"
                                            style={{
                                                transform: `translateY(${scrollY * 0.1}px)`,
                                                transition: "transform 0.1s ease-out",
                                            }}
                                        >
                                            <Image
                                                src="https://media.istockphoto.com/id/1739325597/photo/nurse-senior-woman-and-smile-with-comfort-holding-hands-or-support-in-nursing-home-for.jpg?s=612x612&w=0&k=20&c=BMCKzCUYgUGPlSugqpmKVJ3tNzeh0Sv_HjYcKOrKuKI="
                                                alt="Nurse providing compassionate care to senior patient"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        {/* Deep Green Vignette Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/80"></div>

                                        {/* Content Overlay */}
                                        <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
                                            <div className="bg-card/80 backdrop-blur-md rounded-2xl p-4 border border-accent-gold/20 hover:border-accent-neon/40 transition-all duration-300">
                                                <p className="text-accent-gold/90 text-sm italic text-center flex items-center justify-center gap-2">
                                                    Compassionate care for your heart health journey <AppIcon name="heart" size={18} color="#4EFFD2" />
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-primary-300 text-lg">
                            No cardiology insights available. Please upload and analyze a
                            health document first.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
