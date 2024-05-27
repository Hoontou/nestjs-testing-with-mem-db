import { IMemoryDb, IBackup, newDb } from 'pg-mem';
import { DataSource, Repository, BaseEntity } from 'typeorm';
import { User } from '../module/user/db/user.entity';

//https://github.com/oguimbal/pg-mem/blob/master/samples/typeorm/simple.ts
export class PgMem {
  private db: IMemoryDb;
  private dataSource: DataSource;
  private backup: IBackup;
  public repositorys: {
    User: { provide: string; useValue: Repository<BaseEntity> };
  };

  async init() {
    this.db = newDb();
    this.resisterMockFunc();
    this.dataSource = await this.db.adapters.createTypeormDataSource({
      type: 'postgres',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    });
    await this.dataSource.initialize();
    await this.dataSource.synchronize();

    this.initRepositorys();
  }

  initRepositorys() {
    const userRepository: Repository<User> =
      this.dataSource.getRepository(User);

    this.repositorys = {
      User: {
        provide: 'UserRepository',
        useValue: userRepository,
      },
    };
    return;
  }

  resisterMockFunc() {
    this.db.public.registerFunction({
      implementation: () => 'test',
      name: 'current_database',
    });
    this.db.public.registerFunction({
      implementation: () => 'version',
      name: 'version',
    });

    // this.db.registerExtension('uuid-ossp', (schema) => {
    //   schema.registerFunction({
    //     name: 'uuid_generate_v4',
    //     returns: DataType.uuid,
    //     implementation: randomUUID,
    //     impure: true,
    //   });
    // });

    // this.db.public.interceptQueries((sql) => {
    //   const newSql = sql.replace(/\bnumeric\s*\(\s*\d+\s*,\s*\d+\s*\)/g, 'float');
    //   if (sql !== newSql) {
    //     // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    //     return db.public.many(newSql);
    //   }

    //   return null;
    // });
    this.db.public.interceptQueries((queryText) => {
      if (
        queryText.search(
          /(pg_views|pg_matviews|pg_tables|pg_enum|table_schema)/g
        ) > -1
      ) {
        return [];
      }
      return null;
    });

    return;
  }

  restore() {
    this.backup.restore();
    return;
  }

  makeBackup() {
    this.backup = this.db.backup();
    return;
  }

  getDataSource(): DataSource {
    return this.dataSource;
  }

  query(string: string) {
    return this.dataSource.query(string);
  }

  async destroy() {
    await this.dataSource.destroy();
    return;
  }
}
