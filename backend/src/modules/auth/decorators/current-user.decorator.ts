import { ExecutionContext, createParamDecorator } from '@nestjs/common'

import type { JwtPayload } from '../auth.types'

interface RequestWithUser {
  user: JwtPayload
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): JwtPayload => {
    const request = context.switchToHttp().getRequest<RequestWithUser>()

    return request.user
  },
)
