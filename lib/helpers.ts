import crypto from "crypto";
import { formatDistanceToNow, format } from "date-fns";

// Generate unique ID
export const generateId = (prefix: string = ""): string => {
  const id = crypto.randomBytes(16).toString("hex");
  return prefix ? `${prefix}_${id}` : id;
};

// Generate random verification code
export const generateVerificationCode = (length: number = 6): string => {
  return Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, "0");
};

// Hash sensitive data
export const hashData = (data: string): string => {
  return crypto.createHash("sha256").update(data).digest("hex");
};

// Encrypt data (for sensitive information)
export const encryptData = (text: string): string => {
  const algorithm = "aes-256-cbc";
  const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || "default-key", "salt", 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
};

// Decrypt data
export const decryptData = (encryptedText: string): string => {
  const [ivHex, encrypted] = encryptedText.split(":");
  const algorithm = "aes-256-cbc";
  const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || "default-key", "salt", 32);
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

// Format date for display
export const formatDate = (date: Date | string, pattern: string = "PPP"): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, pattern);
};

// Get relative time (e.g., "2 hours ago")
export const getRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

// Calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

// Validate coordinates
export const isValidCoordinate = (lat: number, lng: number): boolean => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

// Mask sensitive data (email, phone)
export const maskEmail = (email: string): string => {
  const [local, domain] = email.split("@");
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local[0]}${"*".repeat(local.length - 2)}${local[local.length - 1]}@${domain}`;
};

export const maskPhone = (phone: string): string => {
  if (phone.length <= 6) return phone;
  return `${phone.slice(0, 3)}****${phone.slice(-3)}`;
};

// Generate slug from title
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-")
    .slice(0, 100);
};

// Truncate text
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

// Parse user agent
export const parseUserAgent = (userAgent: string): any => {
  const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent);
  const isBot = /bot|crawl|spider|scraper/i.test(userAgent);
  const browser = /Chrome|Firefox|Safari|Edge|Opera/i.exec(userAgent)?.[0] || "Unknown";
  
  return { isMobile, isBot, browser };
};

// Get client IP from request
export const getClientIP = (req: any): string => {
  return req.headers["x-forwarded-for"]?.split(",")[0] ||
         req.socket?.remoteAddress ||
         req.ip ||
         "unknown";
};

// Logging utility
export const logger = {
  info: (message: string, meta?: any) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta || "");
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error || "");
  },
  warn: (message: string, meta?: any) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta || "");
  },
  debug: (message: string, meta?: any) => {
    if (process.env.NODE_ENV === "development") {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, meta || "");
    }
  },
};

// Retry logic for failed operations
export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error | undefined;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError;
};

// Batch processing helper
export const processBatch = async <T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize: number = 10
): Promise<R[]> => {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
  }
  
  return results;
};

// Cache helper (in-memory)
class MemoryCache {
  private cache: Map<string, { value: any; expiry: number }> = new Map();
  
  set(key: string, value: any, ttlSeconds: number = 300) {
    const expiry = Date.now() + (ttlSeconds * 1000);
    this.cache.set(key, { value, expiry });
  }
  
  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }
  
  delete(key: string) {
    this.cache.delete(key);
  }
  
  clear() {
    this.cache.clear();
  }
}

export const cache = new MemoryCache();

// Geolocation helpers
export const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
    );
    const data = await response.json();
    
    if (data && data[0]) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};

// Reverse geocoding
export const reverseGeocode = async (lat: number, lng: number): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );
    const data = await response.json();
    return data.display_name || null;
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return null;
  }
};

// Export all helpers as default object
export default {
  generateId,
  generateVerificationCode,
  hashData,
  encryptData,
  decryptData,
  formatDate,
  getRelativeTime,
  calculateDistance,
  isValidCoordinate,
  maskEmail,
  maskPhone,
  generateSlug,
  truncateText,
  parseUserAgent,
  getClientIP,
  logger,
  retryOperation,
  processBatch,
  cache,
  geocodeAddress,
  reverseGeocode,
};