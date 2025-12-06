"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useHealthData } from "@/contexts/HealthDataContext";
import AppIcon from "@/components/ui/AppIcon";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface TimelineData {
    events: Array<{
        date: string;
        title: string;
        description: string;
        category: string;
    }>;
    labs: Array<{
        date: string;
        name: string;
        value: string;
        unit?: string;
        status?: string;
    }>;
    vitals: Array<{
        date: string;
        type: string;
        value: string;
        unit?: string;
    }>;
    symptoms: Array<{
        date: string;
        symptom: string;
        severity?: string;
        notes?: string;
    }>;
    medications: Array<{
        name: string;
        dosage?: string;
        startDate?: string;
        endDate?: string;
        status: string;
    }>;
    lifestyle: Array<{
        date: string;
        type: "exercise" | "sleep" | "stress" | "diet";
        value: string;
        notes?: string;
    }>;
}

export default function TimelinePage() {
    const { healthData, isLoading } = useHealthData();
    const timeline = healthData.timeline;

    // Process labs data for charts
    const labCharts = useMemo(() => {
        if (!timeline || timeline.labs.length === 0) return [];

        // Group labs by name
        const labGroups: Record<string, Array<{ date: string; value: number }>> = {};

        timeline.labs.forEach((lab) => {
            if (!labGroups[lab.name]) {
                labGroups[lab.name] = [];
            }
            // Try to extract numeric value
            const numericValue = parseFloat(lab.value.replace(/[^0-9.]/g, ""));
            if (!isNaN(numericValue)) {
                labGroups[lab.name].push({
                    date: lab.date,
                    value: numericValue,
                });
            }
        });

        // Create chart data for each lab type
        return Object.entries(labGroups).map(([labName, data]) => {
            // Sort by date
            const sortedData = data.sort((a, b) => {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();
                return isNaN(dateA) || isNaN(dateB) ? 0 : dateA - dateB;
            });

            return {
                name: labName,
                data: {
                    labels: sortedData.map((d) => d.date),
                    datasets: [
                        {
                            label: labName,
                            data: sortedData.map((d) => d.value),
                            borderColor: "rgb(251, 191, 36)", // accent-400
                            backgroundColor: "rgba(251, 191, 36, 0.1)",
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: "rgb(251, 191, 36)",
                            pointBorderColor: "#fff",
                            pointBorderWidth: 2,
                            pointRadius: 4,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false,
                        },
                        title: {
                            display: true,
                            text: labName,
                            color: "rgb(220, 252, 231)", // primary-100
                            font: {
                                size: 16,
                                weight: "bold",
                            },
                        },
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: "rgb(187, 247, 208)", // primary-200
                            },
                            grid: {
                                color: "rgba(251, 191, 36, 0.1)",
                            },
                        },
                        y: {
                            ticks: {
                                color: "rgb(187, 247, 208)", // primary-200
                            },
                            grid: {
                                color: "rgba(251, 191, 36, 0.1)",
                            },
                        },
                    },
                },
            };
        });
    }, [timeline]);

    // Process vitals data for charts
    const vitalCharts = useMemo(() => {
        if (!timeline || timeline.vitals.length === 0) return [];

        // Group vitals by type
        const vitalGroups: Record<string, Array<{ date: string; value: number }>> = {};

        timeline.vitals.forEach((vital) => {
            if (!vitalGroups[vital.type]) {
                vitalGroups[vital.type] = [];
            }
            // Try to extract numeric value (handle BP like "120/80")
            let numericValue: number;
            if (vital.type === "blood_pressure") {
                const parts = vital.value.split("/");
                numericValue = parseFloat(parts[0]?.replace(/[^0-9.]/g, "") || "0");
            } else {
                numericValue = parseFloat(vital.value.replace(/[^0-9.]/g, ""));
            }
            if (!isNaN(numericValue)) {
                vitalGroups[vital.type].push({
                    date: vital.date,
                    value: numericValue,
                });
            }
        });

        // Create chart data for each vital type
        return Object.entries(vitalGroups).map(([vitalType, data]) => {
            // Sort by date
            const sortedData = data.sort((a, b) => {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();
                return isNaN(dateA) || isNaN(dateB) ? 0 : dateA - dateB;
            });

            return {
                name: vitalType,
                data: {
                    labels: sortedData.map((d) => d.date),
                    datasets: [
                        {
                            label: vitalType,
                            data: sortedData.map((d) => d.value),
                            borderColor: "rgb(251, 191, 36)", // accent-400
                            backgroundColor: "rgba(251, 191, 36, 0.1)",
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: "rgb(251, 191, 36)",
                            pointBorderColor: "#fff",
                            pointBorderWidth: 2,
                            pointRadius: 4,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false,
                        },
                        title: {
                            display: true,
                            text: vitalType.replace(/_/g, " ").toUpperCase(),
                            color: "rgb(220, 252, 231)", // primary-100
                            font: {
                                size: 16,
                                weight: "bold",
                            },
                        },
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: "rgb(187, 247, 208)", // primary-200
                            },
                            grid: {
                                color: "rgba(251, 191, 36, 0.1)",
                            },
                        },
                        y: {
                            ticks: {
                                color: "rgb(187, 247, 208)", // primary-200
                            },
                            grid: {
                                color: "rgba(251, 191, 36, 0.1)",
                            },
                        },
                    },
                },
            };
        });
    }, [timeline]);

    // Combine all timeline items and sort by date
    const allTimelineItems = useMemo(() => {
        if (!timeline) return [];

        const items: Array<{
            date: string;
            type: string;
            data: any;
        }> = [];

        timeline.events.forEach((event) => {
            items.push({ date: event.date, type: "event", data: event });
        });
        timeline.symptoms.forEach((symptom) => {
            items.push({ date: symptom.date, type: "symptom", data: symptom });
        });
        timeline.lifestyle.forEach((lifestyle) => {
            items.push({ date: lifestyle.date, type: "lifestyle", data: lifestyle });
        });

        // Sort by date (handle "not mentioned" dates)
        return items.sort((a, b) => {
            if (a.date === "not mentioned" || b.date === "not mentioned") return 0;
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            if (isNaN(dateA) || isNaN(dateB)) return 0;
            return dateA - dateB;
        });
    }, [timeline]);

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="card p-8 animate-fade-in">
                <div className="flex items-center gap-3 mb-3">
                    <AppIcon name="event" size={26} color="#4EFFD2" />
                    <h1 className="text-5xl font-heading font-bold text-gradient-mint tracking-tight">
                        Patient Timeline
                    </h1>
                </div>
                <p className="text-accent-gold/80 mb-8 text-lg">
                    Gemini-generated timeline of your health events
                </p>

                {/* Navigation Buttons */}
                {(healthData.snapshot || healthData.cardiology) && (
                    <div className="mb-6 flex flex-wrap gap-4">
                        {healthData.snapshot && (
                            <Link
                                href="/doctor"
                                className="btn-gold flex items-center gap-2"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                View Doctor Snapshot
                            </Link>
                        )}
                        {healthData.cardiology && (
                            <Link
                                href="/cardiology"
                                className="btn-primary flex items-center gap-2"
                            >
                                <svg
                                    className="w-5 h-5"
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
                                View Cardiology Insights
                            </Link>
                        )}
                    </div>
                )}

                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-400"></div>
                    </div>
                ) : timeline ? (
                    <div className="space-y-12">
                        {/* Lab Results with Charts */}
                        {timeline.labs.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-semibold text-accent-300 mb-6">
                                    Lab Results
                                </h2>
                                {labCharts.length > 0 ? (
                                    <div className="space-y-6 mb-6">
                                        {labCharts.map((chart, index) => (
                                            <div
                                                key={index}
                                                className="bg-primary-700/30 rounded-lg p-6 border border-accent-500/20"
                                            >
                                                <div className="h-64">
                                                    <Line data={chart.data} options={chart.options} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {timeline.labs.map((lab, index) => (
                                            <div
                                                key={index}
                                                className="bg-primary-700/50 rounded-lg p-4 border border-accent-500/20"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="font-semibold text-primary-100">
                                                        {lab.name}
                                                    </span>
                                                    <span className="text-primary-300 text-sm">
                                                        {lab.date}
                                                    </span>
                                                </div>
                                                <div className="text-accent-400 text-lg font-bold">
                                                    {lab.value} {lab.unit || ""}
                                                </div>
                                                {lab.status && (
                                                    <span className="text-primary-300 text-sm">
                                                        Status: {lab.status}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        )}

                        {/* Vital Signs with Charts */}
                        {timeline.vitals.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-semibold text-accent-300 mb-6">
                                    Vital Signs
                                </h2>
                                {vitalCharts.length > 0 ? (
                                    <div className="space-y-6 mb-6">
                                        {vitalCharts.map((chart, index) => (
                                            <div
                                                key={index}
                                                className="bg-primary-700/30 rounded-lg p-6 border border-accent-500/20"
                                            >
                                                <div className="h-64">
                                                    <Line data={chart.data} options={chart.options} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {timeline.vitals.map((vital, index) => (
                                            <div
                                                key={index}
                                                className="bg-primary-700/50 rounded-lg p-4 border border-accent-500/20"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="font-semibold text-primary-100">
                                                        {vital.type}
                                                    </span>
                                                    <span className="text-primary-300 text-sm">
                                                        {vital.date}
                                                    </span>
                                                </div>
                                                <div className="text-accent-400 text-lg font-bold">
                                                    {vital.value} {vital.unit || ""}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        )}

                        {/* Vertical Timeline for Events, Symptoms, Lifestyle */}
                        {(timeline.events.length > 0 ||
                            timeline.symptoms.length > 0 ||
                            timeline.lifestyle.length > 0) && (
                                <section>
                                    <h2 className="text-2xl font-semibold text-accent-300 mb-6">
                                        Timeline
                                    </h2>
                                    <div className="relative">
                                        {/* Timeline line with gradient */}
                                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-neon via-accent-gold to-accent-neon"></div>

                                        <div className="space-y-8">
                                            {allTimelineItems.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="relative flex items-start gap-6"
                                                >
                                                    {/* Timeline dot with glow */}
                                                    <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-accent-neon/20 rounded-full border-4 border-card shadow-neon-sm animate-pulse-neon">
                                                        <div className="w-3 h-3 bg-accent-neon rounded-full shadow-neon"></div>
                                                    </div>

                                                    {/* Content card */}
                                                    <div className="flex-1 card-interactive p-6 animate-slide-up hover:shadow-neon-sm">
                                                        {item.type === "event" && (
                                                            <>
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <span className="text-accent-400 font-semibold text-sm">
                                                                        {item.data.category}
                                                                    </span>
                                                                    <span className="text-primary-300 text-sm">
                                                                        {item.data.date}
                                                                    </span>
                                                                </div>
                                                                <h3 className="text-xl font-bold text-primary-100 mb-2">
                                                                    {item.data.title}
                                                                </h3>
                                                                <p className="text-primary-200">
                                                                    {item.data.description}
                                                                </p>
                                                            </>
                                                        )}

                                                        {item.type === "symptom" && (
                                                            <>
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <span className="text-accent-400 font-semibold text-sm">
                                                                        SYMPTOM
                                                                    </span>
                                                                    <span className="text-primary-300 text-sm">
                                                                        {item.data.date}
                                                                    </span>
                                                                </div>
                                                                <h3 className="text-xl font-bold text-primary-100 mb-2">
                                                                    {item.data.symptom}
                                                                </h3>
                                                                {item.data.severity && (
                                                                    <span className="text-accent-400 text-sm mb-2 block">
                                                                        Severity: {item.data.severity}
                                                                    </span>
                                                                )}
                                                                {item.data.notes && (
                                                                    <p className="text-primary-200">
                                                                        {item.data.notes}
                                                                    </p>
                                                                )}
                                                            </>
                                                        )}

                                                        {item.type === "lifestyle" && (
                                                            <>
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <span className="text-accent-400 font-semibold text-sm capitalize">
                                                                        {item.data.type}
                                                                    </span>
                                                                    <span className="text-primary-300 text-sm">
                                                                        {item.data.date}
                                                                    </span>
                                                                </div>
                                                                <h3 className="text-xl font-bold text-primary-100 mb-2 capitalize">
                                                                    {item.data.type}
                                                                </h3>
                                                                <p className="text-primary-200">
                                                                    {item.data.value}
                                                                </p>
                                                                {item.data.notes && (
                                                                    <p className="text-primary-300 text-sm mt-2">
                                                                        {item.data.notes}
                                                                    </p>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            )}

                        {/* Medications */}
                        {timeline.medications.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-semibold text-accent-300 mb-4">
                                    Medications
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {timeline.medications.map((med, index) => (
                                        <div
                                            key={index}
                                            className="bg-primary-700/50 rounded-lg p-4 border border-accent-500/20"
                                        >
                                            <div className="font-semibold text-primary-100 mb-1">
                                                {med.name}
                                            </div>
                                            {med.dosage && (
                                                <div className="text-primary-200 text-sm">
                                                    {med.dosage}
                                                </div>
                                            )}
                                            <div className="text-primary-300 text-xs mt-2">
                                                Status: {med.status}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {timeline.events.length === 0 &&
                            timeline.labs.length === 0 &&
                            timeline.vitals.length === 0 &&
                            timeline.symptoms.length === 0 &&
                            timeline.medications.length === 0 &&
                            timeline.lifestyle.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-primary-300 mb-4">
                                        No timeline data available. Please upload and analyze a
                                        health document first.
                                    </p>
                                    <Link
                                        href="/upload"
                                        className="inline-block bg-accent-600 hover:bg-accent-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                                    >
                                        Upload Documents
                                    </Link>
                                </div>
                            )}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-primary-300 mb-4">
                            No timeline data available. Please upload and analyze a health document first.
                        </p>
                        <Link
                            href="/upload"
                            className="inline-block bg-accent-600 hover:bg-accent-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                        >
                            Upload Documents
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
