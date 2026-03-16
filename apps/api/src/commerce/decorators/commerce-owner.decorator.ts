import { SetMetadata } from '@nestjs/common';
import { COMMERCE_OWNER_RESOURCE, CommerceOwnerResource } from '../commerce.constants';

export const CommerceOwner = (resource: CommerceOwnerResource) => SetMetadata(COMMERCE_OWNER_RESOURCE, resource);