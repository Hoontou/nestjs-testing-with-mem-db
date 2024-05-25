import { Injectable } from '@nestjs/common';
import { ClassCollection } from './db/class.collection';

@Injectable()
export class ClassService {
  constructor(private classCollection: ClassCollection) {}
}
