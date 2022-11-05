import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';

interface IGroupCreate {
  groupName: string;
  userId: string;
  userCreateGroupId: string;
}

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async createGroup({ groupName, userId, userCreateGroupId }: IGroupCreate) {
    let groupAlreadyExists = await this.prisma.group.findFirst({
      where: {
        groupName,
      },
    });

    if (!groupAlreadyExists) {
      groupAlreadyExists = await this.prisma.group.create({
        data: {
          groupName,
        },
      });
    }

    const user = await this.prisma.users.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error('User does not exist');
    }

    const userAlreadyInGroup = await this.prisma.group.findFirst({
      where: {
        id: groupAlreadyExists.id,
        users: {
          some: {
            AND: {
              id: userId,
            },
          },
        },
      },
    });

    if (userAlreadyInGroup) {
      throw new Error('User already in group');
    }

    await this.prisma.users.update({
      where: {
        id: userCreateGroupId,
      },
      data: {
        groupId: groupAlreadyExists.id,
      },
    });

    await this.prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        groupId: groupAlreadyExists.id,
      },
    });
  }

  async getGroup(id: string) {
    const group = await this.prisma.group.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        groupName: true,
        users: true,
        messages: true,
      },
    });

    if (!group) {
      throw new Error('Group not found');
    }

    return group;
  }
}
