'use client';

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import ParticlesBackground from "./ParticlesBackground";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      <ParticlesBackground />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "rgba(0,0,0,0.8)",
            color: "#fff",
          },
        }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}