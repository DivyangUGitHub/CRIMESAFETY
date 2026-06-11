"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield,
  Github,
  Twitter,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { cn } from "./lib/utils";

const footerLinks = {
  Connect: [
    { name: "Dashboard", href: "/dashboard" },
    // { name: "Book Meeting", href: "/book-meeting" },
    { name: "Contact Us", href: "/contact" },
  ],
  Resources: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "FAQ", href: "/faq" },
  ],
};

/* =========================
   HOVER TEXT EFFECT
========================= */

const TextHoverEffect = ({
  text,
  duration = 0.4,
  className,
}: {
  text: string;
  duration?: number;
  className?: string;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const [cursor, setCursor] = useState({
    x: 0,
    y: 0,
  });

  const [hovered, setHovered] = useState(false);

  const [maskPosition, setMaskPosition] = useState({
    cx: "50%",
    cy: "50%",
  });

  useEffect(() => {
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();

    setMaskPosition({
      cx: `${((cursor.x - rect.left) / rect.width) * 100}%`,
      cy: `${((cursor.y - rect.top) / rect.height) * 100}%`,
    });
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) =>
        setCursor({
          x: e.clientX,
          y: e.clientY,
        })
      }
      className={cn("cursor-pointer select-none", className)}
    >
      <defs>
        <linearGradient id="textGradient">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="30%" stopColor="#f97316" />
          <stop offset="60%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="20%"
          initial={{
            cx: "50%",
            cy: "50%",
          }}
          animate={maskPosition}
          transition={{
            duration,
          }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>

        <mask id="textMask">
          <rect
            width="100%"
            height="100%"
            fill="url(#revealMask)"
          />
        </mask>
      </defs>

      {/* Background Text */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="
          fill-transparent
          stroke-neutral-700
          text-7xl
          font-bold
        "
        style={{
          opacity: hovered ? 0.4 : 0.15,
        }}
      >
        {text}
      </text>

      {/* Animated Stroke */}
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="#ef4444"
        strokeWidth="0.3"
        className="
          fill-transparent
          text-7xl
          font-bold
        "
        initial={{
          strokeDasharray: 1000,
          strokeDashoffset: 1000,
        }}
        animate={{
          strokeDashoffset: 0,
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.text>

      {/* Hover Reveal */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth="0.3"
        mask="url(#textMask)"
        className="
          fill-transparent
          text-7xl
          font-bold
        "
      >
        {text}
      </text>
    </svg>
  );
};

/* =========================
   MAIN FOOTER - Uppar Section Jaisa Background
========================= */

export default function HoverFooter() {
  return (
    <footer className="relative bg-black/80 border-t border-red-900/30">
      <div className="relative z-10">
        {/* Hover Text Section - NO BORDER (middle line hatadi) */}
        <div className="h-[210px] md:h-[260px] flex items-center justify-center">
          <TextHoverEffect
            text="CrimeSafety"
            duration={0.4}
            className="w-full h-full"
          />
        </div>

        {/* Footer Content - SAME AS BEFORE */}
        <div className="max-w-7xl mx-auto px-6 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Logo */}
            <div>
              <Link
                href="/"
                className="flex items-center gap-3 mb-4"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>

                <span className="text-2xl font-bold text-white">
                  Crime
                  <span className="text-red-500">Safety</span>
                </span>
              </Link>

              <p className="quicksand text-gray-400 text-sm leading-relaxed mb-5">
                Secure and fast way to report crimes anonymously.
                Making communities safer together.
              </p>

              <div className="flex gap-4">
                <a
                  href="https://github.com/DivyangUGitHub?tab=overview&from=2026-06-01&to=2026-06-11"
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  <Github size={20} />
                </a>

                <a
                  href="https://x.com/Divyang_Upreti_"
                  className="text-gray-400 hover:text-blue-500 transition"
                >
                  <Twitter size={20} />
                </a>

                <a
                  href="https://www.linkedin.com/in/divyang-upreti/"
                  className="text-gray-400 hover:text-blue-400 transition"
                >
                  <Linkedin size={20} />
                </a>
              </div>
            </div>

            <div className="flex gap-10 translate-x-[600px]">
              {/* Use Cases */}
              <div>
                <h3 className="font-semibold text-white mb-6 text-sm">
                  Use Cases
                </h3>

                <ul className="space-y-5">
                  <li>
                    <Link href="/dashboard" className="text-gray-400 hover:text-red-400 text-sm transition">
                      Dashboard
                    </Link>
                  </li>

                  <li>
                    <Link href="/reports/new" className="text-gray-400 hover:text-red-400 text-sm transition">
                      Add Crime
                    </Link>
                  </li>

                  <li>
                    <Link href="/map" className="text-gray-400 hover:text-red-400 text-sm transition">
                      Crimes Map
                    </Link>
                  </li>

                  <li>
                    <Link href="/ai-legal" className="text-gray-400 hover:text-red-400 text-sm transition">
                      AI Bot
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Connect */}
              <div>
                <h3 className="font-semibold text-white mb-6 text-sm">
                  Connect
                </h3>

                <ul className="space-y-5">
                  <li>
                    {/* <Link href="/book-meeting" className="text-gray-400 hover:text-red-400 text-sm transition">
                      Book Meeting
                    </Link> */}
                  </li>

                  <li>
                    <Link href="/contact" className="text-gray-400 hover:text-red-400 text-sm transition">
                      Contact Us
                    </Link>
                  </li>

                  <li>
                    <Link href="/privacy" className="text-gray-400 hover:text-red-400 text-sm transition">
                      Privacy Policy
                    </Link>
                  </li>

                  <li>
                    <Link href="/terms" className="text-gray-400 hover:text-red-400 text-sm transition">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div
            className="
              mt-10
              pt-6
              border-t border-red-500/30
              flex
              flex-col
              md:flex-row
              items-center
              justify-between
              gap-4
            "
          >
            <p className="text-gray-500 text-sm">
              Made with ❤️ by
              <span className="text-red-400 ml-1">
                Divyang Upreti
              </span>
            </p>

            <p className="text-gray-500 text-sm">
              © 2026 CrimeSafety. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}