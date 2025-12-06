"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useHealthData } from "@/contexts/HealthDataContext";
import AppIcon from "@/components/ui/AppIcon";

interface DoctorSnapshot {
    activeProblems: Array<{
        problem: string;
        category: string;
        status: string;
        notes?: string;
    }>;
    medications: Array<{
        name: string;
        dosage: string;
        frequency?: string;
        indication?: string;
    }>;
    keyLabs: {
        LDL?: { value: string; unit: string; date?: string; status: string };
        HDL?: { value: string; unit: string; date?: string; status: string };
        HbA1c?: { value: string; unit: string; date?: string; status: string };
        Troponin?: { value: string; unit: string; date?: string; status: string };
        BNP?: { value: string; unit: string; date?: string; status: string };
    };
    keyEvents: Array<{
        date: string;
        type: "procedure" | "hospitalization" | "consultation" | "other";
        description: string;
    }>;
    visitPrep: string[];
}

export default function DoctorPage() {
    const { healthData, isLoading } = useHealthData();
    const snapshot = healthData.snapshot;
    const [downloading, setDownloading] = useState(false);
    const pdfRef = useRef<HTMLDivElement>(null);

    const handleDownloadPDF = async () => {
        if (!pdfRef.current || !snapshot) return;

        setDownloading(true);
        try {
            const canvas = await html2canvas(pdfRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#0d2318", // primary-950
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

            let position = 0;

            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save("doctor-snapshot.pdf");
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setDownloading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "normal":
                return "bg-primary-600 text-primary-100";
            case "abnormal":
                return "bg-red-600 text-red-100";
            case "not mentioned":
                return "bg-primary-700 text-primary-300";
            default:
                return "bg-primary-600 text-primary-100";
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl">
            <div className="card p-8 animate-fade-in">
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <AppIcon name="doctor" size={26} color="#D4B77D" />
                                <h1 className="text-5xl font-heading font-bold text-gradient-gold tracking-tight">
                                    Doctor Snapshot
                                </h1>
                            </div>
                            <p className="text-accent-gold/80 text-lg">
                                AI-generated clinical overview of your health status
                            </p>
                        </div>

                        {/* Doctor Portrait Card */}
                        <div className="card-interactive p-4 w-full lg:w-[280px] flex-shrink-0 animate-fade-in hover:shadow-gold transition-all duration-300">
                            <div className="relative w-full aspect-square rounded-3xl overflow-hidden border-2 border-accent-gold/30 mb-3">
                                <Image
                                    src="https://www.shutterstock.com/image-photo/portrait-handsome-male-doctor-stethoscope-600nw-2480850611.jpg"
                                    alt="Professional doctor portrait"
                                    fill
                                    className="object-cover hover:scale-[1.02] transition-transform duration-300"
                                />
                            </div>
                            <p className="text-accent-gold/70 text-sm text-center italic">
                                Your AI-generated doctor-ready summary.
                            </p>
                        </div>
                    </div>

                    {snapshot && (
                        <div className="flex justify-end">
                            <button
                                onClick={handleDownloadPDF}
                                disabled={downloading}
                                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none whitespace-nowrap"
                            >
                                {downloading ? (
                                    <>
                                        <svg
                                            className="animate-spin h-5 w-5"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Generating...
                                    </>
                                ) : (
                                    <>
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
                                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                        Download as PDF
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-400"></div>
                    </div>
                ) : (
                    snapshot && (
                        <div ref={pdfRef} className="space-y-6">
                            {/* Top Section: Left (Problems) and Right (Medications, Labs) */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Left: Problem List */}
                                <div className="card p-6">
                                    <h2 className="text-2xl font-heading font-semibold text-gradient-gold mb-4">
                                        Active Problem List
                                    </h2>
                                    {snapshot.activeProblems.length > 0 ? (
                                        <div className="space-y-3">
                                            {snapshot.activeProblems.map((problem, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-primary-800/50 rounded-lg p-4 border border-accent-500/10"
                                                >
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div className="flex-1">
                                                            <span className="font-semibold text-primary-100 text-lg block mb-1">
                                                                {problem.problem}
                                                            </span>
                                                            <span
                                                                className={`inline-block px-2 py-1 rounded text-xs font-semibold ${problem.category === "cardiology"
                                                                    ? "bg-accent-600 text-accent-100"
                                                                    : "bg-primary-600 text-primary-100"
                                                                    }`}
                                                            >
                                                                {problem.category}
                                                            </span>
                                                        </div>
                                                        <span className="text-primary-300 text-sm ml-2">
                                                            {problem.status}
                                                        </span>
                                                    </div>
                                                    {problem.notes && (
                                                        <p className="text-primary-200 text-sm mt-2">
                                                            {problem.notes}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-primary-300 text-sm">
                                            No active problems listed.
                                        </p>
                                    )}
                                </div>

                                {/* Right: Medications and Labs */}
                                <div className="space-y-6">
                                    {/* Medications */}
                                    <div className="card p-6">
                                        <h2 className="text-2xl font-heading font-semibold text-gradient-gold mb-4">
                                            Medications
                                        </h2>
                                        {snapshot.medications.length > 0 ? (
                                            <div className="space-y-3">
                                                {snapshot.medications.map((med, index) => (
                                                    <div
                                                        key={index}
                                                        className="bg-primary-800/50 rounded-lg p-4 border border-accent-500/10"
                                                    >
                                                        <div className="font-semibold text-primary-100 mb-1">
                                                            {med.name}
                                                        </div>
                                                        <div className="text-primary-200 text-sm">
                                                            {med.dosage}
                                                        </div>
                                                        {med.frequency && (
                                                            <div className="text-primary-300 text-xs mt-1">
                                                                {med.frequency}
                                                            </div>
                                                        )}
                                                        {med.indication && (
                                                            <div className="text-primary-300 text-xs mt-1">
                                                                For: {med.indication}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-primary-300 text-sm">
                                                No medications listed.
                                            </p>
                                        )}
                                    </div>

                                    {/* Labs */}
                                    {Object.keys(snapshot.keyLabs).length > 0 && (
                                        <div className="card p-6">
                                            <h2 className="text-2xl font-heading font-semibold text-gradient-gold mb-4">
                                                Key Labs
                                            </h2>
                                            <div className="grid grid-cols-2 gap-3">
                                                {Object.entries(snapshot.keyLabs).map(([key, lab]) => (
                                                    <div
                                                        key={key}
                                                        className="bg-primary-800/50 rounded-lg p-3 border border-accent-500/10"
                                                    >
                                                        <div className="text-primary-300 text-xs mb-1">
                                                            {key}
                                                        </div>
                                                        <div className="text-lg font-bold text-primary-100 mb-1">
                                                            {lab.value} {lab.unit}
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span
                                                                className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${getStatusColor(
                                                                    lab.status
                                                                )}`}
                                                            >
                                                                {lab.status.toUpperCase()}
                                                            </span>
                                                            {lab.date && (
                                                                <span className="text-primary-300 text-xs">
                                                                    {lab.date}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Bottom: Visit Prep Summary */}
                            <div className="bg-accent-600/20 rounded-lg p-6 border border-accent-500/30">
                                <h2 className="text-2xl font-semibold text-accent-300 mb-4">
                                    Visit Prep Summary
                                </h2>
                                <ul className="space-y-2">
                                    {snapshot.visitPrep.map((point, index) => (
                                        <li
                                            key={index}
                                            className="flex items-start gap-3 text-primary-100"
                                        >
                                            <span className="text-accent-400 mt-1 font-bold">•</span>
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Key Events (if any) */}
                            {snapshot.keyEvents.length > 0 && (
                                <div className="card p-6">
                                    <h2 className="text-2xl font-heading font-semibold text-gradient-gold mb-4">
                                        Key Events
                                    </h2>
                                    <div className="space-y-3">
                                        {snapshot.keyEvents.map((event, index) => (
                                            <div
                                                key={index}
                                                className="bg-primary-800/50 rounded-lg p-4 border border-accent-500/10"
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <span className="text-accent-400 font-semibold text-sm capitalize">
                                                        {event.type}
                                                    </span>
                                                    <span className="text-primary-300 text-sm">
                                                        {event.date}
                                                    </span>
                                                </div>
                                                <p className="text-primary-100">{event.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {snapshot.activeProblems.length === 0 &&
                                snapshot.medications.length === 0 &&
                                Object.keys(snapshot.keyLabs).length === 0 &&
                                snapshot.keyEvents.length === 0 && (
                                    <div className="text-center py-12">
                                        <p className="text-primary-300">
                                            No snapshot data available. Please upload and analyze a
                                            health document first.
                                        </p>
                                    </div>
                                )}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
