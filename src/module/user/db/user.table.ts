import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UserTable {
  private logger = new Logger('UserTable');
  constructor(
    @InjectRepository(User)
    public readonly orm: Repository<User>,
  ) {}

  async tst() {
    const dto: Partial<User> = {
      email: 'hoontou@gmail.com',
      password: 'test',
    };
    const newUser = new User();
    newUser.email = dto.email;
    newUser.password = dto.password;

    const result = await this.orm.save(newUser);
    console.log(result);
  }
}
