import { EDUMART_CATALOG_TAXONOMY } from '@edumart/shared';

import type { HomepageAudience, HomepageProduct } from './homepage-types';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80';

function imageForCategory(category: string) {
  const map: Record<string, string> = {
    Schools: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1200&q=80',
    'Gifts and Sports': 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    'School Essentials': 'https://images.unsplash.com/photo-1588072432904-843af37f03ed?auto=format&fit=crop&w=1200&q=80',
    Stationery: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80',
    'Books and Notebooks': 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1200&q=80',
    Uniforms: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
    'Study Kit': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
  };
  return map[category] ?? FALLBACK_IMAGE;
}

function inferAudience(category: string): HomepageAudience {
  return category === 'Schools' ? 'teacher' : 'student';
}

function inferSchoolClasses(category: string, subcategory: string): string[] | undefined {
  if (category !== 'Study Kit') {
    return undefined;
  }
  const match = subcategory.match(/class\s*(\d+)/i);
  if (!match) {
    return undefined;
  }
  return [match[1]];
}

export function buildTaxonomyFallbackProducts(): HomepageProduct[] {
  const products: HomepageProduct[] = [];

  EDUMART_CATALOG_TAXONOMY.forEach((category, categoryIndex) => {
    category.subcategories.forEach((subcategory, subcategoryIndex) => {
      const index = categoryIndex * 10 + subcategoryIndex + 1;
      const audience = inferAudience(category.name);
      const price = audience === 'teacher' ? 24999 + index * 300 : 499 + index * 60;
      const discountPercentage = 8 + (index % 5) * 2;
      const finalPrice = Math.round(price * (1 - discountPercentage / 100));

      products.push({
        id: `fallback-taxonomy-${subcategory.legacyId}`,
        slug: `${subcategory.slug}-kit`,
        title: `${subcategory.name} ${audience === 'teacher' ? 'School Pack' : 'Student Kit'}`,
        vendor: audience === 'teacher' ? 'EduMart School Solutions' : 'EduMart School Store',
        category: category.name,
        subcategory: subcategory.name,
        audience,
        image: imageForCategory(category.name),
        rating: Number((4.2 + (index % 8) * 0.1).toFixed(1)),
        reviews: 35 + index * 3,
        price,
        finalPrice,
        discountPercentage,
        discountType: 'PERCENTAGE',
        discountValue: discountPercentage,
        schoolClasses: inferSchoolClasses(category.name, subcategory.name),
        description: `Curated ${subcategory.name.toLowerCase()} essentials from ${category.name.toLowerCase()} for smooth ordering and fast delivery.`,
        featured: subcategoryIndex === 0,
      });
    });
  });

  return products;
}
