import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) {
      return false;
    }

    request.user = await this.validateToken(request.headers.authorization);

    return true;
  }

  private async validateToken(authorization: string) {
    if (authorization.split(' ')[0] !== 'Bearer') {
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    }

    const token = authorization.split(' ')[1];

    try {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);

      return decoded;
    } catch (error) {
      const message = 'Token error: ' + (error.message || error.name);

      throw new HttpException(message, HttpStatus.FORBIDDEN);
    }
  }
}
