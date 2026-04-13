/// <reference types="node" />

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const seedSuffix =
  process.env.SEED_EMAIL_SUFFIX?.trim() || `${Date.now()}${Math.floor(Math.random() * 1000)}`;

function withSeedSuffix(email: string): string {
  const [local, domain] = email.split('@');
  return `${local}+${seedSuffix}@${domain}`;
}

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.address.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.vendorProfile.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminPassword = await hashPassword('Admin@123456');
  const admin = await prisma.user.create({
    data: {
      email: withSeedSuffix('admin@edumart.com'),
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isActive: true,
      isEmailVerified: true,
    },
  });

  // Create customer users
  const customerPassword = await hashPassword('Customer@123456');
  const customer1 = await prisma.user.create({
    data: {
      email: withSeedSuffix('customer1@edumart.com'),
      passwordHash: customerPassword,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      role: 'CUSTOMER',
      isActive: true,
      isEmailVerified: true,
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      email: withSeedSuffix('customer2@edumart.com'),
      passwordHash: customerPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+1234567891',
      role: 'CUSTOMER',
      isActive: true,
      isEmailVerified: true,
    },
  });

  // Create vendor users
  const vendorPassword = await hashPassword('Vendor@123456');
  const vendor1 = await prisma.user.create({
    data: {
      email: withSeedSuffix('vendor1@edumart.com'),
      passwordHash: vendorPassword,
      firstName: 'Vendor',
      lastName: 'One',
      phone: '+1234567892',
      role: 'VENDOR',
      isActive: true,
      isEmailVerified: true,
      vendorProfile: {
        create: {
          storeName: 'Tech Learning Hub',
          description: 'High-quality programming and web development courses',
          verificationStatus: 'APPROVED',
          rating: 4.8,
          reviewCount: 125,
        },
      },
    },
    include: {
      vendorProfile: true,
    },
  });

  const vendor2 = await prisma.user.create({
    data: {
      email: withSeedSuffix('vendor2@edumart.com'),
      passwordHash: vendorPassword,
      firstName: 'Vendor',
      lastName: 'Two',
      phone: '+1234567893',
      role: 'VENDOR',
      isActive: true,
      isEmailVerified: true,
      vendorProfile: {
        create: {
          storeName: 'Language & Culture Academy',
          description: 'Learn languages and explore world cultures',
          verificationStatus: 'APPROVED',
          rating: 4.6,
          reviewCount: 89,
        },
      },
    },
    include: {
      vendorProfile: true,
    },
  });

  // Create categories
  const studentEssentialsCategory = await prisma.category.create({
    data: {
      name: 'Student Essentials',
      slug: 'student-essentials',
      description: 'Products and kits for students and learners',
      isActive: true,
    },
  });

  const workbooksCategory = await prisma.category.create({
    data: {
      name: 'Workbooks',
      slug: 'workbooks',
      description: 'Practice books and learning packs',
      isActive: true,
    },
  });

  const codingCategory = await prisma.category.create({
    data: {
      name: 'Coding Kits',
      slug: 'coding-kits',
      description: 'Hands-on coding kits for students',
      isActive: true,
    },
  });

  const assessmentCategory = await prisma.category.create({
    data: {
      name: 'Assessment Tools',
      slug: 'assessment-tools',
      description: 'Wellness and assessment products for schools',
      isActive: true,
    },
  });

  const classroomTechCategory = await prisma.category.create({
    data: {
      name: 'Classroom Tech',
      slug: 'classroom-tech',
      description: 'Teaching panels and smart classroom hardware',
      isActive: true,
    },
  });

  const schoolEventsCategory = await prisma.category.create({
    data: {
      name: 'School Events',
      slug: 'school-events',
      description: 'Event products and activity kits for schools',
      isActive: true,
    },
  });

  // Create sample products
  const product1 = await prisma.product.create({
    data: {
      vendorId: vendor1.vendorProfile!.id,
      categoryId: studentEssentialsCategory.id,
      name: 'Class 10 Student Success Pack',
      slug: 'class-10-student-success-pack',
      description:
        'A starter pack with notebooks, practice sheets, and study tools for class 10 students.',
      shortDescription: 'Student learning essentials for class 10',
      basePrice: 1499,
      discountPercentage: 20,
      finalPrice: 1199.2,
      sku: 'STD-001',
      stock: 1000,
      lowStockThreshold: 10,
      status: 'ACTIVE',
      rating: 4.7,
      reviewCount: 234,
      tags: ['audience:student', 'featured:homepage', 'student', 'class-10'],
      images: {
        create: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80',
            altText: 'Student success pack',
            displayOrder: 1,
          },
        ],
      },
    },
    include: {
      images: true,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      vendorId: vendor1.vendorProfile!.id,
      categoryId: workbooksCategory.id,
      name: 'Maths Practice Workbook Set',
      slug: 'maths-practice-workbook-set',
      description:
        'A focused workbook pack for building speed, accuracy, and confidence in mathematics.',
      shortDescription: 'Practice workbook bundle for students',
      basePrice: 899,
      discountPercentage: 15,
      finalPrice: 764.15,
      sku: 'STD-002',
      stock: 500,
      lowStockThreshold: 10,
      status: 'ACTIVE',
      rating: 4.8,
      reviewCount: 189,
      tags: ['audience:student', 'featured:homepage', 'student', 'workbook'],
      images: {
        create: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=80',
            altText: 'Maths workbook set',
            displayOrder: 1,
          },
        ],
      },
    },
    include: {
      images: true,
    },
  });

  const product3 = await prisma.product.create({
    data: {
      vendorId: vendor1.vendorProfile!.id,
      categoryId: codingCategory.id,
      name: 'Coding for Teens Starter Kit',
      slug: 'coding-for-teens-starter-kit',
      description:
        'A beginner friendly coding kit for teens with guided learning and hands on activities.',
      shortDescription: 'Coding starter kit for students',
      basePrice: 1999,
      discountPercentage: 18,
      finalPrice: 1639.18,
      sku: 'STD-003',
      stock: 750,
      lowStockThreshold: 10,
      status: 'ACTIVE',
      rating: 4.6,
      reviewCount: 156,
      tags: ['audience:student', 'featured:homepage', 'student', 'coding'],
      images: {
        create: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=900&q=80',
            altText: 'Coding starter kit',
            displayOrder: 1,
          },
        ],
      },
    },
    include: {
      images: true,
    },
  });

  const product4 = await prisma.product.create({
    data: {
      vendorId: vendor2.vendorProfile!.id,
      categoryId: assessmentCategory.id,
      name: 'Wellness 360 Assessment Partnership',
      slug: 'wellness-360-assessment-partnership',
      description:
        'A school partnership product for student wellness tracking, assessment and support planning.',
      shortDescription: 'Wellness and assessment partnership for schools',
      basePrice: 49999,
      discountPercentage: 12,
      finalPrice: 43999.12,
      sku: 'TCH-001',
      stock: 120,
      lowStockThreshold: 10,
      status: 'ACTIVE',
      rating: 4.9,
      reviewCount: 316,
      tags: ['audience:teacher', 'featured:homepage', 'teacher', 'wellness'],
      images: {
        create: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?auto=format&fit=crop&w=900&q=80',
            altText: 'Wellness 360 assessment',
            displayOrder: 1,
          },
        ],
      },
    },
    include: {
      images: true,
    },
  });

  const product5 = await prisma.product.create({
    data: {
      vendorId: vendor2.vendorProfile!.id,
      categoryId: classroomTechCategory.id,
      name: 'Interactive Flat Panel for Teaching',
      slug: 'interactive-flat-panel-for-teaching',
      description:
        'A smart classroom display built for teaching, hybrid lessons and interactive collaboration.',
      shortDescription: 'Interactive panel for teachers',
      basePrice: 129999,
      discountPercentage: 8,
      finalPrice: 119599.08,
      sku: 'TCH-002',
      stock: 42,
      lowStockThreshold: 5,
      status: 'ACTIVE',
      rating: 4.8,
      reviewCount: 128,
      tags: ['audience:teacher', 'featured:homepage', 'teacher', 'classroom-tech'],
      images: {
        create: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=900&q=80',
            altText: 'Interactive flat panel',
            displayOrder: 1,
          },
        ],
      },
    },
    include: {
      images: true,
    },
  });

  const product6 = await prisma.product.create({
    data: {
      vendorId: vendor2.vendorProfile!.id,
      categoryId: schoolEventsCategory.id,
      name: 'Plantorium Event for School Kids',
      slug: 'plantorium-event-for-school-kids',
      description:
        'An experiential event product for school kids focused on plants, science, and creative learning.',
      shortDescription: 'School kids event and activity product',
      basePrice: 14999,
      discountPercentage: 16,
      finalPrice: 12599.16,
      sku: 'TCH-003',
      stock: 88,
      lowStockThreshold: 10,
      status: 'ACTIVE',
      rating: 4.7,
      reviewCount: 244,
      tags: ['audience:teacher', 'featured:homepage', 'teacher', 'school-events'],
      images: {
        create: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=900&q=80',
            altText: 'Plantorium school event',
            displayOrder: 1,
          },
        ],
      },
    },
    include: {
      images: true,
    },
  });

  // Create addresses for customer1
  await prisma.address.create({
    data: {
      userId: customer1.id,
      label: 'HOME',
      fullName: 'John Doe',
      phone: '+1234567890',
      addressLine1: '123 Main Street',
      addressLine2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      isDefault: true,
    },
  });

  // Create sample coupons
  await prisma.coupon.create({
    data: {
      code: 'WELCOME20',
      type: 'PERCENTAGE',
      value: 20,
      minOrderValue: 50,
      usageLimit: 100,
      timesUsed: 15,
      validFrom: new Date(),
      validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      isActive: true,
    },
  });

  await prisma.coupon.create({
    data: {
      code: 'SUMMER50',
      type: 'FIXED_AMOUNT',
      value: 50,
      minOrderValue: 100,
      usageLimit: 50,
      timesUsed: 8,
      validFrom: new Date(),
      validTo: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
      isActive: true,
    },
  });

  // Create sample banner
  await prisma.banner.create({
    data: {
      title: 'Summer Learning Sale',
      content: 'Get up to 50% off on selected courses',
      imageUrl: 'https://via.placeholder.com/1200x300?text=Summer+Sale',
      link: '/products',
      displayOrder: 1,
      isActive: true,
      validFrom: new Date(),
      validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  // Create sample order
  const order = await prisma.order.create({
    data: {
      userId: customer1.id,
      orderNumber: `ORD-${Date.now()}`,
      status: 'DELIVERED',
      paymentStatus: 'PAID',
      totalAmount: 79.99,
      taxAmount: 8,
      shippingCost: 5,
      discountAmount: 20,
      finalAmount: 72.99,
      shippingAddressId: (
        await prisma.address.findFirst({
          where: { userId: customer1.id },
        })
      )?.id,
      items: {
        create: [
          {
            productId: product1.id,
            vendorId: vendor1.vendorProfile!.id,
            quantity: 1,
            unitPrice: 79.99,
            discount: 20,
            total: 59.99,
            fulfillmentStatus: 'DELIVERED',
          },
        ],
      },
    },
  });

  // Create sample reviews
  await prisma.review.create({
    data: {
      productId: product1.id,
      userId: customer1.id,
      rating: 5,
      title: 'Excellent course!',
      comment: 'This course is comprehensive and well-structured. Highly recommended!',
      isVerified: true,
      isApproved: true,
    },
  });

  // Create sample cart
  const cart = await prisma.cart.create({
    data: {
      userId: customer2.id,
      items: {
        create: [
          {
            productId: product2.id,
            quantity: 1,
            addedPrice: 76.49,
            userId: customer2.id,
          },
          {
            productId: product3.id,
            quantity: 2,
            addedPrice: 34.99,
            userId: customer2.id,
          },
        ],
      },
    },
  });

  // Create sample audit log
  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: 'CREATE_PRODUCT',
      entity: 'Product',
      entityId: product1.id,
      changes: JSON.stringify({
        before: {},
        after: {
          name: 'The Complete JavaScript Course 2024',
          status: 'ACTIVE',
        },
      }),
      ipAddress: '127.0.0.1',
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log(`\n🔖 Seed email suffix: +${seedSuffix}`);
  console.log('\n📝 Default Credentials:');
  console.log(`   Admin: ${withSeedSuffix('admin@edumart.com')} / Admin@123456`);
  console.log(`   Customer: ${withSeedSuffix('customer1@edumart.com')} / Customer@123456`);
  console.log(`   Vendor: ${withSeedSuffix('vendor1@edumart.com')} / Vendor@123456`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
