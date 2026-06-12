// app/app/reports/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "../../../../lib/prisma";

// GET single report
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
          },
        },
        updates: {
          orderBy: { createdAt: "desc" },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });
    
    if (!report) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      );
    }
    
    // Increment view count
    await prisma.report.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
    
    // Get similar reports
    const similarReports = await prisma.report.findMany({
      where: {
        category: report.category,
        id: { not: id },
        status: { not: "REJECTED" },
      },
      take: 5,
      select: {
        id: true,
        title: true,
        severity: true,
        date: true,
        address: true,
      },
      orderBy: { createdAt: "desc" },
    });
    
    return NextResponse.json({
      success: true,
      report: {
        ...report,
        user: report.isAnonymous ? null : report.user,
        similarReports,
      },
    });
    
  } catch (error) {
    console.error("Get report error:", error);
    return NextResponse.json(
      { error: "Failed to fetch report" },
      { status: 500 }
    );
  }
}

// POST comment on report - Allow anonymous comments
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Optional: Check if user is authenticated, but allow anonymous comments too
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || `anonymous_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const userName = session?.user?.name || "Anonymous User";
    
    const { id } = params;
    const body = await req.json();
    const { content } = body;
    
    if (!content || content.length < 5) {
      return NextResponse.json(
        { error: "Comment must be at least 5 characters" },
        { status: 400 }
      );
    }
    
    const comment = await prisma.comment.create({
      data: {
        content,
        reportId: id,
        userId: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
    
    // Update comment with anonymous name if no session
    if (!session?.user?.id) {
      await prisma.comment.update({
        where: { id: comment.id },
        data: {
          user: {
            connect: { id: userId }
          }
        }
      });
    }
    
    return NextResponse.json({
      success: true,
      comment: {
        ...comment,
        user: session?.user?.id ? comment.user : { name: "Anonymous", id: userId, image: null }
      },
    }, { status: 201 });
    
  } catch (error) {
    console.error("Add comment error:", error);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
} 