// Crime categories with metadata
export const CRIME_CATEGORIES = {
  THEFT: {
    name: "Theft",
    icon: "💰",
    color: "#ef4444",
    severity: "MEDIUM",
    description: "Illegal taking of property without force",
  },
  ASSAULT: {
    name: "Assault",
    icon: "👊",
    color: "#f97316",
    severity: "HIGH",
    description: "Physical attack or threat of harm",
  },
  BURGLARY: {
    name: "Burglary",
    icon: "🔒",
    color: "#eab308",
    severity: "HIGH",
    description: "Unlawful entry to commit crime",
  },
  VANDALISM: {
    name: "Vandalism",
    icon: "💔",
    color: "#8b5cf6",
    severity: "LOW",
    description: "Willful destruction of property",
  },
  FRAUD: {
    name: "Fraud",
    icon: "🎭",
    color: "#06b6d4",
    severity: "MEDIUM",
    description: "Deception for financial gain",
  },
  HARASSMENT: {
    name: "Harassment",
    icon: "📢",
    color: "#ec4899",
    severity: "MEDIUM",
    description: "Unwanted threatening behavior",
  },
  DRUGS: {
    name: "Drugs",
    icon: "💊",
    color: "#10b981",
    severity: "HIGH",
    description: "Illegal substance activities",
  },
  TRAFFIC: {
    name: "Traffic",
    icon: "🚗",
    color: "#3b82f6",
    severity: "LOW",
    description: "Traffic violations and accidents",
  },
  OTHER: {
    name: "Other",
    icon: "📝",
    color: "#6b7280",
    severity: "MEDIUM",
    description: "Other criminal activities",
  },
};

// Report statuses
export const REPORT_STATUS = {
  PENDING: { name: "Pending", color: "yellow", description: "Awaiting review" },
  VERIFIED: { name: "Verified", color: "blue", description: "Confirmed by AI" },
  INVESTIGATING: { name: "Investigating", color: "purple", description: "Under investigation" },
  RESOLVED: { name: "Resolved", color: "green", description: "Case closed" },
  REJECTED: { name: "Rejected", color: "red", description: "Insufficient evidence" },
};

// Severity levels
export const SEVERITY_LEVELS = {
  LOW: { name: "Low", color: "green", responseTime: "48h", priority: 4 },
  MEDIUM: { name: "Medium", color: "yellow", responseTime: "24h", priority: 3 },
  HIGH: { name: "High", color: "orange", responseTime: "12h", priority: 2 },
  CRITICAL: { name: "Critical", color: "red", responseTime: "1h", priority: 1 },
};

// User roles
export const USER_ROLES = {
  USER: { name: "User", permissions: ["view_reports", "create_report", "comment"] },
  POLICE: { name: "Police", permissions: ["view_reports", "update_report", "investigate"] },
  ADMIN: { name: "Admin", permissions: ["all"] },
};

// Emergency contact numbers by country
export const EMERGENCY_NUMBERS = {
  US: "911",
  UK: "999",
  INDIA: "112",
  DEFAULT: "112",
};

// Time ranges for analytics
export const TIME_RANGES = {
  "7d": { label: "Last 7 Days", days: 7 },
  "30d": { label: "Last 30 Days", days: 30 },
  "90d": { label: "Last 90 Days", days: 90 },
  "1y": { label: "Last Year", days: 365 },
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

// File upload limits
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES: 10,
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
};

// Cache TTLs (seconds)
export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
};

// API rate limits (requests per window)
export const RATE_LIMITS = {
  PUBLIC: { windowMs: 60 * 1000, max: 60 },
  AUTHENTICATED: { windowMs: 60 * 1000, max: 120 },
  ADMIN: { windowMs: 60 * 1000, max: 300 },
  SENSITIVE: { windowMs: 60 * 1000, max: 10 },
};

// Export all constants
export default {
  CRIME_CATEGORIES,
  REPORT_STATUS,
  SEVERITY_LEVELS,
  USER_ROLES,
  EMERGENCY_NUMBERS,
  TIME_RANGES,
  PAGINATION,
  UPLOAD_LIMITS,
  CACHE_TTL,
  RATE_LIMITS,
};