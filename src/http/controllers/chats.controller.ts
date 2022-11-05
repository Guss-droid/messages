import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { ChatsService } from 'src/services/chats.service';
import { AuthorizationGuard } from '../auth/authorization.guard';
import { CurrentUser, IAuthUser } from '../auth/currentUser';

interface IOneChat {
  id: string;
}

@Controller('chats')
export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  @Get('')
  @UseGuards(AuthorizationGuard)
  async allMyChats(@CurrentUser() user: IAuthUser) {
    return await this.chatsService.getAllMyChats(user.sub);
  }

  @Get('/:id')
  @UseGuards(AuthorizationGuard)
  async oneChat(@Param('id') { id }: IOneChat) {
    return await this.chatsService.getOneChat(id);
  }
}
