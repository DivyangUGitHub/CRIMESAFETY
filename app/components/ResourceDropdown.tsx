'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Bot,
  Info,
  Phone,
  HeartHandshake,
  CircleHelp,
  FileText,
  ScrollText,
} from "lucide-react";

const resources = [ 
  {
    title: "Dashboard",
    desc: "Detailed insights and overview.",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "CrimeSafety AI",
    desc: "Advanced AI legal assistant.",
    icon: Bot,
    href: "/ai-legal",
  },
  {
    title: "About",
    desc: "Learn about our platform.",
    icon: Info,
    href: "/about",
  },
  {
    title: "Contact Us",
    desc: "Reach our support team.",
    icon: Phone,
    href: "/contact",
  },
  // {
  //   title: "Be a Sponsor",
  //   desc: "Support platform development.",
  //   icon: HeartHandshake,
  //   href: "/sponsor",
  // },
  // {
  //   title: "FAQ",
  //   desc: "Frequently asked questions.",
  //   icon: CircleHelp,
  //   href: "/faq",
  // },
  {
    title: "Privacy Policy",
    desc: "How we handle your data.",
    icon: FileText,
    href: "/privacy",
  },
  {
    title: "Terms",
    desc: "Rules and regulations.",
    icon: ScrollText,
    href: "/terms",
  },
];

export default function ResourceDropdown() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.2 }}
      className="
      absolute
      top-12
      left-0
      w-[560px]
      rounded-xl
      border
      border-white/10
      bg-black/95
      backdrop-blur-xl
      p-4
      z-50
      shadow-2xl
      "
    >
      <div className="grid grid-cols-2 gap-4">

        {resources.map((item) => {
          const Icon = item.icon;

          return (
            <Link key={item.title} href={item.href}>
              <div
                className="
                h-full
                rounded-xl
                border
                border-white/10
                bg-white/[0.03]
                p-4
                hover:border-red-500/30
                hover:bg-red-500/5
                transition-all
                duration-300
                hover:-translate-y-1
                cursor-pointer
                "
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={18}
                    className="text-red-500"
                  />

                  <h3 className="font-semibold text-sm group-hover:text-red-400">
                    {item.title}
                  </h3>
                </div>

                <p className="text-gray-400 text-xs mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </Link>
          );
        })}

      </div>
    </motion.div>
  );
}