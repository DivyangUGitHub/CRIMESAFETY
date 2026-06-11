import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "../../../../lib/prisma";
import AIService from "../../../../lib/ai-service";

export async function GET(req: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const timeRange = searchParams.get("range") || "30d";
    
    // Calculate date range
    const endDate = new Date();
    let startDate = new Date();
    switch(timeRange) {
      case "7d": startDate.setDate(endDate.getDate() - 7); break;
      case "30d": startDate.setDate(endDate.getDate() - 30); break;
      case "90d": startDate.setDate(endDate.getDate() - 90); break;
      case "1y": startDate.setFullYear(endDate.getFullYear() - 1); break;
      default: startDate.setDate(endDate.getDate() - 30);
    }
    
    // Get all reports in date range
    const reports = await prisma.report.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        status: true,
        severity: true,
        category: true,
        aiVerified: true,
        aiConfidence: true,
        createdAt: true,
        latitude: true,
        longitude: true,
        title: true,
        address: true,
      },
    });
    
    // Basic statistics
    const totalReports = reports.length;
    const aiVerified = reports.filter(r => r.aiVerified).length;
    const activeCases = reports.filter(r => r.status === "INVESTIGATING" || r.status === "PENDING").length;
    const resolvedCases = reports.filter(r => r.status === "RESOLVED").length;
    const criticalAlerts = reports.filter(r => r.severity === "CRITICAL").length;
    
    // Average response time (mock calculation)
    const avgResponseTime = 4.2;
    
    // Severity distribution
    const severityDistribution = {
      CRITICAL: reports.filter(r => r.severity === "CRITICAL").length,
      HIGH: reports.filter(r => r.severity === "HIGH").length,
      MEDIUM: reports.filter(r => r.severity === "MEDIUM").length,
      LOW: reports.filter(r => r.severity === "LOW").length,
    };
    
    // ✅ Category distribution (using JavaScript aggregation instead of SQL)
    const categoryMap = new Map();
    reports.forEach(r => {
      const cat = r.category;
      if (categoryMap.has(cat)) {
        categoryMap.set(cat, categoryMap.get(cat) + 1);
      } else {
        categoryMap.set(cat, 1);
      }
    });
    
    const categoryDistribution = Array.from(categoryMap.entries()).map(([category, count]) => ({
      category,
      _count: { category: count }
    }));
    
    // ✅ Monthly trends (using JavaScript date grouping)
    const monthlyMap = new Map();
    reports.forEach(r => {
      const month = r.createdAt.toLocaleString('default', { month: 'short' });
      const year = r.createdAt.getFullYear();
      const key = `${year}-${month}`;
      
      if (monthlyMap.has(key)) {
        const existing = monthlyMap.get(key);
        existing.total++;
        if (r.status === "RESOLVED") existing.resolved++;
        if (r.aiVerified) existing.aiVerified++;
      } else {
        monthlyMap.set(key, {
          month: `${month} ${year}`,
          total: 1,
          resolved: r.status === "RESOLVED" ? 1 : 0,
          aiVerified: r.aiVerified ? 1 : 0,
        });
      }
    });
    
    const monthlyTrends = Array.from(monthlyMap.values()).sort((a, b) => {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return months.indexOf(a.month.split(' ')[0]) - months.indexOf(b.month.split(' ')[0]);
    });
    
    // ✅ Daily trends for heatmap (using JavaScript)
    const dailyMap = new Map();
    reports.forEach(r => {
      const dayOfWeek = r.createdAt.getDay(); // 0-6 (Sunday-Saturday)
      const hour = r.createdAt.getHours();
      const key = `${dayOfWeek}-${hour}`;
      
      if (dailyMap.has(key)) {
        dailyMap.set(key, dailyMap.get(key) + 1);
      } else {
        dailyMap.set(key, 1);
      }
    });
    
    const dailyTrends = Array.from(dailyMap.entries()).map(([key, count]) => {
      const [dayOfWeek, hour] = key.split('-');
      return { day_of_week: parseInt(dayOfWeek), hour: parseInt(hour), count };
    });
    
    // Recent reports (last 10)
    const recentReports = await prisma.report.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        category: true,
        status: true,
        severity: true,
        createdAt: true,
        aiVerified: true,
      },
    });
    
    // ✅ Top locations (hotspots) - using JavaScript aggregation
    const locationMap = new Map();
    reports.forEach(r => {
      if (r.latitude && r.longitude) {
        const key = `${r.latitude},${r.longitude}`;
        const severityScore = r.severity === "CRITICAL" ? 4 : r.severity === "HIGH" ? 3 : r.severity === "MEDIUM" ? 2 : 1;
        
        if (locationMap.has(key)) {
          const existing = locationMap.get(key);
          existing.incident_count++;
          existing.severity_score_total += severityScore;
        } else {
          locationMap.set(key, {
            latitude: r.latitude,
            longitude: r.longitude,
            address: r.address,
            incident_count: 1,
            severity_score_total: severityScore,
          });
        }
      }
    });
    
    const hotspots = Array.from(locationMap.values())
      .filter(h => h.incident_count >= 2)
      .map(h => ({
        latitude: h.latitude,
        longitude: h.longitude,
        address: h.address,
        incident_count: h.incident_count,
        severity_score: h.severity_score_total / h.incident_count,
      }))
      .sort((a, b) => b.severity_score - a.severity_score)
      .slice(0, 10);
    
    // AI performance metrics
    const aiPerformance = {
      averageConfidence: reports.reduce((acc, r) => acc + (r.aiConfidence || 0), 0) / (totalReports || 1),
      verificationRate: totalReports ? (aiVerified / totalReports) * 100 : 0,
      highConfidenceCount: reports.filter(r => (r.aiConfidence || 0) > 0.8).length,
    };
    
    // User statistics (if admin)
    let userStats = null;
    if (session?.user?.role === "ADMIN") {
      const totalUsers = await prisma.user.count();
      const activeUsers = await prisma.user.count({
        where: { lastLogin: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      });
      const newUsers = await prisma.user.count({
        where: { createdAt: { gte: startDate } },
      });
      
      userStats = { totalUsers, activeUsers, newUsers };
    }
    
    // Get AI-powered insights
    const aiInsights = await AIService.analyzeCrimeTrends(reports);
    
    return NextResponse.json({
      success: true,
      timeframe: timeRange,
      stats: {
        totalReports,
        aiVerified,
        activeCases,
        resolvedCases,
        avgResponseTime,
        severityDistribution,
        categoryDistribution,
        aiPerformance,
        criticalAlerts,
      },
      trends: {
        monthly: monthlyTrends,
        daily: dailyTrends,
      },
      hotspots,
      recentReports,
      userStats,
      insights: aiInsights,
    });
    
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}

// POST endpoint for specific stats
export async function POST(req: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const body = await req.json();
    const { reportId, type } = body;
    
    if (type === "report-stats" && reportId) {
      const reportStats = await prisma.report.findUnique({
        where: { id: reportId },
        select: {
          viewCount: true,
          _count: {
            select: {
              comments: true,
            },
          },
        },
      });
      
      return NextResponse.json({
        success: true,
        stats: reportStats,
      });
    }
    
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
    
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}