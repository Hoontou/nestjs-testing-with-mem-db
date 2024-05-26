import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { startAsLocalPg } from './db/typeorm.config';
import { startAsLocalMongo } from './db/mongoose.config';
import { ClassModule } from './module/class/class.module';
import { UserModule } from './module/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(startAsLocalPg()),
    MongooseModule.forRoot(startAsLocalMongo()),
    ClassModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
