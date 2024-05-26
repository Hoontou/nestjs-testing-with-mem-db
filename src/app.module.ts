import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { startAsLocalPg, startAsMemPg } from './db/typeorm.config';
import { startAsLocalMongo, startAsMemMongo } from './db/mongoose.config';
import { ClassModule } from './module/class/class.module';
import { UserModule } from './module/user/user.module';
const ENV = process.env.NODE_ENV;

//왜 ENV가 test인데도 Local로 시작하는 함수를 돌리지???? 뭐지??
//env설정이 콜드스타트인가?
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: ENV ? startAsMemPg : startAsLocalPg,
    }),
    MongooseModule.forRootAsync({
      // useFactory: ENV === 'test' ? startAsMemMongo : startAsLocalMongo,
      useFactory: ENV ? startAsMemMongo : startAsLocalMongo,
    }),
    ClassModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
