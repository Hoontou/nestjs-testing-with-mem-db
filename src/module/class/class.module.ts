import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';
import { ClassCollection } from './db/class.collection';
import { ClassSchema, RoomSchema } from './db/class.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Class', schema: ClassSchema },
      { name: 'Room', schema: RoomSchema },
    ]),
  ],
  controllers: [ClassController],
  providers: [ClassService, ClassCollection],
  exports: [ClassService],
})
export class ClassModule {}
