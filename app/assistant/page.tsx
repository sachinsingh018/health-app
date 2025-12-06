"use client";

import { useState, useRef, useEffect } from "react";
import { useHealthData } from "@/contexts/HealthDataContext";
import AppIcon from "@/components/ui/AppIcon";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

const quickActions = [
    "Interpret my labs",
    "Summarize my heart risks",
    "Prepare my next visit",
    "Explain my chest pain",
];

export default function AssistantPage() {
    const { healthData } = useHealthData();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: "Hello! I'm your cardiology health assistant. I can help you understand your health data, interpret lab results, assess heart risks, and prepare for doctor visits. How can I assist you today?",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [showQuickActions, setShowQuickActions] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleQuickAction = (action: string) => {
        setInput(action);
        setShowQuickActions(false);
        // Auto-send the quick action
        setTimeout(() => {
            handleSend(action);
        }, 100);
    };

    const handleSend = async (quickActionText?: string) => {
        const messageText = quickActionText || input.trim();
        if (!messageText || loading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: messageText,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        if (!quickActionText) {
            setInput("");
        }
        setShowQuickActions(false);
        setLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    history: messages.map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                    message: messageText,
                    timeline: healthData.timeline || {},
                    snapshot: healthData.snapshot || {},
                    cardiology: healthData.cardiology || {},
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to get response");
            }

            const data = await response.json();

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.reply || data.response || "I'm sorry, I couldn't process that request.",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "I'm sorry, I encountered an error. Please try again or make sure you've uploaded and analyzed your health documents first.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl h-[calc(100vh-8rem)] flex flex-col">
            <div className="card flex flex-col h-full">
                {/* Header */}
                <div className="p-6 border-b border-accent-gold/20 bg-card/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <AppIcon name="chat" size={26} color="#4EFFD2" />
                        <h1 className="text-4xl font-heading font-bold text-gradient-mint tracking-tight">
                            Cardiology Assistant
                        </h1>
                    </div>
                    <p className="text-accent-gold/80 flex items-center gap-2">
                        Your AI-powered cardiology health companion <AppIcon name="heart" size={18} color="#4EFFD2" />
                    </p>
                </div>

                {/* Messages - WhatsApp Style */}
                <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-gradient-card">
                    {messages.map((message, index) => (
                        <div
                            key={message.id}
                            className={`flex animate-slide-up ${message.role === "user" ? "justify-end" : "justify-start"
                                }`}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div
                                className={`max-w-[75%] rounded-3xl px-4 py-3 shadow-lg transition-all duration-300 ${message.role === "user"
                                    ? "bg-accent-neon/20 text-accent-neon border border-accent-neon/40 rounded-br-sm hover:shadow-neon-sm"
                                    : "card text-accent-gold/90 border border-accent-gold/30 rounded-bl-sm hover:shadow-gold-sm"
                                    }`}
                            >
                                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                                    {message.content}
                                </p>
                                <p
                                    className={`text-xs mt-2 ${message.role === "user"
                                        ? "text-accent-100"
                                        : "text-primary-300"
                                        } opacity-70`}
                                >
                                    {message.timestamp.toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start animate-fade-in">
                            <div className="card rounded-bl-sm px-4 py-3">
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 bg-accent-neon rounded-full animate-bounce shadow-neon-sm"></div>
                                    <div
                                        className="w-2 h-2 bg-accent-neon rounded-full animate-bounce shadow-neon-sm"
                                        style={{ animationDelay: "0.2s" }}
                                    ></div>
                                    <div
                                        className="w-2 h-2 bg-accent-neon rounded-full animate-bounce shadow-neon-sm"
                                        style={{ animationDelay: "0.4s" }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                {showQuickActions && messages.length === 1 && (
                    <div className="px-6 pt-4 pb-2 border-t border-accent-500/20">
                        <div className="flex flex-wrap gap-2">
                            {quickActions.map((action, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleQuickAction(action)}
                                    className="bg-primary-700/50 hover:bg-primary-700/70 text-primary-100 text-sm px-4 py-2 rounded-full border border-accent-500/20 transition-colors"
                                >
                                    {action}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input Box */}
                <div className="p-4 border-t border-accent-gold/20 bg-card/50 backdrop-blur-sm">
                    <div className="flex gap-3 items-end">
                        <div className="flex-1 relative">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                onFocus={() => setShowQuickActions(false)}
                                placeholder="Type your message..."
                                className="w-full bg-card/50 border border-accent-neon/20 rounded-3xl px-4 py-3 text-accent-neon placeholder-accent-neon/40 focus:outline-none focus:border-accent-neon focus:ring-2 focus:ring-accent-neon/30 resize-none text-sm transition-all duration-300"
                                rows={1}
                                disabled={loading}
                                style={{
                                    minHeight: "44px",
                                    maxHeight: "120px",
                                }}
                            />
                        </div>
                        <button
                            onClick={() => handleSend()}
                            disabled={!input.trim() || loading}
                            className="btn-primary min-w-[60px] h-[44px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center"
                        >
                            {loading ? (
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
                            ) : (
                                <AppIcon name="send" size={22} color="#4EFFD2" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
