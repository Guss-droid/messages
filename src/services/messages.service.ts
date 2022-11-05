import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';

interface ISendMessage {
  message: string;
  userSendId: string;
  userReceivedId: string;
}

interface IMessageGroup {
  message: string;
  userSendId: string;
  groupId: string;
}

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async sendMessage({ message, userReceivedId, userSendId }: ISendMessage) {
    if (userReceivedId === userSendId) {
      throw new Error('Is not possible');
    }

    const userExists = await this.prisma.users.findUnique({
      where: {
        id: userSendId,
      },
    });

    if (!userExists) {
      throw new Error('User does not exist!');
    }

    const userReceivedExists = await this.prisma.users.findUnique({
      where: {
        id: userReceivedId,
      },
    });

    if (!userReceivedExists) {
      throw new Error('User does not exist!');
    }

    const chatExists = await this.prisma.chat.findFirst({
      where: {
        AND: [
          {
            userSendId,
            userReceivedId,
          },
          {
            userReceivedId: userSendId,
            userSendId: userReceivedId,
          },
        ],
      },
    });

    if (chatExists) {
      return await this.prisma.messages.create({
        data: {
          message,
          chatId: chatExists.id,
        },
      });
    }

    const newChat = await this.prisma.chat.create({
      data: {
        userReceivedId,
        userSendId,
      },
    });

    return await this.prisma.messages.create({
      data: {
        message,
        chatId: newChat.id,
      },
    });
  }

  async sendMessageInGroup({ message, userSendId, groupId }: IMessageGroup) {
    const groupExists = await this.prisma.group.findUnique({
      where: {
        id: groupId,
      },
    });

    if (!groupExists) {
      throw new Error('Group not found');
    }

    const userExists = await this.prisma.users.findUnique({
      where: {
        id: userSendId,
      },
    });

    if (!userExists) {
      throw new Error('User does not exist!');
    }

    return await this.prisma.messages.create({
      data: {
        message,
        groupId,
        userSendId,
      },
    });
  }
}
