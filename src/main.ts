import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { pgdb } from './db/pg';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  pgdb.client.connect((err) => {
    if (err) {
      console.error('vanila pgdb connection error', err.stack);
    } else {
      console.log('vanila pgdb connected');
    }
  });
}
bootstrap();
