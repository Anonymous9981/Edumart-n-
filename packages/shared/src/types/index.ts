export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phone?: string;
  role: string;
  accountStatus: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
}

export interface UserProfile extends User {
  vendorProfile?: VendorProfile;
}

export interface VendorProfile {
  id: string;
  userId: string;
  storeName: string;
  description?: string;
  logo?: string;
  banner?: string;
  verificationStatus: string;
  rating?: number;
  reviewCount: number;
  taxId?: string;
  businessLicense?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  vendorId: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  basePrice: number;
  discountPercentage: number;
  finalPrice: number;
  sku: string;
  stock: number;
  rating?: number;
  reviewCount: number;
  status: string;
  images: ProductImage[];
  tags: string[];
  createdAt: Date;
}

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  altText?: string;
  displayOrder: number;
}

export interface Cart {
  id: string;
  userId?: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  addedPrice: number;
  product?: Product;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product?: Product;
  createdAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  taxAmount: number;
  shippingCost: number;
  discountAmount: number;
  finalAmount: number;
  items: OrderItem[];
  shippingAddress?: Address;
  billingAddress?: Address;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  vendorId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  fulfillmentStatus: string;
}

export interface Address {
  id: string;
  userId: string;
  label?: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title?: string;
  comment?: string;
  isVerified: boolean;
  isApproved: boolean;
  createdAt: Date;
}

export interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit?: number;
  timesUsed: number;
  validFrom: Date;
  validTo: Date;
  isActive: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  readAt?: Date;
  createdAt: Date;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  changes: Record<string, any>;
  ipAddress?: string;
  createdAt: Date;
}
