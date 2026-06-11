// 'use client';

// import Link from 'next/link';
// import { motion } from 'framer-motion';
// import { useInView } from 'react-intersection-observer';
// import { Shield, Map, MessageCircle, TrendingUp, Bell, Lock } from 'lucide-react';

// export default function Home() {
//   const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

//   const features = [
//     { icon: Shield, title: 'AI Verification', desc: 'Advanced AI analyzes and verifies crime reports with 95% accuracy', color: 'from-red-500 to-pink-500' },
//     { icon: Map, title: 'Live Crime Maps', desc: 'Real-time crime mapping with severity indicators and heat maps', color: 'from-blue-500 to-cyan-500' },
//     { icon: MessageCircle, title: '24/7 AI Assistant', desc: 'Instant chatbot support for reporting guidance and safety tips', color: 'from-green-500 to-emerald-500' },
//     { icon: TrendingUp, title: 'Crime Analytics', desc: 'Detailed statistics and trends analysis for your area', color: 'from-purple-500 to-indigo-500' },
//     { icon: Bell, title: 'Instant Alerts', desc: 'Get notified about crimes and safety alerts in your neighborhood', color: 'from-yellow-500 to-orange-500' },
//     { icon: Lock, title: 'Anonymous Reporting', desc: 'Report crimes safely without revealing your identity', color: 'from-teal-500 to-cyan-500' },
//   ];

//   const stats = [
//     { label: 'Reports Filed', value: '10K+', icon: '📊' },
//     { label: 'AI Verified', value: '92%', icon: '🤖' },
//     { label: 'Response Time', value: '<5min', icon: '⚡' },
//     { label: 'Cities Covered', value: '50+', icon: '🌍' },
//   ];

//   return (
//     <div className="relative overflow-hidden">
//       {/* Hero Section */}
//       <section className="relative min-h-screen flex items-center justify-center px-4">
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="text-center z-10"
//         >
//           <motion.div
//             animate={{ rotate: 360 }}
//             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
//             className="absolute top-20 left-1/4 w-64 h-64 bg-red-500 rounded-full filter blur-3xl opacity-20"
//           />
          
//           <motion.h1 
//             className="text-6xl md:text-8xl font-bold mb-6 gradient-text"
//             animate={{ scale: [1, 1.05, 1] }}
//             transition={{ duration: 2, repeat: Infinity }}
//           >
//             CrimeSafety
//           </motion.h1>
          
//           <motion.p 
//             className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.3 }}
//           >
//             Report crimes safely, track incidents in real-time, 
//             and stay informed with AI-powered insights
//           </motion.p>
          
//           <motion.div 
//             className="flex gap-4 justify-center flex-wrap"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5 }}
//           >
//             <Link href="/reports/new">
//               <motion.button 
//                 className="glass px-8 py-3 rounded-full text-white font-semibold relative overflow-hidden group"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <span className="relative z-10">Report a Crime</span>
//                 <motion.div 
//                   className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700"
//                   initial={{ x: '100%' }}
//                   whileHover={{ x: 0 }}
//                   transition={{ duration: 0.3 }}
//                 />
//               </motion.button>
//             </Link>
            
//             <Link href="/dashboard">
//               <motion.button 
//                 className="glass px-8 py-3 rounded-full text-white font-semibold"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 View Dashboard
//               </motion.button>
//             </Link>
//           </motion.div>
//         </motion.div>
        
//         <motion.div
//           className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
//           animate={{ y: [0, 10, 0] }}
//           transition={{ duration: 2, repeat: Infinity }}
//         >
//           <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
//             <div className="w-1 h-2 bg-white rounded-full mt-2 animate-bounce" />
//           </div>
//         </motion.div>
//       </section>

//       {/* Stats Section */}
//       <section className="py-20 px-4">
//         <div className="max-w-7xl mx-auto">
//           <motion.h2 
//             className="text-4xl md:text-5xl font-bold text-center mb-12 gradient-text"
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//           >
//             Platform Impact
//           </motion.h2>
          
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//             {stats.map((stat, index) => (
//               <motion.div
//                 key={index}
//                 className="glass-card p-6 text-center"
//                 initial={{ opacity: 0, scale: 0 }}
//                 whileInView={{ opacity: 1, scale: 1 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.1 }}
//                 whileHover={{ scale: 1.05 }}
//               >
//                 <div className="text-5xl mb-4">{stat.icon}</div>
//                 <motion.div 
//                   className="text-3xl font-bold text-white mb-2"
//                   animate={{ 
//                     textShadow: ['0 0 0px rgba(239,68,68,0)', '0 0 10px rgba(239,68,68,0.5)', '0 0 0px rgba(239,68,68,0)']
//                   }}
//                   transition={{ duration: 2, repeat: Infinity }}
//                 >
//                   {stat.value}
//                 </motion.div>
//                 <div className="text-gray-400">{stat.label}</div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Features Grid */}
//       <section ref={ref} className="py-20 px-4">
//         <div className="max-w-7xl mx-auto">
//           <motion.h2 
//             className="text-4xl md:text-5xl font-bold text-center mb-12 gradient-text"
//             initial={{ opacity: 0, y: 20 }}
//             animate={inView ? { opacity: 1, y: 0 } : {}}
//           >
//             Powerful Features
//           </motion.h2>
          
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {features.map((feature, index) => (
//               <motion.div
//                 key={index}
//                 className="glass-card p-6 cursor-pointer"
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={inView ? { opacity: 1, y: 0 } : {}}
//                 transition={{ delay: index * 0.1 }}
//                 whileHover={{ 
//                   scale: 1.05,
//                   transition: { duration: 0.2 }
//                 }}
//               >
//                 <motion.div 
//                   className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}
//                   whileHover={{ rotate: 360 }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   <feature.icon className="w-8 h-8 text-white" />
//                 </motion.div>
//                 <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
//                 <p className="text-gray-400">{feature.desc}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-20 px-4">
//         <motion.div 
//           className="max-w-4xl mx-auto glass-card p-12 text-center"
//           initial={{ opacity: 0, scale: 0.9 }}
//           whileInView={{ opacity: 1, scale: 1 }}
//           viewport={{ once: true }}
//         >
//           <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Make Your Community Safer?</h2>
//           <p className="text-gray-300 mb-8">Join thousands of users already using CrimeSafety to report and track incidents</p>
//           <Link href="/register">
//             <motion.button 
//               className="glass px-8 py-3 rounded-full text-white font-semibold"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               Get Started Now
//             </motion.button>
//           </Link>
//         </motion.div>
//       </section>
//     </div>
//   );
// }

'use client';

import { useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import DashboardPreview from './components/DashboardPreview';
import StatsSection from './components/StatsSection';
// import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import HoverFooter from "./components/hover-footer";
import VideoRevealSection from './components/VideoRevealSection';
export default function Home() {
  useEffect(() => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href')!);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }, []);

  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <DashboardPreview />
      <StatsSection />
      <VideoRevealSection />
       {/* <Footer /> */}
      <HoverFooter />
      <Chatbot />
    </main>
  );
}