import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { z } from "zod";

const verifySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = verifySchema.safeParse(body);
    
    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid verification data" },
        { status: 400 }
      );
    }
    
    const { email, code } = validated.data;
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email already verified" },
        { status: 400 }
      );
    }
    
    // ✅ Find verification record in database
    const verificationRecord = await prisma.emailVerification.findFirst({
      where: {
        userId: user.id,
        code: code,
        expiresAt: { gt: new Date() }, // Not expired
      },
    });
    
    if (!verificationRecord) {
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 }
      );
    }
    
    // ✅ Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    });
    
    // ✅ Delete verification record (using Prisma model instead of raw SQL)
    await prisma.emailVerification.deleteMany({
      where: { userId: user.id },
    });
    
    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    });
    
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}