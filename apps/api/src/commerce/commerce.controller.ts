import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  RawBodyRequest,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request as ExpressRequest, Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommerceService } from './commerce.service';
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
import { CommerceOwner } from './decorators/commerce-owner.decorator';
import { StoreOwnerGuard } from './guards/store-owner.guard';
import { ProductAccessGuard } from './guards/product-access.guard';
import { CourseAccessGuard } from './guards/course-access.guard';

@ApiTags('Commerce')
@Controller('commerce')
export class CommerceController {
  constructor(private commerceService: CommerceService) {}

  @Get('public/stores/:storeSlug')
  @ApiOperation({ summary: 'Get public store with published products and courses' })
  getPublicStore(@Param('storeSlug') storeSlug: string) {
    return this.commerceService.getPublicStore(storeSlug);
  }

  @Get('public/handle/:handle')
  @ApiOperation({ summary: 'Get public store by creator handle (e.g. techmaster436)' })
  getPublicStoreByHandle(@Param('handle') handle: string) {
    return this.commerceService.getPublicStoreByHandle(handle);
  }

  @Get('public/product/:productId')
  @ApiOperation({ summary: 'Get a public product by ID' })
  getPublicProductById(@Param('productId') productId: string) {
    return this.commerceService.getPublicProductById(productId);
  }

  @Get('public/stores/:storeSlug/products/:productSlug')
  @ApiOperation({ summary: 'Get a public product page by store and product slug' })
  getPublicProduct(@Param('storeSlug') storeSlug: string, @Param('productSlug') productSlug: string) {
    return this.commerceService.getPublicProduct(storeSlug, productSlug);
  }

  @Get('public/stores/:storeSlug/courses/:courseSlug')
  @ApiOperation({ summary: 'Get a public course landing page by store and course slug' })
  getPublicCourse(@Param('storeSlug') storeSlug: string, @Param('courseSlug') courseSlug: string) {
    return this.commerceService.getPublicCourse(storeSlug, courseSlug);
  }

  @Post('webhook')
  @HttpCode(200)
  @ApiExcludeEndpoint()
  handleWebhook(@Req() req: RawBodyRequest<ExpressRequest>, @Headers('stripe-signature') sig: string) {
    return this.commerceService.handleWebhook(req.rawBody as Buffer, sig);
  }

