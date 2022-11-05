import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { GroupsService } from 'src/services/groups.service';
import { AuthorizationGuard } from '../auth/authorization.guard';
import { CurrentUser, IAuthUser } from '../auth/currentUser';

interface IGroupCreate {
  name: string;
  userId: string;
}

@Controller('groups')
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  @Post('')
  @UseGuards(AuthorizationGuard)
  async createGroup(
    @Body() { name, userId }: IGroupCreate,
    @CurrentUser() user: IAuthUser,
  ) {
    return await this.groupsService.createGroup({
      groupName: name,
      userId,
      userCreateGroupId: user.sub,
    });
  }

  @Get('/:id')
  @UseGuards(AuthorizationGuard)
  async getGroup(@Param('id') id: string) {
    return await this.groupsService.getGroup(id);
  }
}
