// Environment configuration
export interface AppConfig {
  env: string;
  isDev: boolean;
  isProd: boolean;
  appName: string;
  apiBaseUrl: string;
  auth: {
    provider: 'supabase' | 'auth0' | 'firebase' | 'custom';
    jwt_secret?: string;
    jwt_expiry?: string;
  };
  storage: {
    type: 'local' | 's3' | 'cloudinary';
    local?: {
      dir: string;
    };
    s3?: {
      region: string;
      bucket: string;
      accessKeyId: string;
      secretAccessKey: string;
    };
    cloudinary?: {
      cloudName: string;
      apiKey: string;
      apiSecret: string;
    };
  };
  features: {
    socialLogin: boolean;
    twoFactorAuth: boolean;
    vendorVerification: boolean;
    productApproval: boolean;
  };
}

// Get environment variable with fallback
export function getEnvVar(key: string, fallback?: string): string {
  const runtime = globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
    [key: string]: unknown;
  };

  const serverValue = runtime.process?.env?.[key];
  if (typeof serverValue === 'string' && serverValue.length > 0) {
    return serverValue;
  }

  const browserValue = runtime[`NEXT_PUBLIC_${key}`];
  if (typeof browserValue === 'string' && browserValue.length > 0) {
    return browserValue;
  }

  return fallback || '';
}

// Build config from environment
export function buildConfig(): AppConfig {
  const env = getEnvVar('NODE_ENV', 'development');

  return {
    env,
    isDev: env === 'development',
    isProd: env === 'production',
    appName: getEnvVar('NEXT_PUBLIC_APP_NAME', 'EduMart'),
    apiBaseUrl: getEnvVar('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:3000/api/v1'),
    auth: {
      provider: 'custom',
      jwt_secret: getEnvVar('JWT_SECRET'),
      jwt_expiry: getEnvVar('JWT_EXPIRES_IN', '1h'),
    },
    storage: {
      type: 'local',
    },
    features: {
      socialLogin: getEnvVar('FEATURE_SOCIAL_LOGIN', 'false') === 'true',
      twoFactorAuth: getEnvVar('FEATURE_TWO_FACTOR_AUTH', 'false') === 'true',
      vendorVerification: getEnvVar('FEATURE_VENDOR_VERIFICATION', 'true') === 'true',
      productApproval: getEnvVar('FEATURE_PRODUCT_APPROVAL', 'true') === 'true',
    },
  };
}

// Singleton config instance
let config: AppConfig | null = null;

export function getConfig(): AppConfig {
  if (!config) {
    config = buildConfig();
  }
  return config;
}

export function resetConfig(): void {
  config = null;
}
