import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "../../../../lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (session && (session as any).user?.id) {
      // Optional: Log logout activity (commented out to avoid errors)
      // await prisma.activityLog.create({
      //   data: {
      //     userId: session.user.id,
      //     action: "LOGOUT",
      //     ipAddress: req.headers.get("x-forwarded-for") || "unknown",
      //     userAgent: req.headers.get("user-agent") || "unknown",
      //   },
      // });
    }
    
    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
    
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}