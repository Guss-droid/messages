import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class ChatsService {
  constructor(private prisma: PrismaService) {}

  async getAllMyChats(id: string) {
    return await this.prisma.chat.findMany({
      where: {
        OR: [
          {
            userSendId: id,
          },
          {
            userReceivedId: id,
          },
        ],
      },
      select: {
        id: true,
        userReceivedId: true,
        userSendId: true,
        messages: true,
      },
    });
  }

  async getOneChat(id: string) {
    return await this.prisma.chat.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        userReceivedId: true,
        userSendId: true,
        messages: true,
      },
    });
  }
}
