import { CanActivate, ExecutionContext, ForbiddenException, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';

export const PLAN_KEY = 'requiredPlan';
export const RequirePlan = (...plans: string[]) => SetMetadata(PLAN_KEY, plans);

const PLAN_HIERARCHY = ['FREE', 'STARTER', 'PRO', 'GROWTH', 'BUSINESS'];

@Injectable()
export class PlanGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPlans = this.reflector.getAllAndOverride<string[]>(PLAN_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPlans || requiredPlans.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    if (!userId) throw new ForbiddenException('Authentication required');

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true },
    });

    if (!user) throw new ForbiddenException('User not found');

    const userPlanLevel = PLAN_HIERARCHY.indexOf(user.plan);
    const minRequired = Math.min(...requiredPlans.map((p) => PLAN_HIERARCHY.indexOf(p.toUpperCase())));

    if (userPlanLevel < minRequired) {
      throw new ForbiddenException({
        message: 'Plan upgrade required',
        requiredPlan: requiredPlans[0],
        currentPlan: user.plan,
        upgradeUrl: '/settings?tab=billing',
      });
    }

    return true;
  }
}
