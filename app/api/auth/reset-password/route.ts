import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";
import { z } from "zod";
import { EmailService } from "../../../../lib/email";
import crypto from "crypto";

const requestResetSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
});

// Request password reset
export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");
  
  if (action === "request") {
    return await requestReset(req);
  } else if (action === "reset") {
    return await resetPassword(req);
  }
  
  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

async function requestReset(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = requestResetSchema.safeParse(body);
    
    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }
    
    const { email } = validated.data;
    
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    // Don't reveal if user exists for security
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If an account exists, you will receive a reset link",
      });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    
    // ✅ Store reset token on user record
    await prisma.user.update({
      where: { id: user.id },
      data: {
        // prisma schema uses camelCase field names
        resetToken: resetToken,
        resetTokenExpires: resetExpires,
      },
    });
    
    // Send reset email
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
    
    await EmailService.sendEmailResend({
      to: email,
      subject: "Reset Your Password - CrimeSafety",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #ef4444; padding: 30px; text-align: center; color: white;">
            <h1>Reset Your Password</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <p>Hello ${user.name || 'there'},</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                Reset Password
              </a>
            </div>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <hr style="margin: 20px 0;">
            <p style="color: #6b7280; font-size: 12px;">CrimeSafety - Keeping communities safe</p>
          </div>
        </div>
      `,
    });
    
    return NextResponse.json({
      success: true,
      message: "If an account exists, you will receive a reset link",
    });
    
  } catch (error) {
    console.error("Reset request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function resetPassword(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = resetPasswordSchema.safeParse(body);
    
    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0].message },
        { status: 400 }
      );
    }
    
    const { token, password } = validated.data;
    
    // ✅ Find valid reset token on user record
    // prisma generated types may not expose custom fields in the WhereInput
    // cast the where clause to any to avoid TypeScript errors while keeping
    // the runtime query intact
    const user = await prisma.user.findFirst({
      where: ({
        // use camelCase names matching the prisma schema
        resetToken: token,
        resetTokenExpires: { gt: new Date() },
      } as any),
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Update user password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    });
    
    return NextResponse.json({
      success: true,
      message: "Password reset successful. You can now login with your new password.",
    });
    
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}