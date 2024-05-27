import { TestingModule, Test } from '@nestjs/testing';
import { UserTable } from './user.table';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { startAsMemPg } from '../../../db/typeorm.config';

//ㅋㅋ 나는 pg-mem가 제대로 작동하고있다고 생각했는데
//사실은 pg-mem을 생성만 해놓고 로컬디비에 연결해 쓰고있었음.
//그럼 도대체 typeorm에 pg-mem을 어떻게 연결하는건지
//공식문서대로 똑같이 했는데도 오류를 뱉는데?
//오류피해갈려고 options에 필요한 필드들을 정의하니까
//그게 바로 로컬디비에 연결하는 options가 돼 버렸고, 그렇게 로컬디비를 쓰게됐음
//미쳐버리겠네

describe('UserTable', () => {
  let service: UserTable;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({ useFactory: startAsMemPg }),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UserTable],
    }).compile();

    service = module.get<UserTable>(UserTable);
    dataSource = module.get<DataSource>(DataSource);
    //위 dataSource 가져오는건 그냥 테스트 만을 위해선 필요없는데,
    //테스트 수행 전 init 데이터 넣기위해서 + afterAll에서
    //memdb destroy해주면 테스트 다 끝나자 마자 jest종료
    //를 위해.
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await dataSource.query(`
      INSERT INTO "user" (email, password, "createdAt")
      VALUES ('hoontou@gmail.com', 'test', NOW());
    `);
  });

  afterEach(async () => {
    await dataSource.query(`
      DELETE FROM "user";
    `);
  });

  it('should create and retrieve a user', async () => {
    const dto = {
      email: 'hoontou2@gmail.com',
      password: 'test',
    };

    await service.saveNewUser(dto);

    const res = await service.getAll();
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

    await service.saveNewUser(dto);

    const res = await service.getAll();
    console.log(res);
    expect(res[0].email).toBe('hoontou@gmail.com');

    expect(res[1].email).toBe(dto.email);
    expect(res[1].password).toBe(dto.password);
  });
});

//콘솔 결과가 아래처럼,
//SELECT * 했을때 결과가 하나만 있는거 보면
//제대로 INSERT, DELETE가 적절하게 일어나고 있음.
//이미 써버런 primary id라서 2로 들어가긴 함.

// console.log
// [
//   {
//     id: 1,
//     email: 'hoontou@gmail.com',
//     password: 'test',
//     createdAt: 2024-05-26T02:56:45.265Z
//   }
// ]

//   at Object.<anonymous> (module/user/db/user.table.spec.ts:42:13)

// console.log
// [
//   {
//     id: 2,
//     email: 'hoontou@gmail.com',
//     password: 'test',
//     createdAt: 2024-05-26T02:56:45.279Z
//   }
// ]
