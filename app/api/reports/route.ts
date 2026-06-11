import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "../../../lib/prisma";
import AIService from "../../../lib/ai-service";
import { EmailService } from "../../../lib/email";
import { z } from "zod";

// Validation schemas
const createReportSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(20).max(5000),
  category: z.enum(["THEFT", "ASSAULT", "BURGLARY", "VANDALISM", "FRAUD", "HARASSMENT", "DRUGS", "TRAFFIC", "OTHER"]),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string(),
  date: z.string().datetime(),
  images: z.array(z.string()).optional(),
  isAnonymous: z.boolean().default(false),
});

const updateReportSchema = z.object({
  status: z.enum(["PENDING", "VERIFIED", "INVESTIGATING", "RESOLVED", "REJECTED"]).optional(),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  description: z.string().min(20).optional(),
});

// Helper function to calculate distance
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// CREATE report
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    
    const validated = createReportSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validated.error.errors },
        { status: 400 }
      );
    }
    
    const { 
      title, description, category, latitude, longitude, 
      address, date, images, isAnonymous 
    } = validated.data;
    
    const aiAnalysis = await AIService.verifyReport({
      title,
      description,
      category,
      location: address,
    });
    
    const report = await prisma.report.create({
      data: {
        title,
        description,
        category,
        latitude,
        longitude,
        address,
        date: new Date(date),
        images: images || [],
        userId: isAnonymous ? "anonymous" : (session as any)?.user?.id || "anonymous",
        isAnonymous,
        aiVerified: aiAnalysis.isValid,
        aiConfidence: aiAnalysis.confidence,
        aiAnalysis: aiAnalysis.analysis,
        severity: aiAnalysis.severity,
        status: aiAnalysis.isValid ? "VERIFIED" : "PENDING",
      },
    });
    
    await prisma.reportUpdate.create({
      data: {
        reportId: report.id,
        message: "Report submitted and AI verification completed",
        type: "STATUS",
      },
    });
    
    if (!isAnonymous && (session as any)?.user?.email) {
      await EmailService.sendEmailResend({
        to: (session as any).user.email,
        subject: `Report #${report.id.slice(-6)} Submitted Successfully`,
        html: `...`,
      });
    }
    
    if (aiAnalysis.severity === "CRITICAL" || aiAnalysis.severity === "HIGH") {
      await EmailService.sendPoliceAlert({
        id: report.id,
        title,
        description,
        category,
        address,
        severity: aiAnalysis.severity,
        aiConfidence: aiAnalysis.confidence,
        aiAnalysis: aiAnalysis.analysis,
      });
    }
    
    return NextResponse.json({
      success: true,
      report: {
        id: report.id,
        status: report.status,
        severity: report.severity,
        aiConfidence: report.aiConfidence,
        trackingUrl: `/reports/${report.id}`,
      },
    }, { status: 201 });
    
  } catch (error) {
    console.error("Create report error:", error);
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 }
    );
  }
}

// GET reports
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const severity = searchParams.get("severity");
    const nearby = searchParams.get("nearby");
    const lat = parseFloat(searchParams.get("lat") || "0");
    const lng = parseFloat(searchParams.get("lng") || "0");
    const radius = parseFloat(searchParams.get("radius") || "5");
    
    const skip = (page - 1) * limit;
    
    let where: any = {};
    if (category && category !== "ALL") where.category = category;
    if (status && status !== "ALL") where.status = status;
    if (severity && severity !== "ALL") where.severity = severity;
    
    let reports = await prisma.report.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        status: true,
        severity: true,
        date: true,
        address: true,
        latitude: true,
        longitude: true,
        images: true,
        aiVerified: true,
        aiConfidence: true,
        createdAt: true,
        _count: { select: { comments: true, updates: true } },
      },
    });
    
    if (nearby === "true" && lat && lng) {
      reports = reports
        .filter(r => r.latitude && r.longitude)
        .map(r => ({ ...r, distance: calculateDistance(lat, lng, r.latitude!, r.longitude!) }))
        .filter(r => r.distance <= radius)
        .sort((a, b) => a.distance - b.distance);
    }
    
    const total = await prisma.report.count({ where });
    
    return NextResponse.json({
      success: true,
      reports,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
    
  } catch (error) {
    console.error("Get reports error:", error);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}

// UPDATE report
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session as any).user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { searchParams } = new URL(req.url);
    const reportId = searchParams.get("id");
    if (!reportId) {
      return NextResponse.json({ error: "Report ID required" }, { status: 400 });
    }
    
    const body = await req.json();
    const validated = updateReportSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    
    const existingReport = await prisma.report.findUnique({
      where: { id: reportId },
      select: { userId: true },
    });
    
    const isAuthorized = ((session as any).user as any).role === "ADMIN" ||
      ((session as any).user as any).role === "POLICE" ||
      existingReport?.userId === ((session as any).user as any).id;
    
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    
    const updateData: any = {};
    if (validated.data.status) updateData.status = validated.data.status;
    if (validated.data.severity) updateData.severity = validated.data.severity;
    if (validated.data.description) updateData.description = validated.data.description;
    
    const updatedReport = await prisma.report.update({
      where: { id: reportId },
      data: updateData,
    });
    
    if (validated.data.status) {
      await prisma.reportUpdate.create({
        data: { reportId, message: `Report status updated to ${validated.data.status}`, type: "STATUS" },
      });
    }
    
    return NextResponse.json({ success: true, report: updatedReport });
    
  } catch (error) {
    console.error("Update report error:", error);
    return NextResponse.json({ error: "Failed to update report" }, { status: 500 });
  }
}

// DELETE report
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const sess = session as any;
    if (!sess || !sess.user || sess.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { searchParams } = new URL(req.url);
    const reportId = searchParams.get("id");
    if (!reportId) {
      return NextResponse.json({ error: "Report ID required" }, { status: 400 });
    }
    
    await prisma.report.delete({ where: { id: reportId } });
    
    return NextResponse.json({ success: true, message: "Report deleted successfully" });
    
  } catch (error) {
    console.error("Delete report error:", error);
    return NextResponse.json({ error: "Failed to delete report" }, { status: 500 });
  }
}