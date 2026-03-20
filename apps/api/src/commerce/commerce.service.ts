import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';
import { sanitizeFrontendUrl } from '../common/utils/frontend-url';
import {
  CreateCommerceCheckoutDto,
  CreateCourseDto,
  CreateLessonDto,
  CreateProductDto,
  RevenueQueryDto,
  UpdateCourseDto,
  UpdateLessonDto,
  UpdateLessonProgressDto,
  UpdateProductDto,
  UpsertStoreDto,
} from './dto/commerce.dto';

@Injectable()
export class CommerceService {
  private stripe: Stripe;

  constructor(private prisma: PrismaService, private config: ConfigService) {
    const stripeKey = this.config.get<string>('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('STRIPE_SECRET_KEY is required for commerce module');
    }
    this.stripe = new Stripe(stripeKey, { apiVersion: '2025-02-24.acacia' });
  }

  async getOrCreateStore(ownerId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: ownerId }, select: { id: true, name: true } });
    if (!user) throw new NotFoundException('User not found');

    const existing = await this.prisma.store.findUnique({ where: { ownerId } });
    if (existing) return existing;

    return this.prisma.store.create({
      data: {
        ownerId,
        name: `${user.name} Store`,
        slug: this.slugify(`${user.name}-store-${user.id.slice(-6)}`),
      },
    });
  }

  async upsertStore(ownerId: string, dto: UpsertStoreDto) {
    await this.ensureUniqueStoreSlug(dto.slug, ownerId);

    return this.prisma.store.upsert({
      where: { ownerId },
      create: {
        ownerId,
        name: dto.name,
        slug: this.slugify(dto.slug),
        description: dto.description,
        logoUrl: dto.logoUrl,
        bannerUrl: dto.bannerUrl,
        currency: (dto.currency || 'usd').toLowerCase(),
        isPublished: dto.isPublished ?? false,
      },
      update: {
        name: dto.name,
        slug: this.slugify(dto.slug),
        description: dto.description,
        logoUrl: dto.logoUrl,
        bannerUrl: dto.bannerUrl,
        currency: (dto.currency || 'usd').toLowerCase(),
        isPublished: dto.isPublished ?? false,
      },
    });
  }

  async listCreatorProducts(userId: string) {
    return this.prisma.product.findMany({
      where: { creatorId: userId },
      include: {
        accesses: { select: { id: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createProduct(userId: string, dto: CreateProductDto) {
    const store = await this.getOrCreateStore(userId);
    await this.ensureUniqueProductSlug(store.id, dto.slug);

    return this.prisma.product.create({
      data: {
        storeId: store.id,
        creatorId: userId,
        title: dto.title,
        slug: this.slugify(dto.slug),
        description: dto.description,
        shortDescription: dto.shortDescription,
        price: dto.price,
        currency: (dto.currency || store.currency).toLowerCase(),
        status: dto.status || 'DRAFT',
        assetUrl: dto.assetUrl,
        previewUrl: dto.previewUrl,
        coverImageUrl: dto.coverImageUrl,
        publishedAt: dto.status === 'PUBLISHED' ? new Date() : null,
      },
    });
  }

  async updateProduct(productId: string, userId: string, dto: UpdateProductDto) {
    const existing = await this.getCreatorProduct(productId, userId);
    if (dto.slug && dto.slug !== existing.slug) {
      await this.ensureUniqueProductSlug(existing.storeId, dto.slug, productId);
    }

    return this.prisma.product.update({
      where: { id: productId },
      data: {
        title: dto.title,
        slug: dto.slug ? this.slugify(dto.slug) : undefined,
        description: dto.description,
        shortDescription: dto.shortDescription,
        price: dto.price,
        currency: dto.currency?.toLowerCase(),
        status: dto.status,
        assetUrl: dto.assetUrl,
        previewUrl: dto.previewUrl,
        coverImageUrl: dto.coverImageUrl,
        publishedAt: dto.status === 'PUBLISHED' && !existing.publishedAt ? new Date() : existing.publishedAt,
      },
    });
  }

  async deleteProduct(productId: string, userId: string) {
    await this.getCreatorProduct(productId, userId);
    await this.prisma.product.delete({ where: { id: productId } });
    return { message: 'Product deleted' };
  }

  async listCreatorCourses(userId: string) {
    return this.prisma.course.findMany({
      where: { creatorId: userId },
      include: {
        lessons: { orderBy: { position: 'asc' } },
        enrollments: { select: { id: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createCourse(userId: string, dto: CreateCourseDto) {
    const store = await this.getOrCreateStore(userId);
    await this.ensureUniqueCourseSlug(store.id, dto.slug);

    return this.prisma.course.create({
      data: {
        storeId: store.id,
        creatorId: userId,
        title: dto.title,
        slug: this.slugify(dto.slug),
        description: dto.description,
        shortDescription: dto.shortDescription,
        price: dto.price,
        currency: (dto.currency || store.currency).toLowerCase(),
        status: dto.status || 'DRAFT',
        coverImageUrl: dto.coverImageUrl,
        introVideoUrl: dto.introVideoUrl,
        publishedAt: dto.status === 'PUBLISHED' ? new Date() : null,
        lessons: dto.lessons?.length
          ? {
              create: dto.lessons.map((lesson) => ({
                title: lesson.title,
                slug: this.slugify(lesson.slug),
                description: lesson.description,
                content: lesson.content,
                videoUrl: lesson.videoUrl,
                resourceUrl: lesson.resourceUrl,
                position: lesson.position,
                isPreview: lesson.isPreview ?? false,
              })),
            }
          : undefined,
      },
      include: { lessons: { orderBy: { position: 'asc' } } },
    });
  }

  async updateCourse(courseId: string, userId: string, dto: UpdateCourseDto) {
    const existing = await this.getCreatorCourse(courseId, userId);
    if (dto.slug && dto.slug !== existing.slug) {
      await this.ensureUniqueCourseSlug(existing.storeId, dto.slug, courseId);
    }

    return this.prisma.course.update({
      where: { id: courseId },
      data: {
        title: dto.title,
        slug: dto.slug ? this.slugify(dto.slug) : undefined,
        description: dto.description,
        shortDescription: dto.shortDescription,
        price: dto.price,
        currency: dto.currency?.toLowerCase(),
        status: dto.status,
        coverImageUrl: dto.coverImageUrl,
        introVideoUrl: dto.introVideoUrl,
        publishedAt: dto.status === 'PUBLISHED' && !existing.publishedAt ? new Date() : existing.publishedAt,
      },
      include: { lessons: { orderBy: { position: 'asc' } } },
    });
  }

  async deleteCourse(courseId: string, userId: string) {
    await this.getCreatorCourse(courseId, userId);
    await this.prisma.course.delete({ where: { id: courseId } });
    return { message: 'Course deleted' };
  }

  async addLesson(courseId: string, userId: string, dto: CreateLessonDto) {
    await this.getCreatorCourse(courseId, userId);
    return this.prisma.courseLesson.create({
      data: {
        courseId,
        title: dto.title,
        slug: this.slugify(dto.slug),
        description: dto.description,
        content: dto.content,
        videoUrl: dto.videoUrl,
        resourceUrl: dto.resourceUrl,
        position: dto.position,
        isPreview: dto.isPreview ?? false,
      },
    });
  }

  async updateLesson(courseId: string, lessonId: string, userId: string, dto: UpdateLessonDto) {
    await this.getCreatorCourse(courseId, userId);
    await this.getCourseLesson(courseId, lessonId);
    return this.prisma.courseLesson.update({
      where: { id: lessonId },
      data: {
        title: dto.title,
        slug: this.slugify(dto.slug),
        description: dto.description,
        content: dto.content,
        videoUrl: dto.videoUrl,
        resourceUrl: dto.resourceUrl,
        position: dto.position,
        isPreview: dto.isPreview ?? false,
      },
    });
  }

  async deleteLesson(courseId: string, lessonId: string, userId: string) {
    await this.getCreatorCourse(courseId, userId);
    await this.getCourseLesson(courseId, lessonId);
    await this.prisma.courseLesson.delete({ where: { id: lessonId } });
    return { message: 'Lesson deleted' };
  }

  async getPublicProduct(storeSlug: string, productSlug: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        slug: productSlug,
        status: 'PUBLISHED',
        store: { slug: storeSlug, isPublished: true },
      },
      include: {
        store: true,
        creator: { select: { id: true, name: true, avatarUrl: true, bio: true } },
        _count: { select: { accesses: true } },
      },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async getPublicCourse(storeSlug: string, courseSlug: string) {
    const course = await this.prisma.course.findFirst({
      where: {
        slug: courseSlug,
        status: 'PUBLISHED',
        store: { slug: storeSlug, isPublished: true },
      },
      include: {
        store: true,
        creator: { select: { id: true, name: true, avatarUrl: true, bio: true } },
        lessons: {
          where: { isPreview: true },
          orderBy: { position: 'asc' },
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            position: true,
            isPreview: true,
          },
        },
        _count: { select: { enrollments: true, lessons: true } },
      },
    });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async createCheckoutSession(userId: string, dto: CreateCommerceCheckoutDto) {
    const buyer = await this.prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, name: true, subscription: true } });
    if (!buyer) throw new NotFoundException('Buyer not found');

    const item = await this.resolveCheckoutItem(dto);
    if (item.creatorId === userId) {
      throw new BadRequestException('You cannot purchase your own item');
    }

    const existingAccess = dto.itemType === 'PRODUCT'
      ? await this.prisma.productAccess.findUnique({ where: { productId_buyerId: { productId: item.id, buyerId: userId } } })
      : await this.prisma.courseEnrollment.findUnique({ where: { courseId_buyerId: { courseId: item.id, buyerId: userId } } });

    if (existingAccess) {
      throw new BadRequestException('You already own this item');
    }

    const frontendUrl = sanitizeFrontendUrl(this.config.get<string>('FRONTEND_URL'));
    let customerId = buyer.subscription?.stripeCustomerId || null;
    if (!customerId) {
      const customer = await this.stripe.customers.create({ email: buyer.email, name: buyer.name, metadata: { userId } });
      customerId = customer.id;
      await this.prisma.subscription.update({ where: { userId }, data: { stripeCustomerId: customerId } });
    }

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        quantity: 1,
        price_data: {
          currency: item.currency,
          unit_amount: item.price,
          product_data: {
            name: item.title,
            description: item.shortDescription || item.description.slice(0, 500),
          },
        },
      }],
      success_url: `${frontendUrl}/dashboard/buyer?success=true`,
      cancel_url: `${frontendUrl}/store/${item.store.slug}/${dto.itemType === 'PRODUCT' ? 'products' : 'courses'}/${item.slug}?canceled=true`,
      metadata: {
        itemType: dto.itemType,
        itemId: item.id,
        storeId: item.storeId,
        creatorId: item.creatorId,
        buyerId: userId,
      },
    });

    return { url: session.url, sessionId: session.id };
  }

  async handleWebhook(rawBody: Buffer, signature: string) {
    const webhookSecret = this.config.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new BadRequestException('STRIPE_WEBHOOK_SECRET is required for commerce webhooks');
    }

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch {
      throw new BadRequestException('Invalid webhook signature');
    }

    switch (event.type) {
      case 'checkout.session.completed':
        await this.fulfillCheckout(event.data.object as Stripe.Checkout.Session);
        break;
      case 'checkout.session.async_payment_failed':
        await this.markPurchaseFailed(event.data.object as Stripe.Checkout.Session);
        break;
      case 'charge.refunded':
        await this.handleRefund(event.data.object as Stripe.Charge);
        break;
      default:
        break;
    }

    return { received: true };
  }

  async getBuyerDashboard(userId: string) {
    const [productAccesses, courseEnrollments, recentPurchases] = await Promise.all([
      this.prisma.productAccess.findMany({
        where: { buyerId: userId },
        include: {
          product: {
            include: {
              store: { select: { name: true, slug: true } },
              creator: { select: { name: true } },
            },
          },
        },
        orderBy: { grantedAt: 'desc' },
      }),
      this.prisma.courseEnrollment.findMany({
        where: { buyerId: userId },
        include: {
          course: {
            include: {
              store: { select: { name: true, slug: true } },
              creator: { select: { name: true } },
              lessons: { orderBy: { position: 'asc' }, select: { id: true, title: true, position: true } },
            },
          },
        },
        orderBy: { enrolledAt: 'desc' },
      }),
      this.prisma.commercePurchase.findMany({
        where: { buyerId: userId, status: { in: ['PAID', 'FULFILLED'] } },
        include: { items: true },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
    ]);

    return {
      products: productAccesses,
      courses: courseEnrollments,
      recentPurchases,
    };
  }

  async getRevenueOverview(userId: string, query: RevenueQueryDto) {
    const days = query.days || 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const purchases = await this.prisma.commercePurchase.findMany({
      where: {
        creatorId: userId,
        status: { in: ['PAID', 'FULFILLED'] },
        createdAt: { gte: since },
      },
      include: { items: true },
      orderBy: { createdAt: 'asc' },
    });

    const grossRevenue = purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);
    const orderCount = purchases.length;
    const productRevenue = purchases
      .flatMap((purchase) => purchase.items)
      .filter((item) => item.itemType === 'PRODUCT')
      .reduce((sum, item) => sum + item.priceSnapshot, 0);
    const courseRevenue = purchases
      .flatMap((purchase) => purchase.items)
      .filter((item) => item.itemType === 'COURSE')
      .reduce((sum, item) => sum + item.priceSnapshot, 0);

    const seriesMap = new Map<string, number>();
    for (const purchase of purchases) {
      const key = purchase.createdAt.toISOString().slice(0, 10);
      seriesMap.set(key, (seriesMap.get(key) || 0) + purchase.totalAmount);
    }

    return {
      currency: purchases[0]?.currency || 'usd',
      grossRevenue,
      orderCount,
      productRevenue,
      courseRevenue,
      averageOrderValue: orderCount ? Math.round(grossRevenue / orderCount) : 0,
      series: Array.from(seriesMap.entries()).map(([date, amount]) => ({ date, amount })),
      recentSales: purchases.slice(-10).reverse(),
    };
  }

  async getProductDownload(productId: string, userId: string) {
    const access = await this.prisma.productAccess.findUnique({
      where: { productId_buyerId: { productId, buyerId: userId } },
      include: { product: true },
    });
    if (!access) throw new ForbiddenException('Purchase required');

    await this.prisma.productAccess.update({
      where: { id: access.id },
      data: { lastDownloadedAt: new Date() },
    });

    return {
      productId: access.productId,
      title: access.product.title,
      assetUrl: access.product.assetUrl,
      previewUrl: access.product.previewUrl,
    };
  }

  async getOwnedCourse(courseId: string, userId: string) {
    const enrollment = await this.prisma.courseEnrollment.findUnique({
      where: { courseId_buyerId: { courseId, buyerId: userId } },
      include: {
        course: {
          include: {
            store: true,
            creator: { select: { name: true, avatarUrl: true } },
            lessons: { orderBy: { position: 'asc' } },
          },
        },
        lessonProgress: true,
      },
    });
    if (!enrollment) throw new ForbiddenException('Purchase required');

    await this.prisma.courseEnrollment.update({
      where: { id: enrollment.id },
      data: { lastAccessedAt: new Date() },
    });

    return enrollment;
  }

  async getOwnedLesson(courseId: string, lessonId: string, userId: string) {
    const enrollment = await this.prisma.courseEnrollment.findUnique({
      where: { courseId_buyerId: { courseId, buyerId: userId } },
      include: {
        course: {
          include: {
            lessons: {
              where: { id: lessonId },
            },
          },
        },
      },
    });
    if (!enrollment || !enrollment.course.lessons.length) {
      throw new NotFoundException('Lesson not found');
    }

    const lesson = enrollment.course.lessons[0];
    await this.prisma.courseEnrollment.update({
      where: { id: enrollment.id },
      data: { lastAccessedAt: new Date() },
    });

    await this.prisma.courseLessonProgress.upsert({
      where: { enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId } },
      create: { enrollmentId: enrollment.id, lessonId, lastViewedAt: new Date() },
      update: { lastViewedAt: new Date() },
    });

    return lesson;
  }

  async updateLessonProgress(courseId: string, lessonId: string, userId: string, dto: UpdateLessonProgressDto) {
    const enrollment = await this.prisma.courseEnrollment.findUnique({
      where: { courseId_buyerId: { courseId, buyerId: userId } },
      include: { course: { select: { lessons: { select: { id: true } } } } },
    });
    if (!enrollment) throw new ForbiddenException('Purchase required');

    await this.prisma.courseLessonProgress.upsert({
      where: { enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId } },
      create: {
        enrollmentId: enrollment.id,
        lessonId,
        lastViewedAt: new Date(),
        completedAt: dto.completed ? new Date() : null,
      },
      update: {
        lastViewedAt: new Date(),
        completedAt: dto.completed ? new Date() : null,
      },
    });

    const completedCount = await this.prisma.courseLessonProgress.count({
      where: { enrollmentId: enrollment.id, completedAt: { not: null } },
    });
    const totalLessons = enrollment.course.lessons.length || 1;
    const progressPercent = Math.round((completedCount / totalLessons) * 100);

    await this.prisma.courseEnrollment.update({
      where: { id: enrollment.id },
      data: { progressPercent, lastAccessedAt: new Date() },
    });

    return { progressPercent };
  }

  private async resolveCheckoutItem(dto: CreateCommerceCheckoutDto) {
    if (dto.itemType === 'PRODUCT') {
      if (!dto.productId) throw new BadRequestException('productId is required');
      const product = await this.prisma.product.findUnique({
        where: { id: dto.productId },
        include: { store: true },
      });
      if (!product || product.status !== 'PUBLISHED' || !product.store.isPublished) {
        throw new NotFoundException('Product not available');
      }
      return product;
    }

    if (!dto.courseId) throw new BadRequestException('courseId is required');
    const course = await this.prisma.course.findUnique({
      where: { id: dto.courseId },
      include: { store: true },
    });
    if (!course || course.status !== 'PUBLISHED' || !course.store.isPublished) {
      throw new NotFoundException('Course not available');
    }
    return course;
  }

  private async fulfillCheckout(session: Stripe.Checkout.Session) {
    const metadata = session.metadata;
    if (!metadata?.itemId || !metadata.itemType || !metadata.storeId || !metadata.creatorId || !metadata.buyerId) {
      throw new BadRequestException('Missing checkout metadata');
    }

    const existing = await this.prisma.commercePurchase.findUnique({
      where: { stripeCheckoutSessionId: session.id },
    });
    if (existing?.status === 'FULFILLED') return existing;

    const item = metadata.itemType === 'PRODUCT'
      ? await this.prisma.product.findUnique({ where: { id: metadata.itemId } })
      : await this.prisma.course.findUnique({ where: { id: metadata.itemId } });
    if (!item) throw new NotFoundException('Purchased item not found');

    await this.prisma.$transaction(async (tx) => {
      const purchase = existing
        ? await tx.commercePurchase.update({
            where: { id: existing.id },
            data: {
              stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : existing.stripePaymentIntentId,
              stripeCustomerId: typeof session.customer === 'string' ? session.customer : existing.stripeCustomerId,
              totalAmount: session.amount_total || existing.totalAmount,
              currency: session.currency || existing.currency,
              status: 'FULFILLED',
              fulfilledAt: new Date(),
            },
          })
        : await tx.commercePurchase.create({
            data: {
              storeId: metadata.storeId,
              creatorId: metadata.creatorId,
              buyerId: metadata.buyerId,
              stripeCheckoutSessionId: session.id,
              stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : null,
              stripeCustomerId: typeof session.customer === 'string' ? session.customer : null,
              totalAmount: session.amount_total || item.price,
              currency: session.currency || item.currency,
              status: 'FULFILLED',
              fulfilledAt: new Date(),
            },
          });

      const existingItem = await tx.commercePurchaseItem.findFirst({ where: { purchaseId: purchase.id } });
      if (!existingItem) {
        await tx.commercePurchaseItem.create({
          data: {
            purchaseId: purchase.id,
            itemType: metadata.itemType as 'PRODUCT' | 'COURSE',
            productId: metadata.itemType === 'PRODUCT' ? item.id : null,
            courseId: metadata.itemType === 'COURSE' ? item.id : null,
            titleSnapshot: item.title,
            priceSnapshot: item.price,
          },
        });
      }

      if (metadata.itemType === 'PRODUCT') {
        await tx.productAccess.upsert({
          where: { productId_buyerId: { productId: item.id, buyerId: metadata.buyerId } },
          create: { productId: item.id, buyerId: metadata.buyerId, purchaseId: purchase.id },
          update: { purchaseId: purchase.id },
        });
      } else {
        await tx.courseEnrollment.upsert({
          where: { courseId_buyerId: { courseId: item.id, buyerId: metadata.buyerId } },
          create: { courseId: item.id, buyerId: metadata.buyerId, purchaseId: purchase.id },
          update: { purchaseId: purchase.id },
        });
      }
    });
  }

  private async markPurchaseFailed(session: Stripe.Checkout.Session) {
    await this.prisma.commercePurchase.updateMany({
      where: { stripeCheckoutSessionId: session.id },
      data: { status: 'FAILED' },
    });
  }

  private async handleRefund(charge: Stripe.Charge) {
    if (!charge.payment_intent) return;
    const purchase = await this.prisma.commercePurchase.findFirst({
      where: { stripePaymentIntentId: String(charge.payment_intent) },
      include: { items: true, productAccesses: true, courseEnrollments: true },
    });
    if (!purchase) return;

    await this.prisma.$transaction(async (tx) => {
      await tx.commercePurchase.update({
        where: { id: purchase.id },
        data: { status: 'REFUNDED', refundedAt: new Date() },
      });
      if (purchase.productAccesses.length) {
        await tx.productAccess.deleteMany({ where: { purchaseId: purchase.id } });
      }
      if (purchase.courseEnrollments.length) {
        const enrollmentIds = purchase.courseEnrollments.map((enrollment) => enrollment.id);
        await tx.courseLessonProgress.deleteMany({ where: { enrollmentId: { in: enrollmentIds } } });
        await tx.courseEnrollment.deleteMany({ where: { purchaseId: purchase.id } });
      }
    });
  }

  private async getCreatorProduct(productId: string, userId: string) {
    const product = await this.prisma.product.findFirst({ where: { id: productId, creatorId: userId } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  private async getCreatorCourse(courseId: string, userId: string) {
    const course = await this.prisma.course.findFirst({ where: { id: courseId, creatorId: userId } });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  private async getCourseLesson(courseId: string, lessonId: string) {
    const lesson = await this.prisma.courseLesson.findFirst({ where: { id: lessonId, courseId } });
    if (!lesson) throw new NotFoundException('Lesson not found');
    return lesson;
  }

  private async ensureUniqueStoreSlug(slug: string, ownerId: string) {
    const normalized = this.slugify(slug);
    const existing = await this.prisma.store.findUnique({ where: { slug: normalized } });
    if (existing && existing.ownerId !== ownerId) {
      throw new BadRequestException('Store slug already in use');
    }
  }

  private async ensureUniqueProductSlug(storeId: string, slug: string, productId?: string) {
    const existing = await this.prisma.product.findFirst({ where: { storeId, slug: this.slugify(slug) } });
    if (existing && existing.id !== productId) {
      throw new BadRequestException('Product slug already in use');
    }
  }

  private async ensureUniqueCourseSlug(storeId: string, slug: string, courseId?: string) {
    const existing = await this.prisma.course.findFirst({ where: { storeId, slug: this.slugify(slug) } });
    if (existing && existing.id !== courseId) {
      throw new BadRequestException('Course slug already in use');
    }
  }

  private slugify(value: string) {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80);
  }
}