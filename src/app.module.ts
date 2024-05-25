import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { getTypeormConfig } from './db/typeorm.config';
import { getMongoURI } from './db/mongoose.config';
import { ClassModule } from './module/class/class.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: getTypeormConfig,
    }),
    MongooseModule.forRootAsync({
      useFactory: getMongoURI,
    }),
    ClassModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
