"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Navbar from "../components/Navbar";
import HoverFooter from "../components/hover-footer";
import { ChevronDown, Loader2 } from "lucide-react";

// ✅ Dynamic import for CrimeMap to avoid SSR issues
const CrimeMap = dynamic(() => import("../components/CrimeMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] bg-black/50 rounded-xl animate-pulse flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-gray-500 text-sm">Loading map...</p>
      </div>
    </div>
  ),
});

const crimeData = [
  {
    id: "1",
    title: "Armed Robbery",
    description: "Reported armed robbery near Connaught Place.",
    latitude: 28.6139,
    longitude: 77.209,
    severity: "CRITICAL",
    status: "INVESTIGATING",
    date: "2026-06-10",
    category: "Robbery",
  },
  {
    id: "2",
    title: "Vehicle Theft",
    description: "Bike theft reported in Mumbai.",
    latitude: 19.076,
    longitude: 72.8777,
    severity: "HIGH",
    status: "OPEN",
    date: "2026-06-08",
    category: "Theft",
  },
  {
    id: "3",
    title: "Cyber Fraud",
    description: "Online fraud complaint registered.",
    latitude: 12.9716,
    longitude: 77.5946,
    severity: "MEDIUM",
    status: "INVESTIGATING",
    date: "2026-06-09",
    category: "Cyber Crime",
  },
  {
    id: "4",
    title: "Street Fight",
    description: "Public disturbance reported.",
    latitude: 22.5726,
    longitude: 88.3639,
    severity: "LOW",
    status: "RESOLVED",
    date: "2026-06-07",
    category: "Violence",
  },
];

export default function CrimeMapPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [loading, setLoading] = useState(true);

  // ✅ Auth Check - Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      setLoading(false);
    }
  }, [status, router]);

  // Filter crimes based on selection
  const filteredCrimes = crimeData.filter((crime) => {
    if (selectedCategory !== "All Categories" && crime.category !== selectedCategory)
      return false;
    if (selectedStatus !== "All Statuses" && crime.status !== selectedStatus)
      return false;
    return true;
  });

  const categories = ["All Categories", "Theft", "Robbery", "Cyber Crime", "Violence"];
  const statuses = ["All Statuses", "OPEN", "INVESTIGATING", "RESOLVED"];

  const stats = {
    total: 12456,
    critical: 1204,
    investigating: 4321,
    resolved: 6931,
  };

  // Show loading while checking auth
  if (status === "loading" || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
            <p className="text-red-400">Loading...</p>
          </div>
        </div>
        <HoverFooter />
      </>
    );
  }

  // If not authenticated, don't render content (redirect happens in useEffect)
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-28">
        <div className="max-w-7xl mx-auto px-6">
          {/* Heading */}
          <div className="mb-10">
            <h1 className="text-5xl font-bold">Live Crimes Map</h1>
            <p className="text-gray-400 mt-4 text-lg">
              View the live map of all crimes reported around India.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center mb-6">
            <div className="flex gap-4 flex-wrap">
              {/* Category Filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-black border border-white/10 rounded-lg px-4 py-3 pr-10 text-white min-w-[200px] focus:outline-none focus:border-red-500/50"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="appearance-none bg-black border border-white/10 rounded-lg px-4 py-3 pr-10 text-white min-w-[200px] focus:outline-none focus:border-red-500/50"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            <button className="lg:ml-auto bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-lg font-medium">
              View All Crimes
            </button>
          </div>

          {/* Map Card */}
          <div className="border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <CrimeMap crimes={filteredCrimes} center={[22.9734, 78.6569]} zoom={5} />
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mt-10 mb-20">
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 hover:border-red-500/30 transition">
              <p className="text-gray-400 text-sm">Total Reports</p>
              <h3 className="text-3xl font-bold mt-2">{stats.total.toLocaleString()}</h3>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 hover:border-red-500/30 transition">
              <p className="text-gray-400 text-sm">Critical Cases</p>
              <h3 className="text-3xl font-bold text-red-500 mt-2">{stats.critical.toLocaleString()}</h3>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 hover:border-red-500/30 transition">
              <p className="text-gray-400 text-sm">Investigating</p>
              <h3 className="text-3xl font-bold text-yellow-500 mt-2">{stats.investigating.toLocaleString()}</h3>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 hover:border-red-500/30 transition">
              <p className="text-gray-400 text-sm">Resolved</p>
              <h3 className="text-3xl font-bold text-green-500 mt-2">{stats.resolved.toLocaleString()}</h3>
            </div>
          </div>
        </div>
      </main>

      <HoverFooter />
    </div>
  );
}