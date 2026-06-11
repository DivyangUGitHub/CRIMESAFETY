import { z } from "zod";

// Common validation patterns
export const validators = {
  // Email validation
  email: z.string()
    .email("Invalid email format")
    .min(5, "Email too short")
    .max(100, "Email too long")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),
  
  // Password validation
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password too long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  
  // Phone number validation
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
    .optional(),
  
  // Name validation
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name too long")
    .regex(/^[a-zA-Z\s-']+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  
  // Location coordinates
  latitude: z.number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),
  
  longitude: z.number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),
  
  // URL validation
  url: z.string()
    .url("Invalid URL format")
    .regex(/^https?:\/\//, "URL must start with http:// or https://"),
  
  // Date validation
  date: z.string()
    .datetime("Invalid date format")
    .refine(date => new Date(date) <= new Date(), "Date cannot be in the future"),
  
  // IP Address
  ipAddress: z.string()
    .ip("Invalid IP address format"),
  
  // Object ID (MongoDB)
  objectId: z.string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Object ID format"),
};

// Sanitization functions
export const sanitize = {
  // Remove HTML tags
  html: (input: string): string => {
    return input.replace(/<[^>]*>/g, "");
  },
  
  // Escape special characters
  specialChars: (input: string): string => {
    return input.replace(/[&<>"']/g, (match) => {
      const escape: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      };
      return escape[match];
    });
  },
  
  // Trim whitespace
  trim: (input: string): string => {
    return input.trim();
  },
  
  // Remove script tags
  script: (input: string): string => {
    return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  },
};

// Validation functions
export const validateInput = {
  // Check if string is empty
  isEmpty: (value: string): boolean => {
    return !value || value.trim().length === 0;
  },
  
  // Check email format
  isEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  // Check phone format
  isPhone: (phone: string): boolean => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  },
  
  // Check URL format
  isURL: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
  
  // Check if within bounds
  isInRange: (value: number, min: number, max: number): boolean => {
    return value >= min && value <= max;
  },
};

// Pagination helper
export const pagination = (page: number = 1, limit: number = 20) => {
  const parsedPage = Math.max(1, parseInt(page as any) || 1);
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit as any) || 20));
  
  return {
    skip: (parsedPage - 1) * parsedLimit,
    take: parsedLimit,
    page: parsedPage,
    limit: parsedLimit,
  };
};

// Rate limiting configuration
export const rateLimits = {
  public: {
    windowMs: 60 * 1000, // 1 minute
    max: 60, // 60 requests per minute
  },
  authenticated: {
    windowMs: 60 * 1000,
    max: 120,
  },
  sensitive: {
    windowMs: 60 * 1000,
    max: 10,
  },
  admin: {
    windowMs: 60 * 1000,
    max: 200,
  },
};

// CORS configuration
export const corsConfig = {
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"],
  allowedMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["X-Total-Count", "X-Rate-Limit"],
  credentials: true,
  maxAge: 86400, // 24 hours
};

// Security headers
export const securityHeaders = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(self), camera=(), microphone=()",
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
};