"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import {
  Activity,
  Brain,
  Bell,
  BarChart3,
  Shield,
} from "lucide-react";

const dashboardFeatures = [
  {
    icon: Activity,
    title: "Live Crime Monitoring",
    description:
      "Track incidents, emergency alerts and active investigations in real time.",
  },
  {
    icon: Brain,
    title: "AI Crime Intelligence",
    description:
      "AI detects suspicious patterns and verifies reports automatically.",
  },
  {
    icon: Bell,
    title: "Instant Notifications",
    description:
      "Receive updates whenever case status changes.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Visual reports, crime trends and performance insights.",
  },
];

export default function DashboardPreview() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="relative py-28 overflow-hidden bg-black">
      {/* Red Glow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-red-600/10 blur-[180px] rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Heading */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
<Link
  href="/dashboard"
  className="
    inline-flex
    bg-gradient-to-r
    from-black
    via-red-950/50
    to-red-900/30
    border
    border-red-500/30
    rounded-full
    px-6
    py-2
    mb-8
    hover:border-red-500/60
    hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]
    hover:scale-105
    transition-all
    duration-300
    cursor-pointer
    group
  "
>
  <span className="text-white font-medium group-hover:text-red-400 transition">
    Dashboard
  </span>
</Link>

          <h2
            className="
            text-5xl
            md:text-7xl
            font-bold
            text-transparent
            bg-gradient-to-b
            from-white
            to-white/20
            bg-clip-text
            leading-tight
          "
          >
            In-Depth Analytics
            <br />
            & Reports
          </h2>

          <p className="text-xl text-gray-400 max-w-4xl mx-auto mt-8">
            Overview of your reports, analytics and real-time
            updates on your personalized dashboard.
          </p>
        </motion.div>

        {/* Main Layout */}
       <div className="grid lg:grid-cols-[0.75fr_1.3fr] gap-14 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-5"
          >
            {dashboardFeatures.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{
                  x: 10,
                  scale: 1.02,
                }}
                className="
                  group
                  border
                  border-white/10
                  hover:border-red-500/40
                  rounded-3xl
                  p-3
                  bg-black/40
                  backdrop-blur-xl
                  transition-all
                  duration-300
                "
              >
                <div className="flex gap-3">
                  <div
                    className="
                    w-9
                    h-9
                    rounded-xl
                    bg-red-500/10
                    flex
                    items-center
                    justify-center
                    flex-shrink-0
                  "
                  >
                    <item.icon
                      className="
                      w-5
                      h-5
                      text-white/70
                      group-hover:text-red-500
                      transition-all
                    "
                    />
                  </div>

                  <div>
                    <h3
                      className="
                      text-xl
                      font-semibold
                      mb-1
                      group-hover:text-red-500
                      transition-all
                    "
                    >
                      {item.title}
                    </h3>

                    <p className="text-gray-400">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 mt-6">
              <div className="border border-white/10 rounded-2xl p-4">
                <p className="text-gray-400 text-sm">
                  Reports Analyzed
                </p>
                <h3 className="text-3xl font-bold mt-1">
                  12.4K
                </h3>
              </div>

              <div className="border border-white/10 rounded-2xl p-4">
                <p className="text-gray-400 text-sm">
                  AI Accuracy
                </p>
                <h3 className="text-3xl font-bold text-red-500 mt-1">
                  98%
                </h3>
              </div>
            </div>
          </motion.div>

          {/* Right Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div
              className="
              absolute
              -inset-6
              bg-red-500/10
              blur-3xl
              rounded-full
            "
            />

            <div
              className="
              relative
              border
              border-white/10
              rounded-[32px]
              overflow-hidden
              bg-black
            "
            >
              <Image
                src="/dashboard-preview.png"
                alt="Dashboard"
                width={1400}
                height={900}
                className="
                  w-full
                  h-auto
                  object-cover
                "
              />
            </div>

            {/* Floating Badge */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
              className="
                absolute
                -top-5
                -left-5
                border
                border-white/10
                bg-black/80
                backdrop-blur-xl
                rounded-2xl
                p-4
              "
            >
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-sm text-gray-400">
                    Security Score
                  </p>
                  <p className="font-bold">
                    99.8%
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Floating AI Badge */}
            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
              className="
                absolute
                bottom-6
                right-6
                border
                border-white/10
                bg-black/80
                backdrop-blur-xl
                rounded-2xl
                p-4
              "
            >
              <div className="flex items-center gap-3">
                <Brain className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-sm text-gray-400">
                    AI Detection
                  </p>
                  <p className="font-bold">
                    Active
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}