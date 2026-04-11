import { getHomepageData } from '../../../homepage-loader';
import { successResponse } from '../../../../lib/response';
import { EDUMART_CATALOG_TAXONOMY } from '@edumart/shared';

function buildCategories(products: Array<{ category: string }>) {
  const unique = Array.from(new Set(products.map((product) => product.category)));
  return ['All', ...unique];
}

function buildTaxonomy(products: Array<{ category: string; subcategory?: string }>) {
  const dynamicTaxonomy = new Map<string, Set<string>>();

  products.forEach((product) => {
    if (!dynamicTaxonomy.has(product.category)) {
      dynamicTaxonomy.set(product.category, new Set<string>());
    }
    if (product.subcategory) {
      dynamicTaxonomy.get(product.category)?.add(product.subcategory);
    }
  });

  const merged = EDUMART_CATALOG_TAXONOMY.map((category) => ({
    id: `legacy-${category.legacyId}`,
    name: category.name,
    slug: category.slug,
    priority: category.priority,
    subcategories: category.subcategories.map((subcategory) => ({
      id: `legacy-${subcategory.legacyId}`,
      name: subcategory.name,
      slug: subcategory.slug,
      priority: subcategory.priority,
    })),
  }));

  dynamicTaxonomy.forEach((subcategories, categoryName) => {
    const existing = merged.find((category) => category.name === categoryName);
    if (!existing) {
      merged.push({
        id: `dynamic-${categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        name: categoryName,
        slug: categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        priority: 999,
        subcategories: Array.from(subcategories).map((subcategory) => ({
          id: `dynamic-${subcategory.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          name: subcategory,
          slug: subcategory.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          priority: 0,
        })),
      });
      return;
    }

    const existingNames = new Set(existing.subcategories.map((subcategory) => subcategory.name));
    Array.from(subcategories).forEach((subcategory) => {
      if (!existingNames.has(subcategory)) {
        existing.subcategories.push({
          id: `dynamic-${subcategory.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          name: subcategory,
          slug: subcategory.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          priority: 0,
        });
      }
    });
  });

  return merged
    .sort((a, b) => a.priority - b.priority || a.name.localeCompare(b.name))
    .map((category) => ({
      ...category,
      subcategories: category.subcategories
        .slice()
        .sort((a, b) => a.priority - b.priority || a.name.localeCompare(b.name)),
    }));
}

function buildAudienceStats(products: Array<{ audience: 'student' | 'teacher' }>) {
  const student = products.filter((product) => product.audience === 'student').length;
  const school = products.filter((product) => product.audience === 'teacher').length;
  return {
    student,
    school,
    total: products.length,
  };
}

const offers = [
  {
    id: 'offer-prime',
    title: 'EduMart Prime',
    subtitle: '4 free deliveries, early sale access, and priority support for school buying cycles.',
    cta: 'Explore Prime',
  },
  {
    id: 'offer-refer',
    title: 'Refer and Earn',
    subtitle: 'Get INR 100 wallet credit for each successful referral above INR 499.',
    cta: 'Start Referring',
  },
  {
    id: 'offer-bundle',
    title: 'School Bundle Weeks',
    subtitle: 'Up to 20% off on class-wise book plus stationery bundle kits.',
    cta: 'View Bundles',
  },
] as const;

export async function GET() {
  const data = await getHomepageData();
  const stats = buildAudienceStats(data.products);

  return successResponse({
    products: data.products,
    categories: buildCategories(data.products),
    taxonomy: buildTaxonomy(data.products),
    offers,
    company: {
      name: 'EduMart',
      tagline: 'A trusted marketplace built for students, schools and vendors',
      about:
        'EduMart combines verified supply, school-focused curation, and fast delivery so institutions and families can buy with confidence.',
      supportEmail: 'info@edu-mart.com',
      supportPhone: '+91 90000 00000',
      trustBadges: ['Verified Vendors', 'Fast Delivery', 'Secure Checkout', 'School Bulk Support'],
    },
    aboutPoints: [
      'Verified vendor onboarding',
      'School and class-based catalog mapping',
      'Auto-applied percentage and fixed discounts',
      'Fast dispatch and order tracking',
      'Post-delivery support for institutions and families',
    ],
    audienceStats: stats,
    updatedAt: new Date().toISOString(),
  });
}
