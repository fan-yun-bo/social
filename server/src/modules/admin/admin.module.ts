import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AdminUsersController } from './admin.controller';

@Module({
  imports: [UsersModule],
  controllers: [AdminUsersController],
})
export class AdminModule {}
