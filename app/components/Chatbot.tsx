"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { 
  MessageCircle, X, Send, Mic, Volume2, Copy, 
  Bot, User, Loader2, Sparkles, Shield, MapPin, 
  FileText, AlertTriangle, Trash2
} from "lucide-react";
import toast from "react-hot-toast";

interface Message {
  id: string;
  content: string;
  isAI: boolean;
  timestamp: Date;
  severity?: string;
  quickActions?: string[];
}

export default function Chatbot() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "👋 Hello! I'm your AI Crime Safety Assistant. How can I help you today?",
      isAI: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      isAI: false,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          sessionId: sessionId,
        }),
      });

      const data = await response.json();
      
      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
      }

      let quickActions: string[] = [];
      if (messageText.toLowerCase().includes("safety") || messageText.toLowerCase().includes("tip")) {
        quickActions = ["Home safety", "Public safety", "Online safety"];
      } else if (messageText.toLowerCase().includes("report")) {
        quickActions = ["Report theft", "Report assault", "Report fraud"];
      } else if (messageText.toLowerCase().includes("area")) {
        quickActions = ["View crime map", "Set alerts", "Nearby stations"];
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.reply || "I'm here to help. Please try again.",
        isAI: true,
        timestamp: new Date(),
        severity: data.severity,
        quickActions: quickActions.length > 0 ? quickActions : undefined,
      };
      setMessages(prev => [...prev, aiMessage]);

      if (data.isEmergency) {
        toast.error("🚨 EMERGENCY! Please call 911/112 immediately!", { duration: 10000 });
      }

    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble connecting. Please try again.",
        isAI: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    if (sessionId) {
      await fetch("/api/chat", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
    }
    setMessages([{
      id: "welcome",
      content: "👋 Hello! I'm your AI Crime Safety Assistant. How can I help you today?",
      isAI: true,
      timestamp: new Date(),
    }]);
    setSessionId(null);
    toast.success("Chat cleared!");
  };

  const handleVoiceInput = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = "en-US";
      recognition.onstart = () => {
        setIsRecording(true);
        toast.success("Listening...");
      };
      recognition.onresult = (event: any) => {
        sendMessage(event.results[0][0].transcript);
        setIsRecording(false);
      };
      recognition.onerror = () => {
        setIsRecording(false);
        toast.error("Try again");
      };
      recognition.onend = () => {
        setIsRecording(false);
      };
      recognition.start();
    } else {
      toast.error("Voice not supported");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  const speakMessage = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
      toast.success("Speaking...");
    }
  };

  const quickActionsList = [
    { icon: FileText, title: "Report a Crime", action: "I want to report a crime" },
    { icon: Shield, title: "Safety Tips", action: "Give me safety tips" },
    { icon: MapPin, title: "Check Area", action: "Is my area safe?" },
    { icon: AlertTriangle, title: "Emergency", action: "Emergency help needed" },
  ];

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          // boxShadow: ["0 0 0 0 rgba(239,68,68,0.7)", "0 0 0 15px rgba(239,68,68,0)"],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-700 rounded-full blur-xl opacity-75"></div>
          <div className="relative bg-gradient-to-r from-red-500 to-red-700 p-3.5 rounded-full shadow-2xl">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <motion.div
            className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed bottom-24 right-6 z-50"
            style={{ width: "min(90vw, 380px)", maxWidth: "380px", height: "min(80vh, 580px)", maxHeight: "580px" }}
          >
            <div className="bg-black/90 backdrop-blur-xl rounded-2xl border border-red-500/30 shadow-2xl flex flex-col h-full overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-600 to-red-800 px-4 py-3 flex-shrink-0">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Bot className="w-7 h-7 text-white" />
                    <div>
                      <h3 className="font-semibold text-white text-sm">AI Safety Assistant</h3>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        <p className="text-xs text-white/70">Online 24/7</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={clearChat} className="text-white/70 hover:text-white p-1" title="Clear chat">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setIsMinimized(true)} className="text-white/70 hover:text-white p-1">
                      <span className="text-lg">−</span>
                    </button>
                    <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white p-1">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages Container */}
              <div 
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-black to-red-950/10"
                style={{ minHeight: 0 }}
              >
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isAI ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[85%] ${msg.isAI ? "mr-auto" : "ml-auto"}`}>
                      <div className="flex items-start gap-2">
                        {msg.isAI && (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-500 to-red-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Bot className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <div>
                          <div className={`rounded-2xl px-3 py-2 text-sm ${
                            msg.isAI 
                              ? "bg-white/10 border border-red-500/20 text-gray-200" 
                              : "bg-gradient-to-r from-red-500 to-red-700 text-white"
                          }`}>
                            <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                          </div>
                          <div className="flex gap-2 mt-1 ml-1">
                            {msg.isAI && (
                              <>
                                <button onClick={() => copyToClipboard(msg.content)} className="text-gray-500 hover:text-white">
                                  <Copy className="w-2.5 h-2.5" />
                                </button>
                                <button onClick={() => speakMessage(msg.content)} className="text-gray-500 hover:text-white">
                                  <Volume2 className="w-2.5 h-2.5" />
                                </button>
                              </>
                            )}
                            <span className="text-[9px] text-gray-600">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          {msg.quickActions && msg.quickActions.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {msg.quickActions.map((action, i) => (
                                <button 
                                  key={i} 
                                  onClick={() => sendMessage(action)} 
                                  className="px-2 py-0.5 rounded-full text-[10px] bg-white/10 border border-red-500/30 text-white hover:bg-white/20 transition"
                                >
                                  {action}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        {!msg.isAI && (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-gray-600 to-gray-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <User className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 rounded-2xl px-3 py-2">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              {messages.length === 1 && (
                <div className="px-3 pt-2 pb-1 border-t border-red-500/20 flex-shrink-0">
                  <p className="text-[10px] text-gray-400 mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-red-400" />
                    Quick Actions
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {quickActionsList.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(action.action)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-left border border-red-500/20"
                      >
                        <action.icon className="w-3 h-3 text-red-400 mb-0.5" />
                        <p className="text-white text-[11px] font-medium">{action.title}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Replies */}
              {messages.length > 1 && messages.length < 8 && (
                <div className="px-3 py-2 border-t border-red-500/20 flex-shrink-0">
                  <div className="flex flex-wrap gap-1">
                    {["Yes", "No", "Tell me more", "What should I do?"].map((reply, i) => (
                      <button key={i} onClick={() => sendMessage(reply)} className="px-2 py-1 rounded-full text-[10px] bg-white/10 border border-red-500/30 text-white hover:bg-white/20 transition">
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-3 border-t border-red-500/20 bg-black/50 flex-shrink-0">
                <div className="flex gap-2">
                  <button
                    onClick={handleVoiceInput}
                    className={`p-2 rounded-lg transition ${isRecording ? "bg-red-500 animate-pulse" : "bg-white/10"}`}
                  >
                    <Mic className="w-4 h-4 text-gray-400" />
                  </button>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage(input)}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 bg-white/10 border border-red-500/30 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  <button
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim() || isLoading}
                    className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 disabled:opacity-50 transition"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Send className="w-4 h-4 text-white" />}
                  </button>
                </div>
                <p className="text-[9px] text-gray-500 text-center mt-1.5">
                  For emergencies, call local authorities immediately
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Minimized view */}
        {isOpen && isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50"
          >
            <button
              onClick={() => setIsMinimized(false)}
              className="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
            >
              <Bot className="w-4 h-4" />
              <span className="text-sm">AI Assistant</span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}