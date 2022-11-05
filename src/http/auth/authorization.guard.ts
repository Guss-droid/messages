import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const auth: string = req.headers['authorization'];

    if (!auth) {
      throw new Error('Token not provided');
    }

    const token = auth.replace('Bearer ', '');
    try {
      verify(token, process.env.TOKEN_SECRET);

      return true;
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }
}
