import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";
import { z } from "zod";
import { EmailService } from "../../../../lib/email";

// Validation schemas
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional(),
  location: z.string().optional(),
});

// Extend session and JWT types
declare module "next-auth" {
  interface Session {
    id: {
      id: string;
      name?: string;
      email?: string;
      image?: string;
      role?: string;
      isActive?: boolean;
    }
  }
  
  interface User {
    role: string;
    isActive: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    isActive: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  
  // Session strategy
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  
  // JWT configuration
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  // Providers
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "USER",
          isActive: true,
        };
      },
    }),
    
    // GitHub OAuth
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          role: "USER",
          isActive: true,
        };
      },
    }),
    
    // Credentials (Email/Password)
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password");
        }
        
        // Validate input
        const validated = loginSchema.safeParse(credentials);
        if (!validated.success) {
          throw new Error(validated.error.errors[0].message);
        }
        
        // Find user in database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            role: true,
            isActive: true,
            image: true,
            emailVerified: true,
            lastLogin: true,
          },
        });
        
        if (!user) {
          throw new Error("No account found with this email");
        }
        
        // Check if user is active
        if (!user.isActive) {
          throw new Error("Your account has been deactivated. Please contact support.");
        }
        
        // Check if user has password (OAuth users don't have password)
        if (!user.password) {
          throw new Error("Please sign in using Google or GitHub");
        }
        
        // Verify password
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Incorrect password");
        }
        
        // Update last login time
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });
        
        // ✅ Log login activity using Prisma model (instead of raw SQL)
        await prisma.activityLog.create({
          data: {
            userId: user.id,
            action: "LOGIN",
            ipAddress: ((credentials as any)?.ipAddress) ?? 'unknown',
            userAgent: ((credentials as any)?.userAgent) ?? 'unknown',
          },
        });
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isActive: user.isActive,
          image: user.image,
        };
      },
    }),
  ],
  
  // Callbacks
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log(`Sign in attempt: ${user.email} via ${account?.provider}`);
      
      const bannedEmails = (process.env.BANNED_EMAILS || "").split(",");
      if (user.email && bannedEmails.includes(user.email)) {
        console.log(`Blocked banned email: ${user.email}`);
        return false;
      }
      
      if (account?.provider !== "credentials") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });
        
        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name,
              image: user.image,
              emailVerified: new Date(),
              role: "USER",
              isActive: true,
            },
          });
        } else if (!existingUser.emailVerified) {
          await prisma.user.update({
            where: { email: user.email! },
            data: { emailVerified: new Date() },
          });
        }
      }
      
      return true;
    },
    
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isActive = user.isActive;
        token.email = user.email;
        token.name = user.name;
      }
      
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.image) token.picture = session.image;
        if (session.role) token.role = session.role;
      }
      
      if (token.id) {
        const freshUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: {
            role: true,
            isActive: true,
            name: true,
            image: true,
          },
        });
        
        if (freshUser) {
          token.role = freshUser.role;
          token.isActive = freshUser.isActive;
          if (freshUser.name) token.name = freshUser.name;
          if (freshUser.image) token.picture = freshUser.image;
        }
      }
      
      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        // session.user may not include custom properties in its type, cast to any for assignments
        const u = session.user as any;
        u.id = token.id as string;
        u.role = token.role as string;
        u.isActive = token.isActive as boolean;
        u.name = token.name as string;
        u.image = token.picture as string;
        u.email = token.email as string;
      }
      return session;
    },
    
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  
  // Pages
  pages: {
    signIn: "/login",
    error: "/login?error=true",
    verifyRequest: "/verify-request",
    newUser: "/welcome",
  },
  
  // Events
  events: {
    async signIn({ user, account, isNewUser }) {
      console.log(`User signed in: ${user.email} (New: ${isNewUser})`);
      
      if (isNewUser && user.email) {
        await EmailService.sendEmailResend({
          to: user.email,
          subject: "Welcome to CrimeSafety! 🛡️",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #ef4444, #ec4899); padding: 30px; text-align: center; color: white;">
                <h1>Welcome to CrimeSafety!</h1>
              </div>
              <div style="padding: 30px; background: #f9fafb;">
                <h2>Hello ${user.name || 'there'}! 👋</h2>
                <p>Thank you for joining CrimeSafety. You're now part of a community committed to making neighborhoods safer.</p>
                <h3>Here's what you can do:</h3>
                <ul>
                  <li>📝 Report crimes anonymously</li>
                  <li>🗺️ View real-time crime maps</li>
                  <li>🤖 Chat with our AI assistant</li>
                  <li>📊 Access safety analytics</li>
                </ul>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.NEXTAUTH_URL}/dashboard" style="background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                    Go to Dashboard
                  </a>
                </div>
              </div>
            </div>
          `,
        });
      }
    },
    
    async signOut({ session, token }) {
      console.log(`User signed out: ${token.email}`);
      
      // ✅ Log logout activity using Prisma model
      if (token.id) {
        await prisma.activityLog.create({
          data: {
            userId: token.id as string,
            action: "LOGOUT",
          },
        });
      }
    },
    
    async createUser({ user }) {
      console.log(`New user created: ${user.email}`);
      
      // ✅ Create default notification settings using Prisma model
      await prisma.notificationSettings.create({
        data: {
          userId: user.id,
          emailNotifications: true,
          pushNotifications: true,
          reportUpdates: true,
          safetyAlerts: true,
        },
      });
      
      // Send welcome notification in-app
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: "Welcome to CrimeSafety!",
          message: "Thank you for joining. Start by exploring the dashboard or reporting a crime.",
          type: "SYSTEM",
        },
      });
    },
    
    async linkAccount({ user, account }) {
      console.log(`Account linked: ${user.email} - ${account?.provider}`);
    },
  },
  
  // Secret
  secret: process.env.NEXTAUTH_SECRET,
  
  // Debug (only in development)
  debug: process.env.NODE_ENV === "development",
  
  // Cookies configuration
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };