// "use client";

// import { motion } from "framer-motion";
// import { useInView } from "react-intersection-observer";
// import {
//   Fingerprint,
//   Shield,
//   BadgeAlert,
// } from "lucide-react";

// const promises = [
//   {
//     icon: Fingerprint,
//     title: "Anonymous",
//     description:
//       "Your identity remains completely protected while reporting incidents securely.",
//   },
//   {
//     icon: Shield,
//     title: "Secure",
//     description:
//       "Advanced encryption protects your reports and personal information.",
//   },
//   {
//     icon: BadgeAlert,
//     title: "Trusted",
//     description:
//       "Verified reports are delivered to the appropriate authorities quickly.",
//   },
// ];

// export default function PromiseSection() {
//   const [ref, inView] = useInView({
//     triggerOnce: true,
//     threshold: 0.1,
//   });

//   return (
//     <section className="relative bg-black py-24 overflow-hidden">
      
//       {/* Red Glow Background */}
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.08),transparent_70%)]" />

//       <div className="max-w-6xl mx-auto px-6 relative z-10">

//         {/* Heading */}
//         <motion.div
//           ref={ref}
//           initial={{ opacity: 0, y: 30 }}
//           animate={inView ? { opacity: 1, y: 0 } : {}}
//           transition={{ duration: 0.7 }}
//           className="text-center mb-20"
//         >
//           <h2
//             className="
//               text-5xl
//               md:text-6xl
//               font-bold
//               bg-gradient-to-b
//               from-white
//               to-white/30
//               bg-clip-text
//               text-transparent
//             "
//           >
//             Our Promise
//           </h2>
//         </motion.div>

//         {/* Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3">

//           {promises.map((item, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 40 }}
//               animate={inView ? { opacity: 1, y: 0 } : {}}
//               transition={{
//                 duration: 0.6,
//                 delay: index * 0.15,
//               }}
//               whileHover={{
//                 y: -10,
//               }}
//               className="
//                 relative
//                 h-[450px]
//                 border
//                 border-white/10
//                 flex
//                 flex-col
//                 items-center
//                 justify-center
//                 text-center
//                 bg-black
//                 overflow-hidden
//                 group
//                 hover:border-red-500/30
//                 transition-all
//                 duration-500
//               "
//             >

//               {/* Corner Marks */}
//               <span className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 text-white text-2xl">
//                 +
//               </span>

//               <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 text-white text-2xl">
//                 +
//               </span>

//               <span className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 text-white text-2xl">
//                 +
//               </span>

//               <span className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 text-white text-2xl">
//                 +
//               </span>

//               {/* Hover Glow */}
//               <div
//                 className="
//                   absolute
//                   inset-0
//                   opacity-0
//                   group-hover:opacity-100
//                   transition-all
//                   duration-500
//                   bg-red-500/5
//                 "
//               />

//               {/* Icon */}
//               <item.icon
//                 className="
//                   w-16
//                   h-16
//                   text-white/80
//                   group-hover:text-red-500
//                   transition-all
//                   duration-300
//                 "
//               />

//               {/* Title */}
//               <h3
//                 className="
//                   mt-10
//                   text-3xl
//                   font-semibold
//                   text-white
//                   group-hover:text-red-500
//                   transition-all
//                   duration-300
//                 "
//               >
//                 {item.title}
//               </h3>

//               {/* Description */}
//               <p
//                 className="
//                   mt-5
//                   px-10
//                   text-gray-400
//                   leading-relaxed
//                 "
//               >
//                 {item.description}
//               </p>

//             </motion.div>
//           ))}

//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { CanvasRevealEffect } from "./canvas-reveal-effect";
import {
  Shield,
  Fingerprint,
  BadgeAlert,
} from "lucide-react";

export default function PromiseSection() {
  return (
    <section className="bg-black py-24">

      <div className="max-w-7xl mx-auto px-6">
<h2
  className="
    text-center
    text-5xl
    md:text-6xl
    lg:text-7xl
    font-bold
    tracking-tight
    mb-16

    bg-gradient-to-b
    from-white
    via-gray-300
    to-gray-800

    bg-clip-text
    text-transparent

    drop-shadow-[0_4px_12px_rgba(255,255,255,0.08)]
    
  "
>
  Our Promise
</h2>

        <div className="grid md:grid-cols-3 gap-4">

          {/* Card 1 */}
          <Card
            title="Anonymous"
            icon={<Fingerprint className="w-12 h-12" />}
          >
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-black"
              colors={[[255, 0, 0]]}
            />
          </Card>

          {/* Card 2 */}
          <Card
            title="Secure"
            icon={<Shield className="w-12 h-12" />}
          >
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-black"
              colors={[[0, 120, 255]]}
            />
          </Card>

          {/* Card 3 */}
          <Card
            title="Trusted"
            icon={<BadgeAlert className="w-12 h-12" />}
          >
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-black"
              colors={[[0, 255, 100]]}
            />
          </Card>

        </div>

      </div>
    </section>
  );
}

function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        relative
        h-[450px]
        border
        border-white/10
        overflow-visible
        group
        flex
        items-center
        justify-center
      "
    >
      {/* Corner Marks */}

{/* Top Left */}
<div className="absolute top-0 left-0 z-50">
  <span className="absolute -top-[12px] -left-[7px] text-white text-2xl leading-none">
    +
  </span>
</div>

{/* Top Right */}
<div className="absolute top-0 right-0 z-50">
  <span className="absolute -top-[12px] -right-[7px] text-white text-2xl leading-none">
    +
  </span>
</div>

{/* Bottom Left */}
<div className="absolute bottom-0 left-0 z-50">
  <span className="absolute -bottom-[12px] -left-[7px] text-white text-2xl leading-none">
    +
  </span>
</div>

{/* Bottom Right */}
<div className="absolute bottom-0 right-0 z-50">
  <span className="absolute -bottom-[12px] -right-[7px] text-white text-2xl leading-none">
    +
  </span>
</div>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
        {children}
      </div>

      <div
        className="
          relative
          z-20
          flex
          flex-col
          items-center
          text-white
        "
      >
        {icon}

        <h3 className="mt-8 text-3xl font-semibold">
          {title}
        </h3>
      </div>
    </div>
  );
}