import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductAccessGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException();

    const productId = req.params.productId;
    const access = await this.prisma.productAccess.findUnique({
      where: { productId_buyerId: { productId, buyerId: userId } },
    });

    if (!access) {
      throw new ForbiddenException('Purchase required to access this product');
    }

    return true;
  }
}