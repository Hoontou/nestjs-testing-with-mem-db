import { TypeOrmModuleOptions } from '@nestjs/typeorm';

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

export const startAsLocalPg = () => {
  return localTypeORMConfig;
};
