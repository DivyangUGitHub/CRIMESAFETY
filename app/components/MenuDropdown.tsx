"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield,
  FileText,
  Building2,
  Map,
} from "lucide-react";

export default function MenuDropdown() {
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
      <div className="grid grid-cols-[180px_1fr] gap-5">

        {/* Left Card */}
        <div
          className="
          rounded-xl
          bg-gradient-to-br
          from-red-900
          via-red-950
          to-black
          p-5
          flex
          flex-col
          justify-center
          "
        >
          <Link href="/">
            <Shield className="w-8 h-8 text-white mb-4" />

            <h2 className="text-2xl font-bold">
              CrimeSafety
            </h2>

            <p className="text-gray-400 text-sm mt-2 leading-relaxed">
              The best crime reporting platform for everyone.
            </p>
          </Link>
        </div>

{/* Right Side */}
<div className="flex flex-col gap-2">

  <Link href="/reports">
    <div
      className="
      group
      cursor-pointer
      rounded-xl
      border border-white/10
      bg-white/[0.03]
      hover:bg-red-500/5
      hover:border-red-500/30
      p-4
      transition-all
      duration-300
      "
    >
      <div className="flex items-center gap-3">
        <FileText size={18} className="text-pink-500" />

        <h3 className="font-semibold text-base group-hover:text-red-400">
          Crime Reports
        </h3>
      </div>

      <p className="text-gray-400 text-sm mt-2">
        Check latest crime reports in your area.
      </p>
    </div>
  </Link>

  <Link href="/police-stations">
    <div
      className="
      group
      cursor-pointer
      rounded-xl
      border border-white/10
      bg-white/[0.03]
      hover:bg-red-500/5
      hover:border-red-500/30
      p-4
      transition-all
      duration-300
      "
    >
      <div className="flex items-center gap-3">
        <Building2 size={18} className="text-blue-500" />

        <h3 className="font-semibold text-base group-hover:text-red-400">
          Police Stations
        </h3>
      </div>

      <p className="text-gray-400 text-sm mt-2">
        Find nearby police stations quickly.
      </p>
    </div>
  </Link>

  <Link href="/map">
    <div
      className="
      group
      cursor-pointer
      rounded-xl
      border border-white/10
      bg-white/[0.03]
      hover:bg-red-500/5
      hover:border-red-500/30
      p-4
      transition-all
      duration-300
      "
    >
      <div className="flex items-center gap-3">
        <Map size={18} className="text-green-500" />

        <h3 className="font-semibold text-base group-hover:text-red-400">
          Crime Map
        </h3>
      </div>

      <p className="text-gray-400 text-sm mt-2">
        View crimes happening around the globe.
      </p>
    </div>
  </Link>

</div>
      </div>
    </motion.div>
  );
}