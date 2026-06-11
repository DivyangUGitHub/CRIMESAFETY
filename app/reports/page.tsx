'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Map as MapIcon,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Eye,
  ChevronDown,
  SlidersHorizontal,
  Shield,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  severity: string;
  date: string;
  location: string;
  aiVerified: boolean;
  imageCount: number;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const categories = ['All', 'THEFT', 'ASSAULT', 'FRAUD', 'BURGLARY', 'HARASSMENT', 'DRUGS', 'TRAFFIC'];
  const statuses = ['All', 'PENDING', 'INVESTIGATING', 'RESOLVED', 'REJECTED'];
  const severities = ['All', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reports');
      const data = await response.json();
      
      if (data.success) {
        setReports(data.reports);
      } else {
        toast.error('Failed to load reports');
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter(report => {
    if (searchQuery && !report.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedCategory !== 'All' && report.category !== selectedCategory) return false;
    if (selectedStatus !== 'All' && report.status !== selectedStatus) return false;
    if (selectedSeverity !== 'All' && report.severity !== selectedSeverity) return false;
    return true;
  });

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'CRITICAL': return 'bg-red-600 text-white';
      case 'HIGH': return 'bg-orange-500 text-white';
      case 'MEDIUM': return 'bg-yellow-500 text-black';
      case 'LOW': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'RESOLVED': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'INVESTIGATING': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'REJECTED': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'THEFT': '💰', 'ASSAULT': '👊', 'FRAUD': '🎭', 
      'BURGLARY': '🔒', 'HARASSMENT': '📢', 'DRUGS': '💊', 
      'TRAFFIC': '🚗', 'OTHER': '📝'
    };
    return icons[category] || '📝';
  };

  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-black via-red-950/20 to-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">
            Crime <span className="text-red-500">Reports</span>
          </h1>
          <p className="text-gray-400">Browse and track reported incidents in your area</p>
        </motion.div>

        {/* Search and Filter Bar */}
        <div className="mb-6">
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/50 border border-red-900/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className="bg-black/50 border border-red-900/30 px-4 py-2 rounded-xl text-white flex items-center gap-2 hover:bg-white/5 transition"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </motion.button>
            
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl border transition ${viewMode === 'grid' ? 'bg-red-500 border-red-500' : 'bg-black/50 border-red-900/30 hover:bg-white/5'}`}
              >
                <Grid className="w-5 h-5 text-white" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-xl border transition ${viewMode === 'list' ? 'bg-red-500 border-red-500' : 'bg-black/50 border-red-900/30 hover:bg-white/5'}`}
              >
                <List className="w-5 h-5 text-white" />
              </motion.button>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-black/50 backdrop-blur-xl border border-red-900/30 rounded-xl p-4 mb-4"
              >
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-red-900/30 rounded-lg text-white"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Status</label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-red-900/30 rounded-lg text-white"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Severity</label>
                    <select
                      value={selectedSeverity}
                      onChange={(e) => setSelectedSeverity(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-red-900/30 rounded-lg text-white"
                    >
                      {severities.map(sev => (
                        <option key={sev} value={sev}>{sev}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setSelectedStatus('All');
                      setSelectedSeverity('All');
                      setSearchQuery('');
                    }}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    Clear all filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-400">
            Found <span className="text-red-400 font-semibold">{filteredReports.length}</span> reports
          </p>
          <Link href="/reports/new">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-white text-sm font-medium transition"
            >
              + New Report
            </motion.button>
          </Link>
        </div>

        {/* Reports Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-black/50 backdrop-blur-xl border border-red-900/30 rounded-xl overflow-hidden group cursor-pointer hover:border-red-500/50 transition-all"
                onClick={() => window.location.href = `/reports/${report.id}`}
              >
                <div className="relative">
                  <div className="h-32 bg-gradient-to-r from-red-950/50 to-black flex items-center justify-center">
                    <span className="text-5xl">{getCategoryIcon(report.category)}</span>
                  </div>
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-semibold ${getSeverityColor(report.severity)}`}>
                    {report.severity}
                  </div>
                  {report.aiVerified && (
                    <div className="absolute bottom-3 left-3 bg-blue-500/90 backdrop-blur rounded-lg p-1.5">
                      <Shield className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white group-hover:text-red-400 transition mb-2 line-clamp-1">
                    {report.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {report.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs px-2 py-1 bg-white/10 rounded-lg text-gray-300">
                      {report.category}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-lg border ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(report.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapIcon className="w-3 h-3" />
                      {report.location}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {paginatedReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ x: 5 }}
                className="bg-black/50 backdrop-blur-xl border border-red-900/30 rounded-xl p-4 cursor-pointer group hover:border-red-500/50 transition-all"
                onClick={() => window.location.href = `/reports/${report.id}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getCategoryIcon(report.category)}</span>
                      <h3 className="text-lg font-semibold text-white group-hover:text-red-400 transition truncate">
                        {report.title}
                      </h3>
                      {report.aiVerified && <Shield className="w-4 h-4 text-blue-400 flex-shrink-0" />}
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className={`px-2 py-1 rounded-lg ${getSeverityColor(report.severity)}`}>
                        {report.severity}
                      </span>
                      <span className={`px-2 py-1 rounded-lg border ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                      <span className="text-gray-500">{new Date(report.date).toLocaleDateString()}</span>
                      <span className="text-gray-500">{report.location}</span>
                    </div>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition rotate-[-90deg]" />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl bg-black/50 border border-red-900/30 text-white disabled:opacity-50 hover:bg-white/5 transition"
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-xl transition ${
                    currentPage === pageNum 
                      ? 'bg-red-500 text-white' 
                      : 'bg-black/50 border border-red-900/30 text-white hover:bg-white/5'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl bg-black/50 border border-red-900/30 text-white disabled:opacity-50 hover:bg-white/5 transition"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}