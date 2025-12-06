"use client";

import { useState, useRef, DragEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useHealthData } from "@/contexts/HealthDataContext";
import AppIcon from "@/components/ui/AppIcon";

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [extractedText, setExtractedText] = useState<string>("");
    const [showTextPreview, setShowTextPreview] = useState(false);
    const [manualText, setManualText] = useState("");
    const [useManualText, setUseManualText] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const { setHealthData } = useHealthData();

    const handleDrag = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            await handleFile(e.target.files[0]);
        }
    };

    const handleFile = async (selectedFile: File) => {
        setFile(selectedFile);
        setUseManualText(false);
        setUploading(true);

        try {
            // Send file to server for text extraction
            const formData = new FormData();
            formData.append("file", selectedFile);

            const response = await fetch("/api/extract-text", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to extract text");
            }

            const data = await response.json();
            setExtractedText(data.text);
            setShowTextPreview(true);
        } catch (error) {
            console.error("Error extracting text:", error);
            // If file type is unknown or extraction fails, show manual text input
            if (error instanceof Error && error.message.includes("Unsupported")) {
                setUseManualText(true);
                setShowTextPreview(false);
            } else {
                alert(
                    "Failed to extract text from file. Please try manual text input."
                );
                setUseManualText(true);
                setShowTextPreview(false);
            }
        } finally {
            setUploading(false);
        }
    };

    const handleAnalyze = async () => {
        const textToAnalyze = useManualText ? manualText : extractedText;

        if (!textToAnalyze.trim()) {
            alert("Please provide text to analyze");
            return;
        }

        setUploading(true);
        try {
            const response = await fetch("/api/analyze", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: textToAnalyze }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Analysis result:", data);
                // Store results in context
                setHealthData({
                    timeline: data.timeline || null,
                    snapshot: data.snapshot || null,
                    cardiology: data.cardiology || null,
                });
                // Redirect to timeline
                router.push("/timeline");
            } else {
                const error = await response.json();
                alert(`Analysis failed: ${error.message || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Analysis error:", error);
            alert("Failed to analyze health data. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col">
            {/* Hero Banner Section */}
            <section className="relative w-full h-[50vh] min-h-[400px] overflow-hidden mb-12">
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
                        <h1 className="text-5xl md:text-6xl font-heading font-bold text-white mb-4 tracking-tight drop-shadow-lg">
                            Your Heart, Decoded.
                        </h1>
                        <p className="text-xl md:text-2xl text-accent-neon/90 mb-8 font-medium drop-shadow-md">
                            Upload your health data and get Gen-Z friendly cardiology insights.
                        </p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 pb-12 max-w-4xl">
                <div className="card p-8 space-y-6 animate-fade-in">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <AppIcon name="upload" size={26} color="#4EFFD2" />
                            <h2 className="text-3xl font-heading font-bold text-gradient-mint tracking-tight">
                                Upload Health Documents
                            </h2>
                        </div>
                        <p className="text-accent-gold/80 mb-2 text-lg">
                            Upload your health documents, medical records, or health summaries
                            for AI-powered analysis.
                        </p>
                        <p className="text-accent-neon/60 text-sm flex items-center gap-2">
                            <AppIcon name="ai" size={16} color="#4EFFD2" /> Gen-Z cardiology AI: Upload & vibe-check your heart health.
                        </p>
                    </div>

                    {/* MVP Info Card */}
                    <div className="bg-card/50 rounded-2xl p-4 border border-accent-gold/20 backdrop-blur-sm">
                        <p className="text-accent-gold/90 text-sm">
                            <span className="font-semibold text-accent-neon">Note:</span> This
                            MVP supports text-based health analysis. Apple Health raw files
                            coming soon.
                        </p>
                    </div>

                    {/* Drag and Drop Area */}
                    {!useManualText && (
                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${dragActive
                                ? "border-accent-neon bg-accent-neon/10 shadow-neon scale-[1.02]"
                                : "border-accent-neon/40 hover:border-accent-neon hover:shadow-neon-sm hover:bg-accent-neon/5"
                                }`}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                id="file-upload"
                                className="hidden"
                                onChange={handleFileChange}
                                accept=".pdf,.txt,.docx"
                            />
                            <label
                                htmlFor="file-upload"
                                className="cursor-pointer flex flex-col items-center"
                            >
                                <div className="mb-4 animate-bounce">
                                    <div className="rounded-xl bg-[#0F2520] p-3 border border-[#4EFFD2]/20">
                                        <AppIcon name="upload" size={48} color="#4EFFD2" />
                                    </div>
                                </div>
                                <span className="text-accent-neon text-lg font-semibold mb-2">
                                    Click to upload or drag and drop
                                </span>
                                <span className="text-accent-gold/70 text-sm">
                                    PDF, TXT, DOCX (Max 10MB)
                                </span>
                            </label>
                        </div>
                    )}

                    {/* Manual Text Input (Fallback) */}
                    {useManualText && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-primary-200 font-semibold">
                                    Manual Text Input
                                </label>
                                <button
                                    onClick={() => {
                                        setUseManualText(false);
                                        setManualText("");
                                        setFile(null);
                                    }}
                                    className="text-accent-400 hover:text-accent-300 text-sm"
                                >
                                    Upload file instead
                                </button>
                            </div>
                            <textarea
                                value={manualText}
                                onChange={(e) => setManualText(e.target.value)}
                                placeholder="Paste your health document text here..."
                                className="w-full bg-card/50 border border-accent-neon/20 rounded-2xl p-4 text-accent-gold/90 placeholder-accent-gold/40 focus:outline-none focus:border-accent-neon focus:ring-2 focus:ring-accent-neon/30 resize-none min-h-[200px] transition-all duration-300"
                                rows={10}
                            />
                        </div>
                    )}

                    {/* File Info */}
                    {file && !useManualText && (
                        <div className="bg-card/50 rounded-2xl p-4 border border-accent-gold/20 backdrop-blur-sm">
                            <p className="text-accent-neon">
                                Selected: <span className="font-semibold text-accent-gold">{file.name}</span>
                            </p>
                            <p className="text-accent-gold/70 text-sm mt-1">
                                Size: {(file.size / 1024).toFixed(2)} KB | Type: {file.type || "Unknown"}
                            </p>
                        </div>
                    )}

                    {/* Text Preview */}
                    {showTextPreview && extractedText && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-primary-200 font-semibold">
                                    Extracted Text Preview
                                </label>
                                <button
                                    onClick={() => setShowTextPreview(!showTextPreview)}
                                    className="text-accent-400 hover:text-accent-300 text-sm"
                                >
                                    {showTextPreview ? "Hide" : "Show"} Preview
                                </button>
                            </div>
                            <div className="bg-card/50 rounded-2xl p-4 border border-accent-gold/20 max-h-64 overflow-y-auto backdrop-blur-sm">
                                <p className="text-accent-gold/90 text-sm whitespace-pre-wrap">
                                    {extractedText.substring(0, 2000)}
                                    {extractedText.length > 2000 && "..."}
                                </p>
                                <p className="text-accent-neon/60 text-xs mt-2">
                                    Showing first 2000 characters of {extractedText.length} total
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Analyze Button */}
                    {(extractedText || manualText) && (
                        <button
                            onClick={handleAnalyze}
                            disabled={uploading || (!extractedText && !manualText.trim())}
                            className="w-full btn-primary py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 disabled:hover:scale-100 disabled:hover:shadow-none"
                        >
                            {uploading ? (
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
                                    Analyzing...
                                </>
                            ) : (
                                "Analyze Health Data"
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

