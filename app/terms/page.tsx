"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Shield, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  UserCheck,
  Lock,
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowLeft,
  Scale,
  BookOpen,
  AlertCircle
} from "lucide-react";
import Navbar from "../components/Navbar";
import HoverFooter from "../components/hover-footer";

export default function TermsOfServicePage() {
  const lastUpdated = "June 11, 2026";

  const sections = [
    {
      icon: CheckCircle,
      title: "1. Acceptance of Terms",
      items: [
        "By accessing or using our crime reporting system, you agree to these terms",
        "Must be at least 18 years old to use the service",
        "Must provide accurate information when reporting"
      ]
    },
    {
      icon: UserCheck,
      title: "2. User Responsibilities",
      items: [
        "Submit truthful and accurate reports",
        "Do not make false or malicious reports",
        "Maintain confidentiality of your account",
        "Do not share sensitive information about others without consent",
        "Do not use the system for harassment or intimidation"
      ]
    },
    {
      icon: AlertTriangle,
      title: "3. Prohibited Activities",
      items: [
        "Submitting false or misleading reports",
        "Using the platform for illegal activities",
        "Attempting to manipulate or hack the system",
        "Harassing or threatening other users",
        "Posting inappropriate or offensive content"
      ]
    },
    // {
    //   icon: Shield,
    //   title: "4. Privacy & Data Protection",
    //   items: [
    //     "We protect your personal information as per Privacy Policy",
    //     "Anonymous reporting option is available",
    //     "Your data is encrypted and securely stored",
    //     "We never share your data without legal requirement"
    //   ]
    // },
    {
      icon: Scale,
      title: "5. Legal Compliance",
      items: [
        "All reports must comply with local laws",
        "False reporting may lead to legal consequences",
        "We cooperate with law enforcement agencies",
        "Users are responsible for their own legal compliance"
      ]
    },
    {
      icon: Lock,
      title: "6. Account Termination",
      items: [
        "We reserve the right to suspend or terminate accounts",
        "Repeated false reporting leads to account ban",
        "Illegal activities will be reported to authorities",
        "Users can request account deletion anytime"
      ]
    },
    {
      icon: FileText,
      title: "7. Disclaimer of Warranties",
      items: [
        "Service is provided 'as is' without warranties",
        "We do not guarantee real-time accuracy of all reports",
        "Not responsible for actions taken based on reports",
        "Emergency situations require calling local authorities"
      ]
    },
    {
      icon: AlertCircle,
      title: "8. Limitation of Liability",
      items: [
        "We are not liable for indirect or consequential damages",
        "Maximum liability is limited to the amount paid",
        "Not responsible for third-party content",
        "Users assume all risks associated with using the platform"
      ]
    }
  ];

  const contactInfo = [
    { icon: Mail, text: "legal@crimesafety.com" },
    { icon: Phone, text: "+1 (555) 123-4567" },
    { icon: MapPin, text: "123 Sector V, Kolkata, WB 700014" },
    { icon: Clock, text: "Monday - Friday: 9am - 6pm" },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-black via-red-950/10 to-black pt-28 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back to Home Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-red-400 transition-all duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </Link>
          </motion.div>

          {/* Header with Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-left mb-12"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-red-500/20 to-red-700/20 border border-red-500/30 flex items-center justify-center backdrop-blur-sm">
                <FileText className="w-7 h-7 text-red-400" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Terms of <span className="text-red-500">Service</span>
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  Last updated: <span className="text-red-400">{lastUpdated}</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/50 backdrop-blur-xl rounded-2xl border border-red-900/30 p-6 mb-8"
          >
            <p className="text-gray-300 leading-relaxed">
              Welcome to CrimeSafety. These Terms of Service govern your use of our crime reporting platform. 
              By accessing or using our services, you agree to be bound by these terms. Please read them carefully. 
              If you do not agree with any part of these terms, please do not use our platform.
            </p>
          </motion.div>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="bg-black/50 backdrop-blur-xl rounded-2xl border border-red-900/30 p-6 hover:border-red-500/40 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
                    <section.icon className="w-5 h-5 text-red-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                </div>

                <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm ml-2">
                  {section.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Governing Law Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-black/50 backdrop-blur-xl rounded-2xl border border-red-900/30 p-6 mt-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
                <Globe className="w-5 h-5 text-red-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">9. Governing Law</h2>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              These terms shall be governed by and construed in accordance with the laws of India. 
              Any disputes arising under these terms shall be subject to the exclusive jurisdiction 
              of the courts in Kolkata, West Bengal.
            </p>
          </motion.div>

          {/* Contact Section
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-black/50 backdrop-blur-xl rounded-2xl border border-red-900/30 p-6 mt-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
                <BookOpen className="w-5 h-5 text-red-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Contact Us</h2>
            </div>
            <p className="text-gray-400 mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-3">
              {contactInfo.map((contact, i) => (
                <div key={i} className="flex items-center gap-3">
                  <contact.icon className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-400 text-sm">{contact.text}</span>
                </div>
              ))}
            </div>
          </motion.div> */}

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-center mt-8"
          >
            <p className="text-gray-500 text-xs">
              By using CrimeSafety, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </motion.div>
        </div>
      </div>
      <HoverFooter />
    </>
  );
}