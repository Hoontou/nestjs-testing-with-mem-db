import { TestingModule, Test } from '@nestjs/testing';
import { UserTable } from './user.table';
import { DataSource } from 'typeorm';
import { PgMem } from '../../../db/pg-mem';

describe('UserTable', () => {
  let userTable: UserTable;
  let pgMemInstance: PgMem;

  beforeAll(async () => {
    pgMemInstance = new PgMem();
    await pgMemInstance.init();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserTable,

        //raw SQL을 위한 DataSource 의존성 (테스트할 provider에서 안쓰면 없어도 됨.)
        { provide: DataSource, useValue: pgMemInstance.getDataSource() },

        //orm 사용을 위한 InjectRepository<User> 의존성
        //PgMem에서 필요한 Repo 싹다 등록해놓고, 필요한것만 가져다 쓰기.
        pgMemInstance.repositorys.User,
      ],
    }).compile();

    userTable = module.get<UserTable>(UserTable);

    //필요한 데이터 삽입, 아니면 아예 PgMem init에서
    //기본 state 삽입하고, 백업까지 만들어도 될듯.
    await pgMemInstance.query(`
    INSERT INTO "user" (email, password, "createdAt")
    VALUES ('hoontou@gmail.com', 'test', NOW());
  `);
    pgMemInstance.makeBackup();
  });

  afterEach(async () => {
    pgMemInstance.restore();
  });

  afterAll(async () => {
    //destroy해줘야 test완료시 즉시 끝남.
    await pgMemInstance.destroy();
  });

  //raw sql, orm, 백업state로 restore까지 테스트.
  it('should create and retrieve all', async () => {
    const dto = {
      email: 'hoontou2@gmail.com',
      password: 'test',
    };

    /**save using orm */
    await userTable.saveNewUser(dto);

    /**getAll using raw SQL */
    const res = await userTable.getAll();
    console.log(res);

    expect(res[0].email).toBe('hoontou@gmail.com');
    expect(res[1].email).toBe(dto.email);
    expect(res[1].password).toBe(dto.password);
  });
  it('should create and retrieve a user', async () => {
    const dto = {
      email: 'hoontou3@gmail.com',
      password: 'test',
    };

    /**save using orm */
    await userTable.saveNewUser(dto);

    /**getAll using raw SQL */
    const res = await userTable.getAll();
    console.log(res);
    expect(res[0].email).toBe('hoontou@gmail.com');

    expect(res[1].email).toBe(dto.email);
    expect(res[1].password).toBe(dto.password);
  });
});
