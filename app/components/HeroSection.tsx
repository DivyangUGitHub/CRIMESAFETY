// 'use client';

// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { Shield, Zap, Lock, ArrowRight } from 'lucide-react';

// export default function HeroSection() {
//   return (
//     <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 grid-bg opacity-30" />
      
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 1 }}
//         className="absolute top-20 left-10 w-72 h-72 bg-red-500 rounded-full filter blur-[100px] opacity-20 animate-float"
//       />
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 1, delay: 0.3 }}
//         className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full filter blur-[120px] opacity-20 animate-float"
//         style={{ animationDelay: '2s' }}
//       />

//       <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//         >
//           <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-6">
//             <Shield className="w-4 h-4 text-red-500" />
//             <span className="text-sm text-gray-300">Fast, Easy, and Secured</span>
//           </div>
//         </motion.div>

//         <motion.h1
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.1 }}
//           className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
//         >
//           Report Crime,{' '}
//           <span className="gradient-text">Without Fear.</span>
//           <br />
//           Securely and Online.
//         </motion.h1>

//         <motion.p
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.2 }}
//           className="text-xl text-gray-400 max-w-2xl mx-auto mb-10"
//         >
//           Our secure platform allows you to report crimes anonymously and get real-time updates on your case. Report Crime, Create a Safer Tomorrow.
//         </motion.p>

//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.3 }}
//           className="flex flex-col sm:flex-row gap-4 justify-center"
//         >
//           <Link href="/reports/new">
//             <button className="btn-primary flex items-center gap-2 mx-auto sm:mx-0">
//               Report a Crime <ArrowRight className="w-4 h-4" />
//             </button>
//           </Link>
//           <Link href="/dashboard">
//             <button className="btn-outline">View Dashboard</button>
//           </Link>
//         </motion.div>

//         {/* Stats Row */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.4 }}
//           className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 pt-10 border-t border-white/10"
//         >
//           <div className="text-center">
//             <div className="flex items-center justify-center gap-2 mb-2">
//               <Zap className="w-5 h-5 text-yellow-500" />
//               <span className="text-3xl font-bold">17,500+</span>
//             </div>
//             <p className="text-gray-400">Crime reports filed on our platform</p>
//           </div>
//           <div className="text-center">
//             <div className="flex items-center justify-center gap-2 mb-2">
//               <Lock className="w-5 h-5 text-green-500" />
//               <span className="text-3xl font-bold">2,740+</span>
//             </div>
//             <p className="text-gray-400">Police stations connected worldwide</p>
//           </div>
//           <div className="text-center">
//             <div className="flex items-center justify-center gap-2 mb-2">
//               <Shield className="w-5 h-5 text-red-500" />
//               <span className="text-3xl font-bold">99.9%</span>
//             </div>
//             <p className="text-gray-400">Secure & anonymous reporting</p>
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   );
// }

'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import {
Shield,
ArrowRight,
Bot,
Lock,
MapPinned,
Activity,
Bell,
} from "lucide-react";
import {
  GlowingStarsBackgroundCard,
  GlowingStarsTitle,
  GlowingStarsDescription,
} from "@/app/components/ui/glowing-stars";

import Lightfall from "./Lightfall";

