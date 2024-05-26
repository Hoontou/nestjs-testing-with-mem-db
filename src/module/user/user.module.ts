import { Module } from '@nestjs/common';
import { UserTable } from './db/user.table';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './db/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserTable],
  exports: [UserService],
})
export class UserModule {}
