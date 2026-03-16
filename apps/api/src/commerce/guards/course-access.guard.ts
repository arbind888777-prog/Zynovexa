import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CourseAccessGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException();

    const courseId = req.params.courseId;
    const enrollment = await this.prisma.courseEnrollment.findUnique({
      where: { courseId_buyerId: { courseId, buyerId: userId } },
    });

    if (!enrollment) {
      throw new ForbiddenException('Purchase required to access this course');
    }

    return true;
  }
}