export default function HeroSection() {
return (<section className="relative min-h-screen overflow-hidden bg-black pt-32">

```
  {/* Lightfall Background */}
  <div className="absolute inset-0">

  <Lightfall
    colors={["#e40707","#850d0d","#000000"]}
    backgroundColor="#6f0606"
    speed={0.5}
    streakCount={2}
    streakWidth={1}
    streakLength={1}
    density={0.6}
    twinkle={1}
    glow={1}
    backgroundGlow={0.5}
    zoom={3}
    opacity={1}
    mouseInteraction
    mouseStrength={0.5}
    mouseRadius={1}
  />
</div>

  {/* Overlay */}
  <div className="absolute inset-0 bg-black/60 z-10" />

  {/* Hero Content */}
  <div className="relative z-10 max-w-7xl mx-auto px-6 pt-0">

   <div className="flex justify-center items-center min-h-screen">

<div className="fixed top-6 left-10 z-50">
  {/* <Link href="/" className="flex items-center gap-3">
    <Shield className="text-red-500 w-6 h-6" />

    <span className="font-bold text-2xl text-white">
      Crime<span className="text-red-500">Saftey</span>
    </span>
  </Link> */}
</div>

      {/* Left Side */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center text-center w-full"
      >

        {/* Badge */}
<div className="mb-6">
  <div className="inline-flex items-center gap-2 border border-red-500/30 bg-red-500/10 backdrop-blur-xl px-4 py-2 rounded-full">

    <Shield className="w-4 h-4 text-red-500" />

    <span className="text-red-300 text-sm font-medium">
      AI Powered Crime Reporting Platform
    </span>

  </div>
</div>

{/* Heading */}
<div className="mb-6 ">
<h1 className="playfair text-3xl md:text-4xl lg:text-5xl font-black leading-tight">
  Report Crime,Without Fear.
</h1>
</div>

<div className="mb-6">
  <div className="playfair text-3xl md:text-4xl lg:text-5xl font-black leading-tight ">

    <span className="block text-red-500">
    Securely and Online.
  </span>
  </div>
</div>

        <p className="Pirata One mt-6 text-gray-400 text-lg md:text-xl max-w-2xl">

          Anonymous crime reporting,
          AI-powered verification,
          live crime tracking maps,
          secure evidence uploads,
          and real-time case updates.

        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-10">

          <Link href="/reports/new">

            <button
              className="
              bg-red-600
              hover:bg-red-700
              transition
              px-5
              py-2.5
              rounded-xl
              font-semibold
              flex
              items-center
              gap-2
              mt-2
              "
            >
              Report Crime

              <ArrowRight className="w-5 h-5" />

            </button>

          </Link>

          <Link href="/dashboard">

            <button
              className="
              border
              border-white/20
              bg-white/5
              hover:bg-white/10
              backdrop-blur-xl
              px-5
              py-2.5
              rounded-xl
              mt-2
              "
            >
              View Dashboard
            </button>

          </Link>

        </div>

        {/* Stats */}
{/* Premium Stats Section */}
<div className="mt-10 flex items-center justify-center gap-5 flex-wrap">

  {/* LEFT CARD */}
<motion.div
  whileHover={{
    scale: 1.03,
  }}
>
  <GlowingStarsBackgroundCard
  className="
  w-[220px]
  h-[220px]
  bg-black/90
  border border-red-500/10
  backdrop-blur-xl
  "
>

    <div className="flex flex-col justify-end h-full">

      <GlowingStarsTitle className="text-4xl font-bold">
        17,500+
      </GlowingStarsTitle>

      <GlowingStarsDescription className="mt-3">
        Crime reports filed on our platform.
      </GlowingStarsDescription>

    </div>

  </GlowingStarsBackgroundCard>
</motion.div>

  {/* CENTER CARD */}
  <div
    className="
    w-[520px]
    h-[180px]
   mt-4
    rounded-2xl
    border border-white/10
    bg-black/60
    backdrop-blur-xl
    px-8
    flex
    items-center
    justify-around
    shadow-lg
    "
  >

    {/* ALERTS */}
    <div className="group text-center cursor-pointer">
      <Bell
        className="
        mx-auto
        w-8
        h-8
        text-white
        mb-3
        transition-all
        duration-300
        group-hover:text-red-500
        "
      />

      <h3 className="text-2xl font-bold">
        Alerts
      </h3>

      <p className="text-gray-400 text-sm mt-2 max-w-[120px]">
        Stay informed with real-time alerts.
      </p>
    </div>

    <div className="w-px h-24 bg-white/10" />

    {/* MAPS */}
    <div className="group text-center cursor-pointer">
      <MapPinned
        className="
        mx-auto
        w-8
        h-8
        text-white
        mb-3
        transition-all
        duration-300
        group-hover:text-red-500
        "
      />

      <h3 className="text-2xl font-bold">
        Maps
      </h3>

      <p className="text-gray-400 text-sm mt-2 max-w-[120px]">
        Navigate with our advanced maps.
      </p>
    </div>

    <div className="w-px h-24 bg-white/10" />

    {/* TRUSTED */}
    <div className="group text-center cursor-pointer">
      <Shield
        className="
        mx-auto
        w-8
        h-8
        text-white
        mb-3
        transition-all
        duration-300
        group-hover:text-red-500
        "
      />

      <h3 className="text-2xl font-bold">
        Trusted
      </h3>

      <p className="text-gray-400 text-sm mt-2 max-w-[120px]">
        Trusted by government worldwide.
      </p>
    </div>

  </div>

  {/* RIGHT CARD */}
<motion.div whileHover={{ y: -5 }}>
  <GlowingStarsBackgroundCard
  className="
  w-[220px]
  h-[220px]
  bg-black/90
  border border-red-500/10
  backdrop-blur-xl
  "
>

    <div className="flex flex-col justify-end h-full">

      <GlowingStarsTitle className="text-4xl font-bold">
        17,500+
      </GlowingStarsTitle>

      <GlowingStarsDescription className="mt-3">
        Police stations connected to our platform.
      </GlowingStarsDescription>

    </div>

  </GlowingStarsBackgroundCard>
</motion.div>

</div>

      </motion.div>

    </div>

  </div>

</section>

);
}
