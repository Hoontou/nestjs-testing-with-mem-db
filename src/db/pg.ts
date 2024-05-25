import { Client } from 'pg';

const localPostgresConfig = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
};

class Postgres {
  public readonly client;
  constructor() {
    this.client = new Client(localPostgresConfig);
  }
}

export const pgdb = new Postgres();
