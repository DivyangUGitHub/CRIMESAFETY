"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  Send, 
  ChevronDown,
  ChevronUp,
  Facebook,
  Twitter,
  Linkedin,
  Instagram
} from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import HoverFooter from "../components/hover-footer";
import { GlobeLive } from "../components/ui/cobe-globe-live";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is CrimeSafety?",
      answer: "CrimeSafety is a secure online platform that allows citizens to report crimes anonymously, track incident status, and access real-time crime maps and safety analytics.",
    },
    {
      question: "How does CrimeSafety work?",
      answer: "Users can submit crime reports through our secure form. Our AI system verifies the report, and it gets sent to relevant authorities. Users can track their report status anonymously.",
    },
    {
      question: "Is CrimeSafety being run under the Government?",
      answer: "CrimeSafety is a public safety initiative that collaborates with local law enforcement agencies. We follow government guidelines and data protection laws.",
    },
    {
      question: "Is CrimeSafety free to use?",
      answer: "Yes, CrimeSafety is completely free for all citizens. Our mission is to make communities safer without any cost barriers.",
    },
    {
      question: "What kind of support does CrimeSafety offer?",
      answer: "We offer 24/7 AI chatbot support, email support, and emergency contact assistance. Our team is dedicated to helping you.",
    },
    {
      question: "How can I support CrimeSafety?",
      answer: "You can support us by spreading awareness, providing feedback, or contributing to our open-source project on GitHub.",
    },
    {
      question: "Is CrimeSafety Open-Source?",
      answer: "Yes, CrimeSafety is open-source! You can find our code on GitHub and contribute to making communities safer.",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Message sent successfully! We'll get back to you soon.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error(data.error || "Failed to send message. Please try again.");
      }
    } catch (error) {
      toast.error("Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black pt-28 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Contact <span className="text-red-500">Us</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Have questions? We're here to help. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>

          {/* Form + Globe Section - Side by Side */}
          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            {/* Contact Form - Left Side */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-black/50 backdrop-blur-xl rounded-2xl border border-red-900/30 p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-2">Send Us a Message</h2>
              <p className="text-gray-400 mb-6">We'll get back to you as soon as possible</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-red-900/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Your Name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-red-900/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-red-900/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                    placeholder="Your message here..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 py-3 rounded-xl text-white font-semibold transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Globe - Right Side */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col items-center justify-center"
            >
              <div className="w-full max-w-md aspect-square">
                <GlobeLive 
                  speed={0.003}
                  className="w-full h-full"
                />
              </div>
              <p className="text-gray-500 text-sm mt-6 text-center">
                Our lines are open 24/7.<br />
                Feel free to reach out to us anytime.
              </p>
            </motion.div>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-6 mb-12">
            <a href="https://www.linkedin.com/in/divyang-upreti/" className="w-10 h-10 rounded-full bg-white/10 hover:bg-red-500/20 flex items-center justify-center transition">
              <Facebook size={18} className="text-gray-400" />
            </a>
            <a href="https://x.com/Divyang_Upreti_" className="w-10 h-10 rounded-full bg-white/10 hover:bg-red-500/20 flex items-center justify-center transition">
              <Twitter size={18} className="text-gray-400" />
            </a>
            <a href="https://www.linkedin.com/in/divyang-upreti/" className="w-10 h-10 rounded-full bg-white/10 hover:bg-red-500/20 flex items-center justify-center transition">
              <Linkedin size={18} className="text-gray-400" />
            </a>
            <a href="https://x.com/Divyang_Upreti_" className="w-10 h-10 rounded-full bg-white/10 hover:bg-red-500/20 flex items-center justify-center transition">
              <Instagram size={18} className="text-gray-400" />
            </a>
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/50 backdrop-blur-xl rounded-2xl border border-red-900/30 p-6"
          >
            <h2 className="text-2xl font-bold text-white text-center mb-2">
              F.A.Q. Frequently Asked Questions
            </h2>
            <p className="text-gray-400 text-center mb-8">
              Find answers to common questions about CrimeSafety
            </p>

            <div className="space-y-3 max-w-3xl mx-auto">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-red-900/30 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex justify-between items-center p-4 text-left bg-white/5 hover:bg-white/10 transition"
                  >
                    <span className="text-white font-medium">{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-red-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-red-400" />
                    )}
                  </button>
                  
                  {openFaq === index && (
                    <div className="p-4 border-t border-red-900/30 bg-black/30">
                      <p className="text-gray-400 text-sm">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <HoverFooter />
    </>
  );
}