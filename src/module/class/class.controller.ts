import { Controller } from '@nestjs/common';
import { ClassService } from './class.service';

export interface IClassController {}

@Controller()
export class ClassController implements IClassController {
  constructor(private classService: ClassService) {}
}
