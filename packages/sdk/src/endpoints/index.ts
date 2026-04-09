import { ApiClient } from '../client/index';
import type { Address, Category, Order, Product, Review, User } from '../types';

// Auth endpoints
export class AuthAPI {
  constructor(private client: ApiClient) {}

  async login(email: string, password: string, rememberMe?: boolean) {
    return this.client.post('/auth/login', { email, password, rememberMe });
  }

  async signup(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: string;
  }) {
    return this.client.post('/auth/signup', data);
  }

  async logout() {
    return this.client.post('/auth/logout', {});
  }

  async refreshToken(refreshToken: string) {
    return this.client.post('/auth/refresh-token', { refreshToken });
  }

  async forgotPassword(email: string) {
    return this.client.post('/auth/forgot-password', { email });
  }

  async resetPassword(token: string, password: string, confirmPassword: string) {
    return this.client.post('/auth/reset-password', { token, password, confirmPassword });
  }

  async getMe() {
    return this.client.get<User>('/auth/me');
  }
}

// Products endpoints
export class ProductsAPI {
  constructor(private client: ApiClient) {}

  async list(params?: any) {
    return this.client.get('/products', { params });
  }

  async get(id: string) {
    return this.client.get<Product>(`/products/${id}`);
  }

  async create(data: any) {
    return this.client.post('/products', data);
  }

  async update(id: string, data: any) {
    return this.client.put(`/products/${id}`, data);
  }

  async delete(id: string) {
    return this.client.delete(`/products/${id}`);
  }

  async getReviews(productId: string, params?: any) {
    return this.client.get(`/products/${productId}/reviews`, { params });
  }

  async createReview(productId: string, data: any) {
    return this.client.post(`/products/${productId}/reviews`, data);
  }
}

// Cart endpoints
export class CartAPI {
  constructor(private client: ApiClient) {}

  async get() {
    return this.client.get('/cart');
  }

  async addItem(productId: string, quantity: number) {
    return this.client.post('/cart/items', { productId, quantity });
  }

  async updateItem(itemId: string, quantity: number) {
    return this.client.put(`/cart/items/${itemId}`, { quantity });
  }

  async removeItem(itemId: string) {
    return this.client.delete(`/cart/items/${itemId}`);
  }

  async clear() {
    return this.client.post('/cart/clear', {});
  }
}

// Orders endpoints
export class OrdersAPI {
  constructor(private client: ApiClient) {}

  async list(params?: any) {
    return this.client.get('/orders', { params });
  }

  async get(id: string) {
    return this.client.get<Order>(`/orders/${id}`);
  }

  async create(data: any) {
    return this.client.post('/orders', data);
  }

  async cancel(id: string, reason?: string) {
    return this.client.post(`/orders/${id}/cancel`, { reason });
  }

  async applyCoupon(couponCode: string) {
    return this.client.post('/orders/apply-coupon', { couponCode });
  }
}

// Addresses endpoints
export class AddressesAPI {
  constructor(private client: ApiClient) {}

  async list(params?: any) {
    return this.client.get('/addresses', { params });
  }

  async get(id: string) {
    return this.client.get<Address>(`/addresses/${id}`);
  }

  async create(data: any) {
    return this.client.post('/addresses', data);
  }

  async update(id: string, data: any) {
    return this.client.put(`/addresses/${id}`, data);
  }

  async delete(id: string) {
    return this.client.delete(`/addresses/${id}`);
  }
}

// Categories endpoints
export class CategoriesAPI {
  constructor(private client: ApiClient) {}

  async list(params?: any) {
    return this.client.get<Category[]>('/categories', { params });
  }

  async get(id: string) {
    return this.client.get<Category>(`/categories/${id}`);
  }

  async create(data: any) {
    return this.client.post('/categories', data);
  }

  async update(id: string, data: any) {
    return this.client.put(`/categories/${id}`, data);
  }

  async delete(id: string) {
    return this.client.delete(`/categories/${id}`);
  }
}

// Vendor endpoints
export class VendorAPI {
  constructor(private client: ApiClient) {}

  async getProfile() {
    return this.client.get('/vendor/me');
  }

  async updateProfile(data: any) {
    return this.client.put('/vendor/me', data);
  }

  async getProducts(params?: any) {
    return this.client.get('/vendor/products', { params });
  }

  async getOrders(params?: any) {
    return this.client.get('/vendor/orders', { params });
  }

  async updateOrderItem(orderId: string, itemId: string, data: any) {
    return this.client.put(`/vendor/orders/${orderId}/items/${itemId}`, data);
  }
}

// Admin endpoints
export class AdminAPI {
  constructor(private client: ApiClient) {}

  async getUsers(params?: any) {
    return this.client.get('/admin/users', { params });
  }

  async getUser(id: string) {
    return this.client.get(`/admin/users/${id}`);
  }

  async suspendUser(id: string) {
    return this.client.post(`/admin/users/${id}/suspend`, {});
  }

  async getVendors(params?: any) {
    return this.client.get('/admin/vendors', { params });
  }

  async approveVendor(id: string) {
    return this.client.post(`/admin/vendors/${id}/approve`, {});
  }

  async rejectVendor(id: string, reason: string) {
    return this.client.post(`/admin/vendors/${id}/reject`, { reason });
  }

  async getAuditLogs(params?: any) {
    return this.client.get('/admin/audit-logs', { params });
  }

  async getCategories(params?: any) {
    return this.client.get('/admin/categories', { params });
  }

  async createCategory(data: any) {
    return this.client.post('/admin/categories', data);
  }

  async updateCategory(id: string, data: any) {
    return this.client.put(`/admin/categories/${id}`, data);
  }

  async getCoupons(params?: any) {
    return this.client.get('/admin/coupons', { params });
  }

  async createCoupon(data: any) {
    return this.client.post('/admin/coupons', data);
  }

  async updateCoupon(id: string, data: any) {
    return this.client.put(`/admin/coupons/${id}`, data);
  }
}

// SDK Factory
export interface SDKConfig {
  baseUrl: string;
  getAccessToken?: () => string | null;
  getRefreshToken?: () => string | null;
  setAccessToken?: (token: string) => void;
  setRefreshToken?: (token: string) => void;
  onTokenExpired?: () => void;
}

export class EdumartSDK {
  public auth: AuthAPI;
  public products: ProductsAPI;
  public cart: CartAPI;
  public orders: OrdersAPI;
  public addresses: AddressesAPI;
  public categories: CategoriesAPI;
  public vendor: VendorAPI;
  public admin: AdminAPI;

  constructor(config: SDKConfig) {
    const client = new ApiClient({
      baseUrl: config.baseUrl,
      getAccessToken: config.getAccessToken,
      getRefreshToken: config.getRefreshToken,
      setAccessToken: config.setAccessToken,
      setRefreshToken: config.setRefreshToken,
      onTokenExpired: config.onTokenExpired,
    });

    this.auth = new AuthAPI(client);
    this.products = new ProductsAPI(client);
    this.cart = new CartAPI(client);
    this.orders = new OrdersAPI(client);
    this.addresses = new AddressesAPI(client);
    this.categories = new CategoriesAPI(client);
    this.vendor = new VendorAPI(client);
    this.admin = new AdminAPI(client);
  }
}
