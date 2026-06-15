import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, X, Send, HelpCircle, GraduationCap, ChevronLeft, Minimize2, MessageCircle, HelpCircle as HelpIcon, ArrowDownCircle } from "lucide-react";

interface AITutorInterfaceProps {
  courseTitle: string;
  lessonTitle: string;
  lessonType?: string;
  studentName?: string;
}

interface Message {
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

export default function AITutorInterface({
  courseTitle,
  lessonTitle,
  lessonType = "video",
  studentName = "Alex Mercer"
}: AITutorInterfaceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize with a customized warm welcome when a new lesson is selected
  useEffect(() => {
    setMessages([
      {
        sender: "ai",
        text: `Hello ${studentName}! 👋 I am your dedicated **Google Academic Gemini AI Tutor**.\n\nI've synchronized your classroom workbook with our lesson module: **"${lessonTitle}"** (categorized as ${lessonType.toUpperCase()} node) under the **${courseTitle}** syllabus.\n\nHow would you like to proceed? Select one of our fast-study triggers below, or ask your own question!`,
        timestamp: new Date()
      }
    ]);
  }, [lessonTitle, courseTitle, studentName, lessonType]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      sender: "user",
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Map message log history into Gemini role formats safely
      const mappedHistory = messages.map(msg => ({
        sender: msg.sender === "user" ? "user" : "ai",
        text: msg.text
      }));

      const res = await fetch("/api/ai/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: mappedHistory,
          courseTitle,
          lessonTitle,
          lessonType
        })
      });

      const data = await res.json();
      
      const aiResponse: Message = {
        sender: "ai",
        text: data.reply || "I apologize, I was unable to retrieve a lesson reply. Let me check the database parameters for you.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      console.error("AI Tutor connection failure:", err);
      setMessages(prev => [
        ...prev,
        {
          sender: "ai",
          text: "I encountered an error connecting to our syllabus service. Let me clarify: This node focuses on structural core engineering of the study block. Feel free to re-submit your prompt inside the box.",
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const txt = inputValue;
    setInputValue("");
    handleSendMessage(txt);
  };

  // Custom regex-powered lightweight markdown renderer to prevent compiling errors or bulky code block issues
  const renderFormattedText = (text: string) => {
    // Split by code blocks first
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        // Code Block
        const codeLines = part.slice(3, -3).trim().split("\n");
        // Check first line for language prefix
        const firstLine = codeLines[0] || "";
        const hasLang = /^[a-zA-Z0-9+#\-]+$/.test(firstLine);
        const codeContent = hasLang ? codeLines.slice(1).join("\n") : codeLines.join("\n");
        
        return (
          <pre key={index} className="bg-gray-900 text-emerald-400 font-mono text-[10.5px] p-2.5 rounded-lg my-1.5 overflow-x-auto border border-gray-800 shadow-sm leading-relaxed max-w-full">
            <code>{codeContent}</code>
          </pre>
        );
      }

      // Inline backticks
      const inlineParts = part.split(/(`[^`\n]+`)/g);
      return (
        <span key={index}>
          {inlineParts.map((inlinePart, subIdx) => {
            if (inlinePart.startsWith("`") && inlinePart.endsWith("`")) {
              return (
                <code key={subIdx} className="bg-amber-50 text-amber-800 px-1 py-0.5 rounded text-[10px] font-mono border border-amber-200">
                  {inlinePart.slice(1, -1)}
                </code>
              );
            }

            // Normal lines (Markdown headlines, lists, and bold text)
            const lines = inlinePart.split("\n");
            return lines.map((line, lineIdx) => {
              const trimmed = line.trim();
              const isBullet = trimmed.startsWith("* ") || trimmed.startsWith("- ");
              const isHeading = trimmed.startsWith("#");

              let content = line;
              if (isBullet) {
                content = trimmed.replace(/^[\*\-]\s+/, "");
              } else if (isHeading) {
                content = trimmed.replace(/^#+\s+/, "");
              }

              // Bold items (**text**)
              const boldSegments = content.split(/(\*\*[^*]+\*\*)/g);
              const renderedLine = boldSegments.map((segment, segIdx) => {
                if (segment.startsWith("**") && segment.endsWith("**")) {
                  return <strong key={segIdx} className="font-bold text-gray-900">{segment.slice(2, -2)}</strong>;
                }
                return segment;
              });

              if (isHeading) {
                return (
                  <h4 key={lineIdx} className="font-bold text-gray-900 text-[11.5px] mt-2 mb-1 border-b border-gray-100 pb-0.5 uppercase tracking-wide block">
                    {renderedLine}
                  </h4>
                );
              }

              if (isBullet) {
                return (
                  <span key={lineIdx} className="flex items-start gap-1.5 pl-2.5 my-1 text-[11px] text-gray-700 leading-relaxed block">
                    <span className="text-blue-500 font-bold shrink-0 mt-0.5 select-none">•</span>
                    <span>{renderedLine}</span>
                  </span>
                );
              }

              return (
                <span key={lineIdx} className="text-[11px] text-gray-700 leading-relaxed block my-1 whitespace-pre-wrap">
                  {renderedLine}
                </span>
              );
            });
          })}
        </span>
      );
    });
  };

  const quickPrompts = [
    {
      label: "Analogy Mode",
      icon: HelpCircle,
      prompt: `Please explain the lesson "${lessonTitle}" using a clear, real-world analogy so that it feels highly relatable and memorable.`
    },
    {
      label: "Key Takeaways",
      icon: GraduationCap,
      prompt: `Can you break down the core lesson "${lessonTitle}" into 3 actionable key bullet point takeaways for studying?`
    },
    {
      label: "Practice Challenge",
      icon: Sparkles,
      prompt: `Give me a simple, open-ended practical challenge or review scenario about the lesson "${lessonTitle}" to test my analytical skills.`
    }
  ];

  return (
    <div id="ai-tutor-overlay" className="fixed bottom-6 right-6 z-100 font-sans">
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            key="floating-btn"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-bold text-xs shadow-lg hover:from-blue-700 hover:to-indigo-700 cursor-pointer transition-all border border-blue-500/10"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
            <span>EXPLAIN LESSON (AI)</span>
          </motion.button>
        ) : (
          <motion.div
            key="ai-tutor-window"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="bg-white w-80 sm:w-96 rounded-2xl border border-gray-150 shadow-2xl overflow-hidden flex flex-col max-h-[500px]"
          >
            {/* Header portion */}
            <div className="bg-gradient-to-r from-gray-900 to-slate-800 p-4 text-white text-left relative">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-600/20 p-1.5 rounded-lg border border-blue-500/25">
                    <Sparkles className="w-4.5 h-4.5 text-blue-400 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs uppercase tracking-wider text-blue-300">Gemini Academic Tutor</h3>
                    <p className="text-[10px] text-gray-300 font-medium line-clamp-1">Active syllabus: {courseTitle}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-all cursor-pointer"
                  title="Close AI Tutor"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Course indicators */}
              <div className="mt-3 bg-white/5 border border-white/5 p-2 rounded-lg text-[9.5px] leading-snug">
                <span className="font-semibold text-blue-300 block">📚 CURRENT LESSON IN FOCUS:</span>
                <span className="text-gray-200 font-bold mt-0.5 block">{lessonTitle} ({lessonType.toUpperCase()})</span>
              </div>
            </div>

            {/* Chat Messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 min-h-[180px]">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col text-left ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <span className="text-[8px] text-gray-400 font-mono mb-0.5">
                    {msg.sender === "user" ? studentName : "Academic AI"}
                  </span>
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-xl text-xs shadow-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-none font-medium"
                        : "bg-white text-gray-800 rounded-bl-none border border-gray-150 select-text"
                    }`}
                  >
                    {msg.sender === "user" ? (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    ) : (
                      <div className="space-y-1">{renderFormattedText(msg.text)}</div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2.5 text-left p-1">
                  <div className="flex space-x-1 items-center bg-white border border-gray-150 px-3 py-2 rounded-lg rounded-bl-none shadow-3xs">
                    <span className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                  <span className="text-[9.5px] text-gray-400 font-medium animate-pulse">Tutor compiling academic explanation...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Trigger Suggestion Buttons */}
            <div className="p-2.5 border-t border-gray-100 bg-white grid grid-cols-3 gap-1.5 text-center shrink-0">
              {quickPrompts.map((q, i) => {
                const IconComp = q.icon;
                return (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(q.prompt)}
                    disabled={isLoading}
                    className="py-1.5 px-1 bg-blue-50/60 hover:bg-blue-100/85 disabled:bg-gray-100 border border-blue-100/50 hover:border-blue-200 rounded-lg text-[9.5px] font-bold text-blue-700 transition-all flex flex-col items-center gap-1 cursor-pointer"
                  >
                    <IconComp className="w-3.5 h-3.5 shrink-0" />
                    <span>{q.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Input Form Box */}
            <form onSubmit={handleSubmitForm} className="p-3 border-t border-gray-100 bg-white flex gap-2 shrink-0">
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Ask specific analytical questions..."
                disabled={isLoading}
                className="flex-1 border border-gray-200 rounded px-2.5 py-1.5 text-xs bg-slate-50/50 focus:bg-white focus:border-blue-500 outline-hidden transition-all text-gray-800 font-medium placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded transition-all cursor-pointer shadow-3xs"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
