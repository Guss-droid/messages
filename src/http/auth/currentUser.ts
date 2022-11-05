import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { verify } from 'jsonwebtoken';

export interface IAuthUser {
  sub: any;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): IAuthUser => {
    const req = context.switchToHttp().getRequest();
    const auth: string = req.headers['authorization'];
    const token = auth.replace('Bearer ', '');

    const { sub } = verify(token, process.env.TOKEN_SECRET);

    // console.log(sub);

    return { sub: sub };
  },
);
