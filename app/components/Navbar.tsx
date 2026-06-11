// 'use client';

// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { Menu, X, Shield, ChevronDown } from 'lucide-react';

// const navItems = [
//   { name: 'Menu', href: '#' },
//   { name: 'Resources', href: '/resources' },
//   { name: 'Report Crime', href: '/reports/new' },
// ];

// export default function Navbar() {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 20);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   return (
//     <>
//       <motion.nav
//         initial={{ y: -100 }}
//         animate={{ y: 0 }}
//         transition={{ duration: 0.5 }}
//         className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//           isScrolled ? 'glass-card py-3 mx-4 mt-4' : 'bg-transparent py-6'
//         }`}
//         style={isScrolled ? { backdropFilter: 'blur(20px)' } : {}}
//       >
//         <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
//           {/* Logo */}
//           <Link href="/" className="flex items-center gap-2 group">
//             <motion.div
//               whileHover={{ rotate: 360 }}
//               transition={{ duration: 0.5 }}
//               className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center"
//             >
//               <Shield className="w-5 h-5 text-white" />
//             </motion.div>
//             <span className="text-xl font-bold">
//               Crime<span className="text-red-500">Guard</span>
//             </span>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center gap-8">
//             {navItems.map((item) => (
//               <Link
//                 key={item.name}
//                 href={item.href}
//                 className="text-gray-300 hover:text-white transition-colors duration-200"
//               >
//                 {item.name}
//               </Link>
//             ))}
//             <Link href="/resources" className="text-gray-300 hover:text-white flex items-center gap-1">
//               Resources <ChevronDown className="w-4 h-4" />
//             </Link>
//           </div>

//           {/* Auth Buttons */}
//           <div className="hidden md:flex items-center gap-4">
//             <Link href="/login">
//               <button className="text-white hover:text-red-400 transition">Sign In</button>
//             </Link>
//             <Link href="/register">
//               <button className="btn-primary">Get Started</button>
//             </Link>
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//             className="md:hidden text-white"
//           >
//             {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         {isMobileMenuOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             className="md:hidden glass-card mt-4 mx-4 p-6"
//           >
//             <div className="flex flex-col gap-4">
//               {navItems.map((item) => (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   className="text-gray-300 hover:text-white py-2"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                   {item.name}
//                 </Link>
//               ))}
//               <Link href="/resources" className="text-gray-300 hover:text-white py-2">
//                 Resources
//               </Link>
//               <div className="flex gap-4 pt-4 border-t border-white/10">
//                 <Link href="/login" className="flex-1">
//                   <button className="w-full btn-outline">Sign In</button>
//                 </Link>
//                 <Link href="/register" className="flex-1">
//                   <button className="w-full btn-primary">Get Started</button>
//                 </Link>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </motion.nav>
//       {/* Spacer */}
//     </>
//   );
// }

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import MenuDropdown from "./MenuDropdown";
import ResourceDropdown from "./ResourceDropdown";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  ChevronDown,
  FileText,
  LayoutDashboard,
  PlusCircle,
  LogOut,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [resourceOpen, setResourceOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    toast.success("Logged out successfully");
    router.push("/");
    setUserMenuOpen(false);
  };

  const getUserInitials = () => {
    if (session?.user?.name) {
      return session.user.name.charAt(0).toUpperCase();
    }
    if (session?.user?.email) {
      return session.user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <>
      {/* ✅ LOGO ADDED - Top Left Fixed */}
      <div className="fixed top-6 left-6 z-50">
        <Link href="/" className="flex items-center gap-2 group">
          <Shield className="text-red-500 w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
          <span className="font-bold text-xl text-white">
            Crime<span className="text-red-500">Safety</span>
          </span>
        </Link>
      </div>

      {/* Navbar - No changes, same as your code */}
      <nav className="fixed top-2 left-1/2 -translate-x-1/2 z-40">
        <div className="w-[650px] max-w-[95vw]">
          <div className="backdrop-blur-xl bg-black/70 border border-red-900/30 rounded-2xl h-16 px-8 flex items-center justify-between">
            {/* Center Menu */}
            <div className="hidden lg:flex items-center gap-10">
              <div
                className="relative"
                onMouseEnter={() => setMenuOpen(true)}
                onMouseLeave={() => setMenuOpen(false)}
              >
                <button className="flex items-center gap-2 text-gray-300 hover:text-white transition">
                  Menu
                  <motion.div
                    animate={{ rotate: menuOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {menuOpen && <MenuDropdown />}
                </AnimatePresence>
              </div>

              <div
                className="relative"
                onMouseEnter={() => setResourceOpen(true)}
                onMouseLeave={() => setResourceOpen(false)}
              >
                <button className="flex items-center gap-2 text-gray-300 hover:text-white transition">
                  Resources
                  <motion.div
                    animate={{ rotate: resourceOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {resourceOpen && <ResourceDropdown />}
                </AnimatePresence>
              </div>

              <Link
                href="/reports/new"
                className="flex items-center gap-2 text-gray-300 hover:text-red-500 transition"
              >
                Report Crime
                <PlusCircle size={16} />
              </Link>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {status === "loading" ? (
                <div className="w-9 h-9 rounded-full bg-white/10 animate-pulse"></div>
              ) : session ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="w-9 h-9 rounded-full bg-gradient-to-r from-red-500 to-red-700 flex items-center justify-center text-white font-semibold text-sm shadow-md hover:scale-105 transition"
                  >
                    {getUserInitials()}
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right- 0 mt-1 w-64 bg-black/95 backdrop-blur-xl rounded-xl border border-red-900/30 shadow-2xl overflow-hidden z-50"
                      >
                        <div className="p-5 border-b border-white/10 bg-gradient-to-r from-red-950/20 to-transparent">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-lg">
                              {getUserInitials()}
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-semibold text-base">{session.user?.name || "User"}</p>
                              <p className="text-gray-400 text-xs truncate">{session.user?.email}</p>
                            </div>
                          </div>
                        </div>

                        <div className="py-2">
                          <Link
                            href="/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-5 py-3 text-gray-300 hover:bg-white/10 hover:text-red-400 transition w-full text-sm"
                          >
                            <LayoutDashboard size={16} />
                            Dashboard
                          </Link>
                          <Link
                            href="/reports"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-5 py-3 text-gray-300 hover:bg-white/10 hover:text-red-400 transition w-full text-sm"
                          >
                            <FileText size={16} />
                            My Reports
                          </Link>
                        </div>

                        <div className="border-t border-white/10 my-1"></div>

                        <div className="py-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-5 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition w-full text-sm"
                          >
                            <LogOut size={16} />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/login">
                  <button className="bg-red-600 hover:bg-red-700 px-6 py-2.5 rounded-full font-semibold text-sm transition">
                    Sign In
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}