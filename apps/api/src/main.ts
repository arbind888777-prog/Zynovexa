import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { GlobalExceptionFilter, LoggingInterceptor, TransformInterceptor, TimeoutInterceptor } from './common';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';

const isProduction = process.env.NODE_ENV === 'production';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
    logger: isProduction
      ? ['error', 'warn', 'log']
      : ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Security & Performance
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(compression());
  app.use(cookieParser());

  // CORS
  app.enableCors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global prefix & validation
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global filters & interceptors
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
    new TimeoutInterceptor(),
  );

  // Serve static uploads
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });

  // Swagger Docs
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Zynovexa API')
      .setDescription(
        `## Creator Platform API — v1\n\n` +
        `AI-powered content creator platform with:\n` +
        `- 🔐 Authentication (JWT + Google OAuth)\n` +
        `- 📝 Post Management & Scheduling\n` +
        `- 🤖 AI Content Generation (GPT-4o + DALL-E 3)\n` +
        `- 📊 Analytics & Video Analytics\n` +
        `- 💰 Monetization & Brand Deals\n` +
        `- 🛒 Commerce (Products, Courses, Buyer Access)\n` +
        `- 🔍 SEO Analysis\n` +
        `- 📁 Media Library & File Uploads\n` +
        `- 🔔 Real-time Notifications (WebSocket)\n` +
        `- ⚡ Queue-based Post Publishing\n` +
        `- 📧 Transactional Emails\n` +
        `- 👑 Admin Panel`,
      )
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('Auth', 'Authentication & Authorization')
      .addTag('Users', 'User Profile & Settings')
      .addTag('Posts', 'Content Management & Scheduling')
      .addTag('Accounts', 'Social Media Account Connections')
      .addTag('Analytics', 'Performance Metrics & Insights')
      .addTag('AI', 'AI-Powered Content Generation')
      .addTag('Video Analytics', 'Video Performance Tracking')
      .addTag('SEO', 'SEO Analysis & Optimization')
      .addTag('Monetization', 'Brand Deals & Earnings')
      .addTag('Commerce', 'Products, Courses, Checkout & Buyer Access')
      .addTag('Subscriptions', 'Plans & Stripe Billing')
      .addTag('Uploads', 'File Upload & Media Library')
      .addTag('Notifications', 'User Notifications')
      .addTag('Queue (Admin)', 'Job Queue Management')
      .addTag('Mail (Admin)', 'Email Service')
      .addTag('Admin', 'Admin Panel Operations')
      .addTag('Health', 'System Health Checks')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      customSiteTitle: 'Zynovexa API Docs',
      customCss: '.swagger-ui .topbar { display: none }',
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'none',
        filter: true,
        tagsSorter: 'alpha',
      },
    });
  }

  // Graceful shutdown
  app.enableShutdownHooks();

  const port = process.env.PORT || 4000;
  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(`Zynovexa API running on http://localhost:${port}/api`);
  if (!isProduction) {
    logger.log(`Swagger docs: http://localhost:${port}/api/docs`);
    logger.log(`WebSocket: ws://localhost:${port}/ws`);
  }
}

bootstrap().catch((err) => {
  console.error('Failed to start Zynovexa API:', err);
  process.exit(1);
});
