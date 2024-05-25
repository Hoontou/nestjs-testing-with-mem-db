import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { newDb } from 'pg-mem';

export const localTypeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
};

//https://github.com/oguimbal/pg-mem/blob/master/samples/typeorm/simple.ts

export const getTypeormConfig = async () => {
  if (process.env.NODE_ENV === 'test') {
    const db = newDb();
    const connection = await db.adapters.createTypeormConnection({
      type: 'postgres',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    });
    await connection.synchronize();
    return connection.options;
  }
  return localTypeORMConfig;
};
