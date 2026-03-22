import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CommerceService } from './commerce.service';
import { CommerceController } from './commerce.controller';
import { StoreOwnerGuard } from './guards/store-owner.guard';
import { ProductAccessGuard } from './guards/product-access.guard';
import { CourseAccessGuard } from './guards/course-access.guard';

@Module({
  imports: [JwtModule.register({})],
  providers: [CommerceService, StoreOwnerGuard, ProductAccessGuard, CourseAccessGuard],
  controllers: [CommerceController],
  exports: [CommerceService],
})
export class CommerceModule {}