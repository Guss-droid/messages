import { Controller, Post, UseGuards, Param, Body } from '@nestjs/common';
import { MessagesService } from 'src/services/messages.service';
import { AuthorizationGuard } from '../auth/authorization.guard';
import { CurrentUser, IAuthUser } from '../auth/currentUser';

interface IMessage {
  message: string;
}

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Post('/:id')
  @UseGuards(AuthorizationGuard)
  async message(
    @Param('id') id: string,
    @Body() { message }: IMessage,
    @CurrentUser() user: IAuthUser,
  ) {
    return await this.messagesService.sendMessage({
      message,
      userSendId: user.sub,
      userReceivedId: id,
    });
  }

  @Post('/group/:id')
  @UseGuards(AuthorizationGuard)
  async messageOnGroup(
    @Param('id') id: string,
    @Body() { message }: IMessage,
    @CurrentUser() user: IAuthUser,
  ) {
    return await this.messagesService.sendMessageInGroup({
      message,
      userSendId: user.sub,
      groupId: id,
    });
  }
}
