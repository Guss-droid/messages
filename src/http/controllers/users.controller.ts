import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from 'src/services/users.service';

interface ICreateUser {
  email: string;
  name: string;
  password: string;
}

interface ILoginUser {
  email: string;
  password: string;
}

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('account')
  async createAccount(@Body() { email, name, password }: ICreateUser) {
    return await this.usersService.createUser({ email, name, password });
  }

  @Post('login')
  async login(@Body() { email, password }: ILoginUser) {
    return await this.usersService.login({ email, password });
  }
}
