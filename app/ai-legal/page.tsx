"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Scale, 
  Shield, 
  BookOpen, 
  Send, 
  Loader2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Phone,
  MessageCircle,
  Briefcase,
  Home,
  Car,
  Heart,
  Laptop,
  Landmark,
  User,
  Baby,
  GraduationCap,
  Zap,
  HelpCircle,
  FileText
} from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import HoverFooter from "../components/hover-footer";

interface Message {
  id: string;
  content: string;
  isAI: boolean;
  timestamp: Date;
}

interface LegalTopic {
  id: string;
  title: string;
  icon: any;
  description: string;
  color: string;
  bgColor: string;
}

const legalTopics: LegalTopic[] = [
  { id: "criminal", title: "Criminal Law", icon: Scale, description: "IPC, FIR, bail, court procedures", color: "#ef4444", bgColor: "rgba(239,68,68,0.1)" },
  { id: "cyber", title: "Cyber Crime", icon: Laptop, description: "IT Act, online fraud, hacking", color: "#3b82f6", bgColor: "rgba(59,130,246,0.1)" },
  { id: "women", title: "Women Safety", icon: Heart, description: "Domestic violence, harassment", color: "#ec4899", bgColor: "rgba(236,72,153,0.1)" },
  { id: "consumer", title: "Consumer Rights", icon: FileText, description: "Consumer court, refunds", color: "#10b981", bgColor: "rgba(16,185,129,0.1)" },
  { id: "property", title: "Property Law", icon: Home, description: "Registration, inheritance", color: "#f59e0b", bgColor: "rgba(245,158,11,0.1)" },
  { id: "traffic", title: "Traffic Law", icon: Car, description: "Challan, license, accidents", color: "#f97316", bgColor: "rgba(249,115,22,0.1)" },
  { id: "labor", title: "Labor Law", icon: Briefcase, description: "Employment rights, termination", color: "#8b5cf6", bgColor: "rgba(139,92,246,0.1)" },
  { id: "family", title: "Family Law", icon: User, description: "Divorce, custody, marriage", color: "#f43f5e", bgColor: "rgba(244,63,94,0.1)" },
];

const emergencyContacts = [
  { name: "Police Emergency", number: "112", icon: Shield, color: "#ef4444" },
  { name: "Women Helpline", number: "1091", icon: Heart, color: "#ec4899" },
  { name: "Child Helpline", number: "1098", icon: Baby, color: "#f59e0b" },
  { name: "Cyber Crime", number: "1930", icon: Laptop, color: "#3b82f6" },
  { name: "Legal Aid", number: "1516", icon: Scale, color: "#10b981" },
];

// Legal responses database
const legalResponses: Record<string, string> = {
  "fir": "📝 **How to File an FIR:**\n\n1. Visit nearest police station\n2. Give written complaint in Hindi/English\n3. Get free copy of FIR (Section 154 CrPC)\n4. If police refuses, approach SP\n5. Online at cybercrime.gov.in\n\n**Helpline:** 112",
  "bail": "⚖️ **Types of Bail:**\n\n• Regular Bail (Section 437/439 CrPC)\n• Anticipatory Bail (Section 438 CrPC)\n• Interim Bail\n\n**Apply through lawyer in court**",
  "cyber": "💻 **Report Cyber Crime:**\n\n**Helpline:** 1930\n\n• Visit cybercrime.gov.in\n• Save evidence\n• Contact cyber cell\n• IT Act Sections 66C, 66D apply",
  "women": "🛡️ **Women Safety Laws:**\n\n**Helplines:** 1091, 7827170170\n\n• Domestic Violence Act 2005\n• POSH Act 2013\n• IPC 354A-354D\n\n**Identity protected by law**",
  "consumer": "🛒 **Consumer Rights:**\n\n**Helpline:** 1915\n\n• File at consumerhelpline.gov.in\n• Approach District Consumer Court\n• E-filing at e-daakhil.nic.in",
  "property": "🏠 **Property Law:**\n\n• Register at Sub-Registrar office\n• Pay stamp duty\n• Hindu Succession Act applies\n• Legal heirs have equal rights",
  "traffic": "🚗 **Traffic Law:**\n\n**Check Challan:** parivahan.gov.in\n\n**Penalties:**\n• No helmet: ₹1000\n• No seatbelt: ₹1000\n• Red light jump: ₹5000\n• Drunken driving: ₹10,000",
  "labor": "💼 **Labor Law:**\n\n**Helpline:** 1551\n\n• Written appointment letter required\n• 15 days annual leave\n• EPF and ESI benefits\n• Wrongful termination: File complaint",
  "divorce": "👨‍👩‍👧 **Divorce Law:**\n\n• Mutual consent: 6-18 months\n• Contested: 1-3 years\n• Grounds: cruelty, adultery\n• Child custody, maintenance available",
};

const getLegalResponse = (question: string): string => {
  const q = question.toLowerCase();
  
  for (const [key, response] of Object.entries(legalResponses)) {
    if (q.includes(key)) {
      return response;
    }
  }
  
  return "⚖️ **Legal Information Available**\n\nAsk me about:\n• FIR and bail procedures\n• Cyber crime reporting\n• Women safety laws\n• Consumer complaints\n• Property and inheritance\n• Traffic violations\n• Employee rights\n• Divorce and family laws\n\nType your specific question!";
};

