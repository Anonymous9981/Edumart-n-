export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phone?: string;
  role: string;
  isActive: boolean;
  isEmailVerified: boolean;
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

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  altText?: string;
  displayOrder: number;
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
  images?: ProductImage[];
  tags?: string[];
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
}