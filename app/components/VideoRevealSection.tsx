"use client";
import Link from 'next/link';
import {
motion,
useScroll,
useTransform,
} from "framer-motion";

import {
Volume2,
VolumeX,
} from "lucide-react";

import {
useRef,
useState,
useEffect,
} from "react";

export default function VideoRevealSection() {
const containerRef = useRef<HTMLDivElement>(null);
const videoRef = useRef<HTMLVideoElement>(null);

const [isMuted, setIsMuted] = useState(true);
const [isInView, setIsInView] = useState(true);

const { scrollYProgress } = useScroll({
target: containerRef,
offset: ["start start", "end end"],
});

// VIDEO SCALE
const scale = useTransform(
scrollYProgress,
[0, 1],
[1.15, 0.88]
);

// BORDER RADIUS
const borderRadius = useTransform(
scrollYProgress,
[0, 1],
[0, 40]
);

// DARK OVERLAY
const overlayOpacity = useTransform(
scrollYProgress,
[0.55, 1],
[0, 0.7]
);

// CONTENT REVEAL
const heroOpacity = useTransform(
scrollYProgress,
[0.8, 1],
[0, 1]
);

const heroY = useTransform(
scrollYProgress,
[0.8, 1],
[100, 0]
);

// AUTO MUTE WHEN SECTION LEAVES
useEffect(() => {
const observer = new IntersectionObserver(
([entry]) => {
const visible = entry.isIntersecting;

    setIsInView(visible);

    if (!videoRef.current) return;

    if (visible) {
      videoRef.current.play();

      videoRef.current.muted = isMuted;
    } else {
      videoRef.current.muted = true;
    }
  },
  {
    threshold: 0.2,
  }
);

if (containerRef.current) {
  observer.observe(containerRef.current);
}

return () => observer.disconnect();


}, [isMuted]);

const toggleMute = () => {
if (!videoRef.current) return;

const newMuted = !isMuted;

setIsMuted(newMuted);

if (isInView) {
  videoRef.current.muted = newMuted;
}


};

return ( <section
   ref={containerRef}
   className="
     relative
     h-[250vh]
     bg-black
   "
 > <div
     className="
       sticky
       top-0
       h-screen
       overflow-hidden
     "
   >
<motion.div
style={{
scale,
borderRadius,
}}
className="
relative
w-full
h-full
overflow-hidden
"
>
{/* VIDEO */} <video
         ref={videoRef}
         autoPlay
         loop
         muted={isMuted}
         playsInline
         preload="auto"
         className="
           absolute
           inset-0
           w-full
           h-full
           object-cover
         "
       > <source
           src="/crimeguard-video.mp4"
           type="video/mp4"
         /> </video>

      {/* OVERLAY */}
      <motion.div
        style={{
          opacity: overlayOpacity,
        }}
        className="
          absolute
          inset-0
          bg-black
          z-10
        "
      />

      {/* SOUND BUTTON */}
      <button
        onClick={toggleMute}
        className="
          absolute
          top-8
          right-8
          z-50

          w-14
          h-14

          rounded-full
          bg-black/60
          backdrop-blur-xl

          border
          border-white/10

          flex
          items-center
          justify-center

          transition-all
          duration-300

          hover:border-red-500/50
          hover:bg-red-500/10
        "
      >
        {isMuted ? (
          <VolumeX
            className="
              w-6
              h-6
              text-white
            "
          />
        ) : (
          <Volume2
            className="
              w-6
              h-6
              text-red-500
            "
          />
        )}
      </button>

      {/* CONTENT */}
      <motion.div
        style={{
          opacity: heroOpacity,
          y: heroY,
        }}
        className="
          absolute
          inset-0

          flex
          flex-col

          items-center
          justify-center

          text-center

          z-20
        "
      >
        <h1
          className="
            text-5xl
            md:text-7xl
            lg:text-8xl
            font-bold
            text-white
          "
        >
          CrimeSafety
        </h1>

        <p
          className="
            mt-5
            text-lg
            md:text-xl
            text-gray-300
          "
        >
          Safe. Anonymous. Secure.
        </p>
<Link href="/register">
  <button
    className="
      mt-8
      px-8
      py-4
      rounded-full
      bg-red-600
      hover:bg-red-500
      transition-all
      duration-300
      text-white
      font-semibold
      cursor-pointer
    "
  >
    Sign Up
  </button>
</Link>
      </motion.div>
    </motion.div>
  </div>
</section>


);
}