  @Post('webhook/razorpay')
  @HttpCode(200)
  @ApiExcludeEndpoint()
  handleRazorpayWebhook(@Body() body: any, @Headers('x-razorpay-signature') sig: string) {
    return this.commerceService.handleRazorpayWebhook(body, sig);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('checkout/razorpay')
  @ApiOperation({ summary: 'Create a Razorpay checkout order for a product or course' })
  createRazorpayCheckout(@Request() req, @Body() dto: CreateCommerceCheckoutDto) {
    return this.commerceService.createRazorpayCheckout(req.user.id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('store')
  @ApiOperation({ summary: 'Get or create the authenticated creator store' })
  getStore(@Request() req) {
    return this.commerceService.getOrCreateStore(req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('store')
  @ApiOperation({ summary: 'Create or update the authenticated creator store' })
  upsertStore(@Request() req, @Body() dto: UpsertStoreDto) {
    return this.commerceService.upsertStore(req.user.id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('products')
  @ApiOperation({ summary: 'List products for the authenticated creator' })
  getCreatorProducts(@Request() req) {
    return this.commerceService.listCreatorProducts(req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('products')
  @ApiOperation({ summary: 'Create a new digital product' })
  createProduct(@Request() req, @Body() dto: CreateProductDto) {
    return this.commerceService.createProduct(req.user.id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, StoreOwnerGuard)
  @CommerceOwner('product')
  @Put('products/:productId')
  @ApiOperation({ summary: 'Update a creator-owned digital product' })
  updateProduct(@Request() req, @Param('productId') productId: string, @Body() dto: UpdateProductDto) {
    return this.commerceService.updateProduct(productId, req.user.id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, StoreOwnerGuard)
  @CommerceOwner('product')
  @Delete('products/:productId')
  @ApiOperation({ summary: 'Delete a creator-owned digital product' })
  deleteProduct(@Request() req, @Param('productId') productId: string) {
    return this.commerceService.deleteProduct(productId, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('courses')
  @ApiOperation({ summary: 'List courses for the authenticated creator' })
  getCreatorCourses(@Request() req) {
    return this.commerceService.listCreatorCourses(req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('courses')
  @ApiOperation({ summary: 'Create a new course' })
  createCourse(@Request() req, @Body() dto: CreateCourseDto) {
    return this.commerceService.createCourse(req.user.id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, StoreOwnerGuard)
  @CommerceOwner('course')
  @Put('courses/:courseId')
  @ApiOperation({ summary: 'Update a creator-owned course' })
  updateCourse(@Request() req, @Param('courseId') courseId: string, @Body() dto: UpdateCourseDto) {
    return this.commerceService.updateCourse(courseId, req.user.id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, StoreOwnerGuard)
  @CommerceOwner('course')
  @Delete('courses/:courseId')
  @ApiOperation({ summary: 'Delete a creator-owned course' })
  deleteCourse(@Request() req, @Param('courseId') courseId: string) {
    return this.commerceService.deleteCourse(courseId, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, StoreOwnerGuard)
  @CommerceOwner('course')
  @Post('courses/:courseId/lessons')
  @ApiOperation({ summary: 'Add a lesson to a creator-owned course' })
  addLesson(@Request() req, @Param('courseId') courseId: string, @Body() dto: CreateLessonDto) {
    return this.commerceService.addLesson(courseId, req.user.id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, StoreOwnerGuard)
  @CommerceOwner('lesson')
  @Put('courses/:courseId/lessons/:lessonId')
  @ApiOperation({ summary: 'Update a creator-owned course lesson' })
  updateLesson(
    @Request() req,
    @Param('courseId') courseId: string,
    @Param('lessonId') lessonId: string,
    @Body() dto: UpdateLessonDto,
  ) {
    return this.commerceService.updateLesson(courseId, lessonId, req.user.id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, StoreOwnerGuard)
  @CommerceOwner('lesson')
  @Delete('courses/:courseId/lessons/:lessonId')
  @ApiOperation({ summary: 'Delete a creator-owned course lesson' })
  deleteLesson(@Request() req, @Param('courseId') courseId: string, @Param('lessonId') lessonId: string) {
    return this.commerceService.deleteLesson(courseId, lessonId, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  @ApiOperation({ summary: 'Create a Stripe checkout session for a public product or course' })
  createCheckout(@Request() req, @Body() dto: CreateCommerceCheckoutDto) {
    return this.commerceService.createCheckoutSession(req.user.id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('revenue')
  @ApiOperation({ summary: 'Get creator revenue reporting for digital sales' })
  getRevenue(@Request() req, @Query() query: RevenueQueryDto) {
    return this.commerceService.getRevenueOverview(req.user.id, query);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('buyers')
  @ApiOperation({ summary: 'Get all purchases/buyers for the creator (sales table)' })
  getCreatorBuyers(@Request() req, @Query('page') page?: string) {
    return this.commerceService.getCreatorBuyers(req.user.id, parseInt(page || '1', 10));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('buyer/dashboard')
  @ApiOperation({ summary: 'Get the authenticated buyer dashboard and owned purchases' })
  getBuyerDashboard(@Request() req) {
    return this.commerceService.getBuyerDashboard(req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, ProductAccessGuard)
  @Get('buyer/products/:productId/download')
  @ApiOperation({ summary: 'Get a gated download URL for a purchased digital product' })
  getProductDownload(@Request() req, @Param('productId') productId: string) {
    return this.commerceService.getProductDownload(productId, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, CourseAccessGuard)
  @Get('buyer/courses/:courseId')
  @ApiOperation({ summary: 'Get an owned course with gated lessons for the authenticated buyer' })
  getOwnedCourse(@Request() req, @Param('courseId') courseId: string) {
    return this.commerceService.getOwnedCourse(courseId, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, CourseAccessGuard)
  @Get('buyer/courses/:courseId/lessons/:lessonId')
  @ApiOperation({ summary: 'Get a gated lesson for an owned course' })
  getOwnedLesson(@Request() req, @Param('courseId') courseId: string, @Param('lessonId') lessonId: string) {
    return this.commerceService.getOwnedLesson(courseId, lessonId, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, CourseAccessGuard)
  @Post('buyer/courses/:courseId/lessons/:lessonId/progress')
  @ApiOperation({ summary: 'Update lesson progress for an owned course' })
  updateLessonProgress(
    @Request() req,
    @Param('courseId') courseId: string,
    @Param('lessonId') lessonId: string,
    @Body() dto: UpdateLessonProgressDto,
  ) {
    return this.commerceService.updateLessonProgress(courseId, lessonId, req.user.id, dto);
  }

  @Get('video/:lessonId')
  @ApiOperation({ summary: 'Resolve a signed video URL and redirect to the actual video' })
  async getVideoStream(
    @Param('lessonId') lessonId: string,
    @Query('token') token: string,
    @Res() res: Response,
  ) {
    const videoUrl = await this.commerceService.resolveVideoUrl(lessonId, token);
    return res.redirect(videoUrl);
  }
}