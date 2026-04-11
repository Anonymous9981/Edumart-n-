export interface EduMartSubcategoryTaxonomy {
  legacyId: number;
  name: string;
  slug: string;
  priority: number;
}

export interface EduMartCategoryTaxonomy {
  legacyId: number;
  name: string;
  slug: string;
  priority: number;
  subcategories: EduMartSubcategoryTaxonomy[];
}

export const EDUMART_CATALOG_TAXONOMY: EduMartCategoryTaxonomy[] = [
  {
    legacyId: 116,
    name: 'Schools',
    slug: 'schools',
    priority: 0,
    subcategories: [
      { legacyId: 205, name: 'Agarwal Public School', slug: 'agarwal-public-school', priority: 0 },
      { legacyId: 206, name: 'Chameli Devi Public School', slug: 'chameli-devi-public-school', priority: 0 },
      { legacyId: 227, name: 'Advanced Academy', slug: 'advanced-academy', priority: 0 },
    ],
  },
  {
    legacyId: 115,
    name: 'Gifts and Sports',
    slug: 'gifts-and-sports',
    priority: 1,
    subcategories: [
      { legacyId: 136, name: 'Football', slug: 'football', priority: 0 },
      { legacyId: 137, name: 'Cricket', slug: 'cricket', priority: 0 },
      { legacyId: 139, name: 'Carrom', slug: 'carrom', priority: 0 },
      { legacyId: 145, name: 'Badminton', slug: 'badminton', priority: 0 },
      { legacyId: 231, name: 'Birthday and Return Gifts', slug: 'birthday-and-return-gifts', priority: 0 },
    ],
  },
  {
    legacyId: 114,
    name: 'School Essentials',
    slug: 'school-essentials',
    priority: 2,
    subcategories: [
      { legacyId: 131, name: 'School Bags', slug: 'school-bags', priority: 0 },
      { legacyId: 132, name: 'Sippers & Water Bottles', slug: 'sippers-and-water-bottles', priority: 0 },
      { legacyId: 133, name: 'Health Care', slug: 'health-care', priority: 0 },
      { legacyId: 134, name: 'LunchBoxes', slug: 'lunchboxes', priority: 0 },
      { legacyId: 146, name: 'RainCoat', slug: 'raincoat', priority: 1 },
    ],
  },
  {
    legacyId: 112,
    name: 'Stationery',
    slug: 'stationery',
    priority: 5,
    subcategories: [
      { legacyId: 147, name: 'Writing Instruments', slug: 'writing-instruments', priority: 0 },
      { legacyId: 148, name: 'Drawing & Measuring Tools', slug: 'drawing-and-measuring-tools', priority: 0 },
      { legacyId: 149, name: 'Paper Products', slug: 'paper-products', priority: 0 },
      { legacyId: 150, name: 'Filing & Organization', slug: 'filing-and-organization', priority: 0 },
      { legacyId: 151, name: 'Cutting & Adhesives', slug: 'cutting-and-adhesives', priority: 0 },
      { legacyId: 152, name: 'Art & Craft Supplies', slug: 'art-and-craft-supplies', priority: 0 },
      { legacyId: 153, name: 'Technology Accessories', slug: 'technology-accessories', priority: 0 },
      { legacyId: 162, name: 'Miscellaneous', slug: 'miscellaneous', priority: 0 },
      { legacyId: 178, name: 'Eraser & Sharpner', slug: 'eraser-and-sharpner', priority: 0 },
      { legacyId: 229, name: 'Covers', slug: 'covers', priority: 0 },
    ],
  },
  {
    legacyId: 111,
    name: 'Books and Notebooks',
    slug: 'books-and-notebooks',
    priority: 6,
    subcategories: [
      { legacyId: 127, name: 'General Reading', slug: 'general-reading', priority: 0 },
      { legacyId: 128, name: 'Textbooks', slug: 'textbooks', priority: 0 },
      { legacyId: 129, name: 'Workbooks', slug: 'workbooks', priority: 0 },
      { legacyId: 130, name: 'Language Books', slug: 'language-books', priority: 0 },
      { legacyId: 228, name: 'Oswaal Books', slug: 'oswaal-books', priority: 0 },
      { legacyId: 230, name: 'Notebooks', slug: 'notebooks', priority: 0 },
    ],
  },
  {
    legacyId: 110,
    name: 'Uniforms',
    slug: 'uniforms',
    priority: 6,
    subcategories: [
      { legacyId: 126, name: 'Summer Uniforms', slug: 'summer-uniforms', priority: 0 },
      { legacyId: 163, name: 'Boys Uniform', slug: 'boys-uniform', priority: 0 },
      { legacyId: 164, name: 'Girls Uniform', slug: 'girls-uniform', priority: 0 },
      { legacyId: 165, name: 'Sports Uniform', slug: 'sports-uniform', priority: 0 },
      { legacyId: 166, name: 'Winter Uniform', slug: 'winter-uniform', priority: 0 },
    ],
  },
  {
    legacyId: 109,
    name: 'Study Kit',
    slug: 'study-kit',
    priority: 7,
    subcategories: [
      { legacyId: 183, name: 'Class 6th', slug: 'class-6th', priority: 0 },
      { legacyId: 193, name: 'Class 7th', slug: 'class-7th', priority: 0 },
      { legacyId: 194, name: 'Class 8th', slug: 'class-8th', priority: 0 },
      { legacyId: 196, name: 'Class 10th', slug: 'class-10th', priority: 0 },
      { legacyId: 225, name: 'Class 11th', slug: 'class-11th', priority: 0 },
      { legacyId: 226, name: 'Class 12th', slug: 'class-12th', priority: 0 },
    ],
  },
];
