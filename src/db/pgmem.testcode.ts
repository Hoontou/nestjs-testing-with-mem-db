//https://github.com/oguimbal/pg-mem/blob/master/samples/typeorm/simple.ts

import { newDb, IMemoryDb, IBackup } from 'pg-mem';
import { DataSource } from 'typeorm';
import { User } from '../module/user/db/user.entity';

const startAsMemPg = async () => {
  const db = newDb();

  //pg-mem을 typeorm에 init하려면, 기본 함수들을
  //mock으로 만들어줘야해서 아래 코드가 필요.
  //이 두개 말고도 더 필요한데, 도대체가 정보가 잘 없다.
  //typeorm을 pg-mem에 연결해서 db mock하는건 잘 안쓰는 방법인가?
  //current_database, version 함수로도 충분했는데,
  //typeorm이 버전업 거치면서 함수가 많아진듯?
  //자료들이 22년 초반대 자료들이 대부분임.

  //아니면 그냥, test환경에서는 database: 'test'를 쓸까?

  db.public.registerFunction({
    implementation: () => 'test',
    name: 'current_database',
  });
  db.public.registerFunction({
    implementation: () => 'version',
    name: 'version',
  });

  //일단 init단계에서는 아래 두개는 없어도 되는데?
  //실제쿼리 날려봐야 삭제해도 되는지 알수있을듯.
  // db.registerExtension('uuid-ossp', (schema) => {
  //   schema.registerFunction({
  //     name: 'uuid_generate_v4',
  //     returns: DataType.uuid,
  //     implementation: randomUUID,
  //     impure: true,
  //   });
  // });

  // db.public.interceptQueries((sql) => {
  //   const newSql = sql.replace(/\bnumeric\s*\(\s*\d+\s*,\s*\d+\s*\)/g, 'float');
  //   if (sql !== newSql) {
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  //     return db.public.many(newSql);
  //   }

  //   return null;
  // });

  //기본 함수들에서 만들어진 SQL을 실행하는데, test환경에서는 필요없는것들임.
  //아래 단어를 포함하는 SQL을 싹다 그냥 실행헀다치는 인터셉터인듯?
  //맨뒤 table_schema 추가했음.
  //autoLoadEntities랑 싱크, 드랍스키마 같은 특수 옵션을 넣으면
  //그에 맞는 동작을 하기위해 typeorm이 이미 세팅된 SQL을 디비에 날리는듯.
  //일단 인터셉터가 처리하게 해놓고, 저 특수옵션들을 지우는건 실제 테스트를 하면서
  //생각해볼 문제인듯.
  // db.public.interceptQueries((queryText) => {
  //   if (
  //     queryText.search(
  //       /(pg_views|pg_matviews|pg_tables|pg_enum|table_schema)/g
  //     ) > -1
  //   ) {
  //     return [];
  //   }
  //   return null;
  // });

  const dataSource: DataSource = await db.adapters.createTypeormDataSource({
    type: 'postgres',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  });
  // await connection.initialize(); //type이 앱모듈에 등록하는것이 커넥션 init임.
  //여기서 해버리면 앱모듈 init때 typeorm이 커넥트 할때 오류남.
  // await connection.synchronize(); // 위 랑 마찬가지.
  console.log('pg mem created');

  return dataSource.options;
};

//근데 위 함수를 typeorm에게 넘겨버리면, 내가 원할때
//pg-mem의 backup과 restore를 사용할 수가 없는데?
//db 인스턴스가 거의 클로져 수준으로 감춰져 버림.
//dev나 프로덕션에서는 그게 맞는거지만, 나는 test에 이걸 쓸거니
//db에 직접 접근할 수 있어야함.
//그냥 모든 케이스마다 appmodule을 새로 생성해서 하면 되긴 하겠는데,
//성능을 너무 잡아먹을듯..
//깔끔하게, 추가모듈을 안만들고, 뭔 방법이 됐든 더러운 방법말고 ..

class PgMem {
  private db: IMemoryDb;
  private dataSource: DataSource;
  private backup: IBackup;

  async connect() {
    this.db = newDb();

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
    this.dataSource = await this.db.adapters.createTypeormDataSource({
      type: 'postgres',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    });
    await this.dataSource.initialize();
    await this.dataSource.synchronize();

    return;
  }

  async tst() {
    const userRepository = this.dataSource.getRepository(User);
    const dto = {
      email: 'tst@gmail.com',
      password: 'tst',
    };
    await userRepository.create(dto).save();
    const a = await userRepository.find();
    console.log('a', a);
    this.makeBackup();
    const dto2 = {
      email: 'tst2@gmail.com',
      password: 'tst',
    };
    await userRepository.create(dto2).save();
    const b = await userRepository.find();
    console.log('b', b);

    this.restore();
    const c = await userRepository.find();
    console.log('c', c);
    const dto3 = {
      email: 'tst3@gmail.com',
      password: 'tst',
    };
    await userRepository.create(dto3).save();
    const d = await userRepository.find();
    console.log('d', d);
  }

  restore() {
    this.backup.restore();
    return;
  }

  makeBackup() {
    this.backup = this.db.backup();
    return;
  }

  async disconnect() {
    await this.dataSource.destroy();
    return;
  }

  async sync() {
    await this.dataSource.synchronize();
    return;
  }

  getConnectOptions() {
    return this.dataSource.options;
  }
}
