import { TestingModule, Test } from '@nestjs/testing';
import { UserTable } from './user.table';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { startAsMemPg } from '../../../db/typeorm.config';

describe('UserTable', () => {
  let service: UserTable;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        // InMemoryDbModule,
        //아래와 같이 명시하는것도 귀찮아서, 그냥 인메모리 db
        //import하는 모듈을 만들어봤는데 동작안함.
        //나쁘게 말하면 귀찮게 아래처럼 명시해서 의존성을 만들어야하지만,
        //좋게말하면 필요한 의존성만 넣게할 수 있어서 깔끔한 테스트 수행가능.
        //더럽게 의존성을 넣어야 하는 테스트의 경우에는, 좋은 유닛테스트가 아니라는 뜻
        //애초에 내가 추구하는 테스트는 유닛테스트만 이니까..
        //유닛, 통합, e2e를 모두챙기는건 말도안되고.
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

  // beforeEach(async () => {
  //   await dataSource.query(`
  //     INSERT INTO "user" (email, password, "createdAt")
  //     VALUES ('hoontou@gmail.com', 'test', NOW());
  //   `);
  // });

  // afterEach(async () => {
  //   await dataSource.query(`
  //     DELETE FROM "user";
  //   `);
  // });

  it('should create and retrieve a user', async () => {
    const dto = {
      email: 'hoontou@gmail.com',
      password: 'test',
    };

    await service.saveNewUser(dto);

    const res = await service.getAll();

    expect(res[0].email).toBe(dto.email);
    expect(res[0].password).toBe(dto.password);
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
