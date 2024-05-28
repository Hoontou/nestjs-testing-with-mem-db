import { MongooseModule } from '@nestjs/mongoose';
import { TestingModule, Test } from '@nestjs/testing';
import { ClassCollection } from './class.collection';
import { ClassDocument, RoomDocument } from './class.schema';
import { MongoMem, startMongoMem } from '../../../db/mongoose.config';
import { Model } from 'mongoose';

describe('ClassCollection', () => {
  let classCollection: ClassCollection;
  let mongoMem: MongoMem;

  //직접 DB작업을 하고싶으면,
  // let classModel: Model<ClassDocument>;
  // let roomModel: Model<RoomDocument>;

  beforeAll(async () => {
    mongoMem = await startMongoMem();

    //직접 DB작업을 하고싶으면,
    // classModel = mongoMem.models.class.useValue;
    // roomModel = mongoMem.models.room.useValue;

    const module: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(mongoMem.uri)],
      //테스트 할 모듈에서 쓰이는 모델만 의존성 등록
      providers: [ClassCollection, mongoMem.models.class, mongoMem.models.room],
    }).compile();

    classCollection = module.get<ClassCollection>(ClassCollection);
  });

  afterAll(async () => {
    await mongoMem.destroy();
  });

  describe('test save, getAll', () => {
    const className = '수학';
    const teacherName = '독고민수';

    it('should save a new class', async () => {
      const saveResult = await classCollection.save(className, teacherName);
      expect(saveResult.className).toEqual(className);
      expect(saveResult.teacher.name).toEqual(teacherName);
    });
    it('should get all', async () => {
      const getAllRes = await classCollection.getAll();
      console.log(getAllRes);
      expect(getAllRes[0].className).toEqual(className);
      expect(getAllRes[0].teacher.name).toEqual(teacherName);
    });

    // 직접 DB작업을 하고싶으면,
    //   it('tst model directly', async () => {
    //     const teacher2 = {
    //       name: '김동수',
    //     };

    //     const classForm = {
    //       className: '영어',
    //       teacher: teacher2,
    //     };

    //     const newClass = new classModel(classForm);
    //     await newClass.save();

    //     const getAllRes = await classCollection.getAll();
    //     console.log(getAllRes);
    //     expect(getAllRes[0].className).toEqual(className);
    //     expect(getAllRes[0].teacher.name).toEqual(teacherName);
    //     expect(getAllRes[1].className).toEqual(classForm.className);
    //     expect(getAllRes[1].teacher.name).toEqual(classForm.teacher.name);
    //   });
  });
});
