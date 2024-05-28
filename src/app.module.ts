import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { getTypeormConfig } from './db/typeorm.config';
import { ClassModule } from './module/class/class.module';
import { UserModule } from './module/user/user.module';
import { getMongoUri } from './db/mongoose.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(getTypeormConfig()),
    MongooseModule.forRoot(getMongoUri()),
    ClassModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