export default function AILegalPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "⚖️ **Welcome to AI Legal Assistant**\n\nI provide legal information based on Indian laws.\n\n**Topics I cover:**\n• Criminal Law (FIR, Bail, IPC)\n• Cyber Crime Law\n• Women Safety Laws\n• Consumer Rights\n• Property Law\n• Traffic Law\n• Labor Law\n• Family Law\n\n**Disclaimer:** Legal information only, not legal advice. Consult a lawyer for specific cases.\n\nWhat legal information do you need?",
      isAI: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

    // Simulate AI thinking (no API call needed)
    setTimeout(() => {
      const response = getLegalResponse(messageText);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isAI: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 600);
  };

  const handleTopicClick = (topic: LegalTopic) => {
    setSelectedTopic(topic.id);
    sendMessage(`Tell me about ${topic.title}`);
  };

  const quickQuestions = [
    "How to file an FIR?",
    "What is anticipatory bail?",
    "How to report cyber crime?",
    "Women safety laws?",
    "Consumer complaint process?",
    "Property inheritance laws?",
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-black via-red-950/5 to-black pt-28 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-red-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-2xl">
                <Scale className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-4">
              AI Legal <span className="text-red-500">Assistant</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mt-2">
              Instant legal information based on Indian laws
            </p>
          </motion.div>

          {/* Emergency Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center mb-8"
          >
            <button
              onClick={() => setShowEmergency(!showEmergency)}
              className="bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 backdrop-blur-sm px-6 py-3 rounded-full text-white flex items-center gap-2 transition-all duration-300"
            >
              <AlertCircle className="w-5 h-5 text-red-400" />
              Emergency Helplines
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showEmergency ? "rotate-180" : ""}`} />
            </button>
          </motion.div>

          {/* Emergency Contacts */}
          <AnimatePresence>
            {showEmergency && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8"
              >
                <div className="bg-gradient-to-r from-red-950/20 to-black/50 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white text-center mb-4">Emergency Helplines</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {emergencyContacts.map((contact) => (
                      <div key={contact.name} className="text-center p-4 bg-black/50 backdrop-blur-sm rounded-xl border border-red-500/20 hover:border-red-500/50 transition-all">
                        <contact.icon className="w-8 h-8 mx-auto mb-2" style={{ color: contact.color }} />
                        <p className="text-gray-300 text-sm">{contact.name}</p>
                        <p className="text-xl font-bold" style={{ color: contact.color }}>{contact.number}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Topics Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-red-900/30 p-4 sticky top-28">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-red-400" />
                  Legal Topics
                </h2>
                <div className="space-y-2">
                  {legalTopics.map((topic) => (
                    <motion.button
                      key={topic.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTopicClick(topic)}
                      className={`w-full p-3 rounded-xl text-left transition-all duration-300 ${
                        selectedTopic === topic.id
                          ? "border border-red-500/50 shadow-lg"
                          : "border border-red-900/30 hover:border-red-500/30"
                      }`}
                      style={{
                        background: selectedTopic === topic.id ? topic.bgColor : "rgba(255,255,255,0.03)",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <topic.icon className="w-5 h-5" style={{ color: topic.color }} />
                        <div>
                          <div className="font-medium text-white">{topic.title}</div>
                          <div className="text-xs text-gray-500">{topic.description}</div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Chat Area */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-red-900/30 overflow-hidden flex flex-col h-[600px]">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600/20 to-red-800/20 backdrop-blur-sm px-5 py-3.5 border-b border-red-900/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                      <Scale className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">AI Legal Assistant</h3>
                      <p className="text-xs text-gray-500">Legal Information • Indian Laws</p>
                    </div>
                  </div>
                </div>

                {/* Messages Container - Fixed Scroll */}
                <div 
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto p-4 space-y-3"
                  style={{ minHeight: 0 }}
                >
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isAI ? "justify-start" : "justify-end"}`}>
                      <div className={`max-w-[85%] ${msg.isAI ? "mr-auto" : "ml-auto"}`}>
                        <div className={`rounded-2xl px-4 py-2.5 text-sm ${
                          msg.isAI 
                            ? "bg-white/5 border border-red-500/20 text-gray-200" 
                            : "bg-gradient-to-r from-red-500 to-red-600 text-white"
                        }`}>
                          <div className="whitespace-pre-wrap">{msg.content}</div>
                        </div>
                        <p className="text-[10px] text-gray-600 mt-1 text-right">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white/5 border border-red-500/20 rounded-2xl px-4 py-2.5">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                          <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Questions */}
                {messages.length === 1 && (
                  <div className="p-3 border-t border-red-900/30 bg-black/30">
                    <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-red-400" />
                      Quick Questions
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {quickQuestions.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => sendMessage(q)}
                          className="px-3 py-1.5 rounded-full text-xs bg-white/5 border border-red-500/30 text-gray-300 hover:bg-white/10 hover:border-red-500/50 transition-all duration-300"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Area - Fixed at bottom */}
                <div className="p-3 border-t border-red-900/30 bg-black/50">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendMessage(input)}
                      placeholder="Ask your legal question..."
                      className="flex-1 px-3 py-2 bg-white/5 border border-red-500/30 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                    />
                    <button
                      onClick={() => sendMessage(input)}
                      disabled={!input.trim() || isLoading}
                      className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 disabled:opacity-50 transition-all duration-300"
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Send className="w-4 h-4 text-white" />}
                    </button>
                  </div>
                  <p className="text-[9px] text-gray-600 text-center mt-2">
                    ⚖️ Legal information only. For specific cases, consult a lawyer.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <HoverFooter />
    </>
  );
}