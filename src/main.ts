import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { pgdb } from './db/pg';
import { PgMem } from './db/typeorm.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(8080);

  pgdb.client.connect((err) => {
    if (err) {
      console.error('vanila pgdb connection error', err.stack);
    } else {
      console.log('vanila pgdb connected');
    }
  });

  // const pgMemInstance = new PgMem();
  // await pgMemInstance.connect();
  // await pgMemInstance.tst();
}
bootstrap();
