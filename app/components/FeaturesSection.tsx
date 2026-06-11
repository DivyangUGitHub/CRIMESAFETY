"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import {
  Shield,
  Brain,
  LayoutDashboard,
  FileText,
  MapPin,
  Map,
  Bell,
  EyeOff,
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "AI Crime Detection",
    description:
      "Advanced AI analyzes reports, images, and evidence to identify suspicious activities and fake reports.",
  },
  {
    icon: Brain,
    title: "Smart AI Assistant",
    description:
      "Provides instant guidance, legal information, and report assistance through intelligent conversations.",
  },
  {
    icon: LayoutDashboard,
    title: "Crime Dashboard",
    description:
      "Monitor reports, analytics, crime trends, and system activities through a powerful dashboard.",
  },
  {
    icon: FileText,
    title: "Digital FIR Reports",
    description:
      "Create, manage, track, and securely store crime reports with real-time status updates.",
  },
  {
    icon: MapPin,
    title: "Nearby Police Stations",
    description:
      "Locate nearby police stations instantly and connect with emergency services when required.",
  },
  {
    icon: Map,
    title: "Live Crime Map",
    description:
      "Visualize crime hotspots and incidents through interactive geolocation maps.",
  },
  {
    icon: Bell,
    title: "Real-Time Alerts",
    description:
      "Receive instant notifications regarding investigations, emergencies, and report updates.",
  },
  {
    icon: EyeOff,
    title: "Anonymous Reporting",
    description:
      "Submit reports anonymously while protecting user privacy and identity.",
  },
];

export default function FeaturesSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
   <section
  className="
    relative
    py-16
    md:py-20
    bg-black
    overflow-hidden
  "
>
      {/* Background Glow */}

      <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
        {/* Heading */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <h2
            className="
              text-5xl
              md:text-6xl
              lg:text-7xl
              font-bold
              text-white
              tracking-tight
            "
          >
            Features
          </h2>

          <div
            className="
              w-40
              h-[2px]
              mx-auto
              mt-6
              bg-gradient-to-r
              from-transparent
              via-red-500
              to-transparent
            "
          />
        </motion.div>

        {/* Feature Grid */}
        <div
          className="
            border
            border-white/10
            rounded-none
            overflow-hidden
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-4
          "
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{
                opacity: 0,
                y: 40,
              }}
              animate={
                inView
                  ? {
                      opacity: 1,
                      y: 0,
                    }
                  : {}
              }
              transition={{
                duration: 0.6,
                delay: index * 0.08,
              }}
              whileHover={{
                y: -4,
              }}
              className="
                relative
                min-h-[200px]
p-4
lg:p-5
                bg-black
                border-r
                border-b
                border-white/10
                group
                cursor-pointer
                overflow-hidden
              "
            >
              {/* Hover Glow */}
              <div
                className="
                  absolute
                  inset-0
                  opacity-0
                  group-hover:opacity-100
                  transition-all
                  duration-500
                  bg-gradient-to-br
                  from-white/[0.08]
                  via-white/[0.03]
                  to-transparent
                "
              />

              {/* Red Side Indicator */}
              <div
                className="
                  absolute
                  left-0
                  top-1/2
                  -translate-y-1/2
                  w-[5px]
                  h-16
                  rounded-full
                  bg-red-500
                  opacity-0
                  group-hover:opacity-100
                  transition-all
                  duration-300
                "
              />

              {/* Soft Blur */}
              <div
                className="
                  absolute
                  inset-0
                  opacity-0
                  group-hover:opacity-100
                  transition-all
                  duration-700
                  bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_70%)]
                "
              />

              {/* Icon */}
              <div className="relative z-10 mb-4">
           <feature.icon
  className="
    w-7
    h-7
    text-white/60
    group-hover:text-red-500
    transition-all
    duration-300
  "
/>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3
                  className="
text-lg
lg:text-xl
                    font-bold
                    text-white
                    mb-5
                  "
                >
                  {feature.title}
                </h3>

                <p
                  className="
                    text-gray-400
text-xs
lg:text-sm
                    leading-relaxed
                  "
                >
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}