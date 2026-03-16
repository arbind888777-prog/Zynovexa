import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { COMMERCE_OWNER_RESOURCE, CommerceOwnerResource } from '../commerce.constants';

@Injectable()
export class StoreOwnerGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const resource = this.reflector.get<CommerceOwnerResource>(COMMERCE_OWNER_RESOURCE, context.getHandler());
    if (!resource) return true;

    const req = context.switchToHttp().getRequest();
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException();

    let ownerId: string | null = null;

    if (resource === 'product') {
      const product = await this.prisma.product.findUnique({ where: { id: req.params.productId || req.params.id }, select: { creatorId: true } });
      ownerId = product?.creatorId || null;
    }

    if (resource === 'course') {
      const course = await this.prisma.course.findUnique({ where: { id: req.params.courseId || req.params.id }, select: { creatorId: true } });
      ownerId = course?.creatorId || null;
    }

    if (resource === 'lesson') {
      const lesson = await this.prisma.courseLesson.findUnique({
        where: { id: req.params.lessonId },
        select: { course: { select: { creatorId: true } } },
      });
      ownerId = lesson?.course.creatorId || null;
    }

    if (!ownerId || ownerId !== userId) {
      throw new ForbiddenException('You do not have access to this resource');
    }

    return true;
  }
}