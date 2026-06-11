"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { 
  Activity, Shield, Clock, AlertTriangle, TrendingUp, 
  FileText, CheckCircle, RefreshCw, MapPin, Bell, Loader2
} from "lucide-react";
import Navbar from "../components/Navbar";
import HoverEffect from "../components/hover-footer";

// Dynamically import CrimeMap to avoid SSR issues
const CrimeMap = dynamic(() => import("../components/CrimeMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-black/50 rounded-xl animate-pulse flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-gray-500 text-sm">Loading map...</p>
      </div>
    </div>
  ),
});

// Crime data for map
const crimeMapData = [
  {
    id: "1",
    title: "Armed Robbery",
    description: "Reported armed robbery near Connaught Place",
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
    description: "Bike theft reported in Mumbai",
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
    description: "Online fraud complaint registered",
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
    description: "Public disturbance reported",
    latitude: 22.5726,
    longitude: 88.3639,
    severity: "LOW",
    status: "RESOLVED",
    date: "2026-06-07",
    category: "Violence",
  },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats] = useState({
    totalReports: 1247,
    aiVerified: 1148,
    activeCases: 342,
    avgResponseTime: 4.2,
  });
  const [trends] = useState([
    { month: "Jan", reports: 65, resolved: 58, aiVerified: 60 },
    { month: "Feb", reports: 78, resolved: 70, aiVerified: 72 },
    { month: "Mar", reports: 95, resolved: 85, aiVerified: 89 },
    { month: "Apr", reports: 112, resolved: 98, aiVerified: 105 },
    { month: "May", reports: 128, resolved: 115, aiVerified: 122 },
    { month: "Jun", reports: 145, resolved: 130, aiVerified: 140 },
    { month: "Jul", reports: 162, resolved: 148, aiVerified: 158 },
    { month: "Aug", reports: 178, resolved: 162, aiVerified: 174 },
    { month: "Sep", reports: 195, resolved: 180, aiVerified: 191 },
    { month: "Oct", reports: 210, resolved: 195, aiVerified: 206 },
    { month: "Nov", reports: 228, resolved: 212, aiVerified: 224 },
    { month: "Dec", reports: 245, resolved: 230, aiVerified: 241 },
  ]);
  const [categories] = useState([
    { name: "Theft", value: 342, color: "#ef4444" },
    { name: "Assault", value: 198, color: "#dc2626" },
    { name: "Burglary", value: 156, color: "#b91c1c" },
    { name: "Fraud", value: 234, color: "#ef4444" },
    { name: "Harassment", value: 167, color: "#f87171" },
    { name: "Drugs", value: 89, color: "#991b1b" },
    { name: "Traffic", value: 312, color: "#dc2626" },
    { name: "Other", value: 145, color: "#7f1d1d" },
  ]);
  const [recentReports] = useState([
    { id: 1, title: "Suspicious Activity", category: "Theft", status: "Investigating", severity: "high", date: "2024-01-15", location: "Downtown", aiVerified: true },
    { id: 2, title: "Vehicle Break-in", category: "Burglary", status: "Resolved", severity: "medium", date: "2024-01-14", location: "Suburbs", aiVerified: true },
    { id: 3, title: "Online Scam", category: "Fraud", status: "Pending", severity: "low", date: "2024-01-13", location: "Online", aiVerified: false },
    { id: 4, title: "Physical Assault", category: "Assault", status: "Investigating", severity: "critical", date: "2024-01-12", location: "Nightlife District", aiVerified: true },
    { id: 5, title: "Drug Possession", category: "Drugs", status: "Resolved", severity: "high", date: "2024-01-11", location: "Industrial Area", aiVerified: true },
  ]);

  // Filter crimes for map
  const filteredCrimes = crimeMapData.filter((crime) => {
    if (filterCategory !== "all" && crime.category !== filterCategory) return false;
    if (filterStatus !== "all" && crime.status !== filterStatus) return false;
    return true;
  });

  // ✅ Auth Check - Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Simulate loading
  useEffect(() => {
    if (status === "authenticated") {
      setTimeout(() => setLoading(false), 500);
    }
  }, [status]);

  // Show loading while checking auth
  if (status === "loading" || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
            <p className="text-red-400">Loading dashboard...</p>
          </div>
        </div>
        <HoverEffect />
      </>
    );
  }

  // If not authenticated, don't render content (redirect happens in useEffect)
  if (!session) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black pt-28 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                <span className="text-red-500">Safety</span>{" "}
                <span className="text-white">Dashboard</span>
              </h1>
              <p className="text-gray-400 text-sm mt-1">Real-time crime analytics and insights</p>
            </div>
            <button className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 px-4 py-2 rounded-lg text-white text-sm flex items-center gap-2 transition">
              <RefreshCw size={16} className="text-red-400" />
              Refresh
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <StatCard title="Total Reports" value={stats.totalReports} trend="+23%" icon={Activity} />
            <StatCard title="AI Verified" value={stats.aiVerified} trend="+18%" icon={Shield} />
            <StatCard title="Active Cases" value={stats.activeCases} trend="+5%" icon={AlertTriangle} />
            <StatCard title="Response Time" value={`${stats.avgResponseTime}min`} trend="-15%" icon={Clock} />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Crime Trends Chart */}
            <div className="bg-black/60 backdrop-blur-sm rounded-2xl border border-red-800/50 p-5">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-red-500" />
                Crime Trends
              </h2>
              <div className="flex gap-4 mb-3 text-xs">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500"></span><span className="text-gray-400">reports</span></span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-700"></span><span className="text-gray-400">resolved</span></span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-400"></span><span className="text-gray-400">aiVerified</span></span>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trends}>
                  <CartesianGrid stroke="#ffffff10" strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#ffffff40" fontSize={12} />
                  <YAxis stroke="#ffffff40" fontSize={12} />
                  <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #ef4444", borderRadius: "8px" }} />
                  <Line type="monotone" dataKey="reports" stroke="#ef4444" strokeWidth={2} dot={{ r: 3, fill: "#ef4444" }} />
                  <Line type="monotone" dataKey="resolved" stroke="#991b1b" strokeWidth={2} dot={{ r: 3, fill: "#991b1b" }} />
                  <Line type="monotone" dataKey="aiVerified" stroke="#f87171" strokeWidth={2} dot={{ r: 3, fill: "#f87171" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Crime Categories Pie Chart */}
            <div className="bg-black/60 backdrop-blur-sm rounded-2xl border border-red-800/50 p-5">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FileText size={18} className="text-red-500" />
                Crime Categories
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={categories} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={100} dataKey="value">
                    {categories.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #ef4444", borderRadius: "8px" }} />
                  <Legend wrapperStyle={{ color: "#9ca3af", fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center mt-3">
                <span className="text-red-400 text-sm flex items-center justify-center gap-1"><TrendingUp size={14} /> Trending up 5.2% this month</span>
              </div>
            </div>
          </div>

          {/* Live Crime Map Section */}
          <div className="bg-black/60 backdrop-blur-sm rounded-2xl border border-red-800/50 p-5 mb-8">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <MapPin size={18} className="text-red-500" />
                Live Crime Map
              </h2>
              <div className="flex gap-3">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-black/50 border border-red-500/30 rounded-lg px-3 py-1.5 text-white text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="Robbery">Robbery</option>
                  <option value="Theft">Theft</option>
                  <option value="Cyber Crime">Cyber Crime</option>
                  <option value="Violence">Violence</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-black/50 border border-red-500/30 rounded-lg px-3 py-1.5 text-white text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="OPEN">Open</option>
                  <option value="INVESTIGATING">Investigating</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>
            </div>
            <CrimeMap crimes={filteredCrimes} center={[22.9734, 78.6569]} zoom={5} />
            <p className="text-gray-500 text-xs text-center mt-3">
              Showing {filteredCrimes.length} crime locations on map
            </p>
          </div>

          {/* Area Chart - Active Cases */}
          <div className="bg-black/60 backdrop-blur-sm rounded-2xl border border-red-800/50 p-5 mb-8">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Activity size={18} className="text-red-500" />
              Active cases over time
            </h2>
            <p className="text-gray-500 text-xs mb-4">Showing active cases for the last 12 months</p>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={trends}>
                <CartesianGrid stroke="#ffffff10" strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#ffffff40" />
                <YAxis stroke="#ffffff40" />
                <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #ef4444", borderRadius: "8px" }} />
                <Area type="monotone" dataKey="reports" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
                <Area type="monotone" dataKey="resolved" stroke="#991b1b" fill="#991b1b" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Reports Table */}
          <div className="bg-black/60 backdrop-blur-sm rounded-2xl border border-red-800/50 p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Bell size={18} className="text-red-500" />
                Recent Reports
              </h2>
              <button className="text-red-400 text-sm hover:text-red-300 transition">View All →</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-red-800/50">
                  <tr className="text-left text-gray-400 text-sm">
                    <th className="pb-3">Title</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Severity</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Location</th>
                    <th className="pb-3">AI</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReports.map((report) => (
                    <tr key={report.id} className="border-b border-red-900/20 hover:bg-red-950/20 transition">
                      <td className="py-3 text-white text-sm">{report.title}</td>
                      <td className="py-3 text-gray-300 text-sm">{report.category}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          report.status === "Resolved" ? "bg-green-500/20 text-green-400 border border-green-500/30" :
                          report.status === "Investigating" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" :
                          "bg-red-500/20 text-red-400 border border-red-500/30"
                        }`}>{report.status}</span>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          report.severity === "critical" ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                          report.severity === "high" ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" :
                          report.severity === "medium" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" :
                          "bg-green-500/20 text-green-400 border border-green-500/30"
                        }`}>{report.severity}</span>
                      </td>
                      <td className="py-3 text-gray-400 text-sm">{report.date}</td>
                      <td className="py-3 text-gray-400 text-sm flex items-center gap-1"><MapPin size={12} /> {report.location}</td>
                      <td className="py-3">{report.aiVerified ? <CheckCircle size={16} className="text-green-500" /> : <div className="w-4 h-4 rounded-full bg-red-500/50"></div>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <HoverEffect />
    </>
  );
}

// Stat Card Component - Red Theme
function StatCard({ title, value, trend, icon: Icon }: any) {
  const isPositive = trend.startsWith("+");
  return (
    <div className="bg-black/60 backdrop-blur-sm rounded-2xl border border-red-800/50 p-5 hover:border-red-500/50 transition">
      <div className="flex justify-between items-start mb-2">
        <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30">
          <Icon size={20} className="text-red-400" />
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full ${isPositive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
          {trend}
        </span>
      </div>
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-2xl font-bold text-white mt-1">{typeof value === 'number' ? value.toLocaleString() : value}</p>
    </div>
  );
}