"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  Share2,
  Trash2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowLeft
} from "lucide-react";
import Navbar from "../components/Navbar";
import HoverFooter from "../components/hover-footer";

export default function PrivacyPolicyPage() {
  const lastUpdated = "June 11, 2026";

  const sections = [
    {
      icon: Database,
      title: "1. Information We Collect",
      items: [
        "Name and contact details",
        "Location data",
        "Account credentials",
        "IP address and device information",
        "Incident details and descriptions",
        "Photos and videos submitted",
        "Witness information"
      ]
    },
    {
      icon: Lock,
      title: "2. How We Use Information",
      items: [
        "To provide and maintain our service",
        "To verify crime reports using AI",
        "To notify you about case updates",
        "To improve our platform and services",
        "To comply with legal obligations"
      ]
    },
    {
      icon: Share2,
      title: "3. Information Sharing",
      items: [
        "Law enforcement agencies for investigation",
        "Legal authorities when required by law",
        "Service providers who assist our operations",
        "Never sell your personal information to third parties"
      ]
    },
    {
      icon: Shield,
      title: "4. Data Security",
      items: [
        "End-to-end encryption for sensitive data",
        "Regular security audits and updates",
        "Secure data centers with restricted access",
        "Anonymous reporting options available"
      ]
    },
    {
      icon: Eye,
      title: "5. Your Rights",
      items: [
        "Access your personal data",
        "Request data correction or deletion",
        "Opt-out of data collection",
        "File a complaint with authorities",
        "Request anonymous reporting"
      ]
    },
    {
      icon: Trash2,
      title: "6. Data Retention",
      items: [
        "Keep data as long as necessary for services",
        "Delete data upon user request",
        "Anonymize data after retention period",
        "Comply with legal retention requirements"
      ]
    }
  ];

  const contactInfo = [
    { icon: Mail, text: "privacy@crimesafety.com" },
    { icon: Phone, text: "+1 (555) 123-4567" },
    { icon: MapPin, text: "123 Sector V, Kolkata, WB 700014" },
    { icon: Clock, text: "Monday - Friday: 9am - 6pm" },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-black via-red-950/10 to-black pt-28 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back to Home Button - Top Left */}
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
                <Shield className="w-7 h-7 text-red-400" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Privacy <span className="text-red-500">Policy</span>
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
              At CrimeSafety, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our platform. Please read this 
              privacy policy carefully. If you do not agree with the terms of this privacy policy, 
              please do not access the platform.
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

          {/* Contact Section */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-black/50 backdrop-blur-xl rounded-2xl border border-red-900/30 p-6 mt-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
                <Globe className="w-5 h-5 text-red-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Contact Us</h2>
            </div>
            <p className="text-gray-400 mb-4">
              If you have any questions about this Privacy Policy, please contact us:
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
            transition={{ delay: 0.6 }}
            className="text-center mt-8"
          >
            <p className="text-gray-500 text-xs">
              By using CrimeSafety, you agree to the collection and use of information in accordance with this policy.
            </p>
          </motion.div>
        </div>
      </div>
      <HoverFooter />
    </>
  );
}