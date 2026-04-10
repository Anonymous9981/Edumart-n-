import Constants from 'expo-constants';

export interface WebsiteProduct {
  id: string;
  slug: string;
  title: string;
  vendor: string;
  category: string;
  audience: 'student' | 'teacher';
  image: string;
  rating: number;
  reviews: number;
  price: number;
  finalPrice: number;
  discountPercentage: number;
  schoolClasses?: string[];
  description: string;
  featured: boolean;
}

export interface WebsiteOffer {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
}

export interface WebsiteCompany {
  name: string;
  tagline: string;
  about: string;
  supportEmail: string;
  supportPhone: string;
  trustBadges: string[];
}

export interface WebsiteMobileContent {
  products: WebsiteProduct[];
  categories: string[];
  offers: WebsiteOffer[];
  company?: WebsiteCompany;
  aboutPoints?: string[];
  audienceStats?: {
    student: number;
    school: number;
    total: number;
  };
  updatedAt: string;
}

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
}

function resolveApiBaseUrl() {
  const extra = Constants.expoConfig?.extra as { webApiBaseUrl?: string } | undefined;
  return extra?.webApiBaseUrl?.trim() || '';
}

export async function fetchWebsiteMobileContent(timeoutMs = 5000): Promise<WebsiteMobileContent | null> {
  const baseUrl = resolveApiBaseUrl();
  if (!baseUrl) {
    return null;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${baseUrl}/api/v1/mobile-content`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as ApiEnvelope<WebsiteMobileContent>;

    if (!payload.success || !payload.data?.products?.length) {
      return null;
    }

    return payload.data;
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}
