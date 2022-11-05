import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';

import { UsersService } from 'src/services/users.service';
import { UsersController } from './controllers/users.controller';

import { MessagesService } from 'src/services/messages.service';
import { MessagesController } from './controllers/messages.controller';

import { ChatsService } from 'src/services/chats.service';
import { ChatsController } from './controllers/chats.controller';

import { GroupsService } from 'src/services/groups.service';
import { GroupsController } from './controllers/groups.controller';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule],
  providers: [UsersService, MessagesService, ChatsService, GroupsService],
  controllers: [
    UsersController,
    MessagesController,
    ChatsController,
    GroupsController,
  ],
})
export class HttpModule {}
