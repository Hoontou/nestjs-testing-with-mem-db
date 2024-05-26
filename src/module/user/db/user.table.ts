import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UserTable {
  private logger = new Logger('UserTable');
  constructor(
    @InjectRepository(User)
    public readonly orm: Repository<User>,
    @InjectDataSource() private readonly dataSource: DataSource
  ) {}

  async saveNewUser(dto: { email: string; password: string }) {
    const newUser = new User();
    newUser.email = dto.email;
    newUser.password = dto.password;

    await this.orm.save(newUser);
    return;
  }

  async getAll() {
    const res = await this.dataSource.query('SELECT * FROM "user"');
    return res;
  }
}
