'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Shield, 
  Calendar, 
  MapPin, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Share2,
  Flag,
  Download,
  Printer,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  User,
  FileText,
  Award,
  Bell,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  severity: string;
  date: string;
  location: string;
  latitude: number;
  longitude: number;
  aiVerified: boolean;
  aiConfidence: number;
  aiAnalysis: string;
  images: string[];
  updates: Update[];
  comments: Comment[];
}

interface Update {
  id: string;
  date: string;
  message: string;
  type: string;
}

interface Comment {
  id: string;
  user: string;
  date: string;
  comment: string;
  likes: number;
}

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);

  useEffect(() => {
    fetchReport();
  }, [params.id]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/reports/${params.id}`);
      const data = await response.json();
      
      if (data.success) {
        setReport(data.report);
      } else {
        toast.error('Report not found');
        router.push('/reports');
      }
    } catch (error) {
      console.error('Error fetching report:', error);
      toast.error('Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  const severityInfo = {
    LOW: { color: "bg-green-500", text: "Low", icon: CheckCircle, border: "border-green-500/30" },
    MEDIUM: { color: "bg-yellow-500", text: "Medium", icon: AlertTriangle, border: "border-yellow-500/30" },
    HIGH: { color: "bg-orange-500", text: "High", icon: AlertTriangle, border: "border-orange-500/30" },
    CRITICAL: { color: "bg-red-600", text: "Critical", icon: AlertTriangle, border: "border-red-600/30" },
  };

  const statusInfo = {
    PENDING: { color: "bg-yellow-500/20 text-yellow-400", text: "Under Review", border: "border-yellow-500/30" },
    INVESTIGATING: { color: "bg-blue-500/20 text-blue-400", text: "Investigating", border: "border-blue-500/30" },
    RESOLVED: { color: "bg-green-500/20 text-green-400", text: "Resolved", border: "border-green-500/30" },
    REJECTED: { color: "bg-red-500/20 text-red-400", text: "Rejected", border: "border-red-500/30" },
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: report?.title,
        text: `Check out this crime report: ${report?.title}`,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast.success(isFollowing ? 'Unfollowed report' : 'Following report updates');
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      const response = await fetch(`/api/reports/${params.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      });
      
      if (response.ok) {
        toast.success('Comment added!');
        setNewComment('');
        fetchReport(); // Refresh comments
      } else {
        toast.error('Failed to add comment');
      }
    } catch (error) {
      toast.error('Error adding comment');
    }
  };

  const handleReaction = (type: 'like' | 'dislike') => {
    setUserReaction(userReaction === type ? null : type);
    toast.success(`Thank you for your feedback`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading report...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-400">Report not found</p>
          <Link href="/reports">
            <button className="btn-primary mt-4">Back to Reports</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-black via-red-950/20 to-black">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-red-400 mb-6 transition group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition" />
          Back to Reports
        </motion.button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/60 backdrop-blur-xl rounded-2xl border border-red-900/30 p-6"
            >
              <div className="flex justify-between items-start mb-4 flex-wrap gap-3">
                <div className="flex gap-2 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${severityInfo[report.severity as keyof typeof severityInfo]?.color || 'bg-gray-500'} text-white shadow-lg`}>
                    {severityInfo[report.severity as keyof typeof severityInfo]?.text || report.severity} Severity
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm border ${statusInfo[report.status as keyof typeof statusInfo]?.color || 'bg-gray-500/20 text-gray-400'}`}>
                    {statusInfo[report.status as keyof typeof statusInfo]?.text || report.status}
                  </span>
                  {report.aiVerified && (
                    <span className="px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      <Shield className="w-3 h-3 inline mr-1" />
                      AI Verified
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    className="bg-white/5 hover:bg-white/10 p-2 rounded-lg transition border border-red-900/30"
                  >
                    <Share2 className="w-4 h-4 text-gray-400" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleFollow}
                    className={`p-2 rounded-lg transition border border-red-900/30 ${isFollowing ? 'bg-red-500/20 border-red-500' : 'bg-white/5 hover:bg-white/10'}`}
                  >
                    <Bell className={`w-4 h-4 ${isFollowing ? 'text-red-400' : 'text-gray-400'}`} />
                  </motion.button>
                </div>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">{report.title}</h1>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(report.date).toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {report.location}
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  {report.category}
                </div>
              </div>
              
              {/* AI Verification Badge */}
              {report.aiVerified && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-red-400" />
                    <span className="text-red-400 font-semibold">AI Verification Report</span>
                  </div>
                  <p className="text-sm text-gray-300">{report.aiAnalysis}</p>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Confidence Score</span>
                      <span className="text-white font-semibold">{Math.round(report.aiConfidence * 100)}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${report.aiConfidence * 100}%` }}
                        transition={{ duration: 1 }}
                        className="h-2 rounded-full bg-gradient-to-r from-red-500 to-red-600"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-3">Incident Description</h2>
                <div className="bg-white/5 rounded-lg p-4 border border-red-900/20">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {showFullDescription ? report.description : `${report.description.substring(0, 400)}${report.description.length > 400 ? '...' : ''}`}
                  </p>
                  {report.description.length > 400 && (
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="text-red-400 hover:text-red-300 text-sm mt-3 font-semibold"
                    >
                      {showFullDescription ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </div>
              </div>
              
              {/* Image Gallery */}
              {report.images && report.images.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-3">Evidence Images</h2>
                  <div className="space-y-3">
                    <div className="relative h-96 rounded-xl overflow-hidden bg-black/50 border border-red-900/30">
                      <img
                        src={report.images[selectedImage]}
                        alt={`Evidence ${selectedImage + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {report.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(idx)}
                          className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition ${
                            selectedImage === idx ? 'border-red-500' : 'border-white/20'
                          }`}
                        >
                          <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Updates Timeline */}
            {report.updates && report.updates.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-black/60 backdrop-blur-xl rounded-2xl border border-red-900/30 p-6"
              >
                <h2 className="text-xl font-semibold text-white mb-4">Case Timeline</h2>
                <div className="space-y-4">
                  {report.updates.map((update, idx) => (
                    <div key={update.id} className="flex gap-3">
                      <div className="relative">
                        {idx !== report.updates.length - 1 && (
                          <div className="absolute top-6 left-2.5 w-0.5 h-full bg-red-500/30" />
                        )}
                        <div className="w-5 h-5 rounded-full bg-red-500 ring-4 ring-red-500/20" />
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="text-sm text-gray-400 mb-1">
                          {new Date(update.date).toLocaleString()}
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 border border-red-900/20">
                          <p className="text-white text-sm">{update.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Comments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-black/60 backdrop-blur-xl rounded-2xl border border-red-900/30 p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Comments ({report.comments?.length || 0})</h2>
              
              {/* Add Comment */}
              <div className="flex gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-red-700 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts or information about this incident..."
                    className="w-full px-4 py-3 bg-white/5 border border-red-900/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleComment}
                      className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg text-white text-sm font-medium transition"
                    >
                      Post Comment
                    </motion.button>
                  </div>
                </div>
              </div>
              
              {/* Comments List */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {report.comments?.map((comment) => (
                  <div key={comment.id} className="flex gap-3 p-3 bg-white/5 rounded-xl border border-red-900/20">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500/50 to-red-700/50 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-white">{comment.user}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.date).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">{comment.comment}</p>
                      <div className="flex gap-3 mt-2">
                        <button className="text-xs text-gray-400 hover:text-red-400 flex items-center gap-1 transition">
                          <ThumbsUp className="w-3 h-3" />
                          {comment.likes}
                        </button>
                        <button className="text-xs text-gray-400 hover:text-red-400 transition">Reply</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-black/60 backdrop-blur-xl rounded-2xl border border-red-900/30 p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-white/5 hover:bg-white/10 py-2.5 rounded-xl text-white flex items-center justify-center gap-2 transition border border-red-900/30">
                  <Flag className="w-4 h-4 text-red-400" />
                  Report Inaccuracy
                </button>
                <button className="w-full bg-white/5 hover:bg-white/10 py-2.5 rounded-xl text-white flex items-center justify-center gap-2 transition border border-red-900/30">
                  <Download className="w-4 h-4 text-gray-400" />
                  Download Report (PDF)
                </button>
                <button className="w-full bg-white/5 hover:bg-white/10 py-2.5 rounded-xl text-white flex items-center justify-center gap-2 transition border border-red-900/30">
                  <Printer className="w-4 h-4 text-gray-400" />
                  Print Report
                </button>
              </div>
            </motion.div>

            {/* Helpful Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-black/60 backdrop-blur-xl rounded-2xl border border-red-900/30 p-6 text-center"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Was this report helpful?</h3>
              <div className="flex justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleReaction('like')}
                  className={`p-3 rounded-full transition ${
                    userReaction === 'like' ? 'bg-green-500' : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <ThumbsUp className="w-6 h-6 text-white" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleReaction('dislike')}
                  className={`p-3 rounded-full transition ${
                    userReaction === 'dislike' ? 'bg-red-500' : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <ThumbsDown className="w-6 h-6 text-white" />
                </motion.button>
              </div>
            </motion.div>

            {/* Safety Tips Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-red-950/40 to-black/60 backdrop-blur-xl rounded-2xl border border-red-500/30 p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Safety Tips</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span> Stay alert and aware of your surroundings
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span> Keep valuables out of sight in vehicles
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span> Park in well-lit, busy areas
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span> Trust your instincts - if something feels wrong, leave
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span> Report suspicious activity immediately
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}