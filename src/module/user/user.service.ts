import { Injectable } from '@nestjs/common';
import { UserTable } from './db/user.table';

@Injectable()
export class UserService {
  constructor(private userTable: UserTable) {}
}
