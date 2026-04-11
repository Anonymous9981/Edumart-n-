// Role-based access constants
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  CUSTOMER: [
    'view_products',
    'search_products',
    'add_to_cart',
    'manage_orders',
    'manage_profile',
    'submit_review',
  ],
  VENDOR: [
    'manage_products',
    'manage_inventory',
    'manage_orders',
    'view_analytics',
    'manage_vendor_profile',
  ],
  ADMIN: [
    'manage_users',
    'manage_vendors',
    'manage_products',
    'manage_categories',
    'manage_banners',
    'manage_coupons',
    'manage_orders',
    'view_audit_logs',
    'view_analytics',
  ],
};

// Order status workflow
export const ORDER_STATUS_FLOW: Record<string, string[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: ['REFUNDED'],
  CANCELLED: [],
  REFUNDED: [],
};

// Default pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// File upload constraints
export const FILE_UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword'],
};

// Stock thresholds
export const STOCK_WARNINGS = {
  LOW_STOCK: 10,
  OUT_OF_STOCK: 0,
};

// Rating scale
export const RATING_SCALE = {
  MIN: 1,
  MAX: 5,
};

// Price constraints
export const PRICE_CONFIG = {
  MIN_PRICE: 0.01,
  MAX_DISCOUNT_PERCENTAGE: 100,
};

// Email templates
export const EMAIL_TEMPLATES = {
  WELCOME: 'welcome',
  ORDER_CONFIRMATION: 'order-confirmation',
  ORDER_SHIPPED: 'order-shipped',
  ORDER_DELIVERED: 'order-delivered',
  VENDOR_APPROVED: 'vendor-approved',
  VENDOR_REJECTED: 'vendor-rejected',
  PASSWORD_RESET: 'password-reset',
  REVIEW_APPROVED: 'review-approved',
};

// Rate limiting configuration
export const RATE_LIMITS = {
  AUTH_WINDOW_MS: 900000, // 15 minutes
  AUTH_MAX_REQUESTS: 5,
  API_WINDOW_MS: 60000, // 1 minute
  API_MAX_REQUESTS: 100,
};

// Session/Token expiration
export const TOKEN_EXPIRY = {
  ACCESS_TOKEN: 3600, // 1 hour in seconds
  REFRESH_TOKEN: 604800, // 7 days in seconds
  PASSWORD_RESET: 3600, // 1 hour in seconds
};

export * from './catalog-taxonomy';
