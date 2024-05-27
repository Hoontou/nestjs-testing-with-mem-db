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
    //raw SQL 테스트를 위해
    @InjectDataSource() private readonly dataSource: DataSource
  ) {}

  /**save using orm */
  async saveNewUser(dto: { email: string; password: string }) {
    const newUser = new User();
    newUser.email = dto.email;
    newUser.password = dto.password;

    await this.orm.save(newUser);
    return;
  }

  /**getAll using raw SQL */
  async getAll() {
    //raw SQL 테스트를 위해
    const res = await this.dataSource.query('SELECT * FROM "user"');
    // const res = await this.orm.find();

    return res;
  }
}
