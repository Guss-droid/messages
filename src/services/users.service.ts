import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';

interface ICreateUserData {
  name: string;
  email: string;
  password: string;
}

interface ILoginData {
  email: string;
  password: string;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser({ email, name, password }: ICreateUserData) {
    if (!email || !password) {
      throw new Error('Missing infos');
    }

    const userAlreadyExists = await this.prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (userAlreadyExists) {
      throw new Error('User already exists!');
    }

    const passwordHash = await hash(password, 12);

    await this.prisma.users.create({
      data: {
        email,
        name,
        password: passwordHash,
      },
    });

    return { message: 'Count created successfully' };
  }

  async login({ email, password }: ILoginData) {
    const userExists = await this.prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (!userExists) {
      throw new Error('Email or password incorrect!');
    }

    const passwordMatch = await compare(password, userExists.password);

    if (!passwordMatch) {
      throw new Error('Email or password incorrect!');
    }

    const token = sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 1 day
        sub: userExists.id,
      },
      process.env.TOKEN_SECRET,
    );

    return { token: token };
  }
}
