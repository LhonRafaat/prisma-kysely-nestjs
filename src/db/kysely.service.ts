import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import { DB } from '../../prisma/generated/types';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '../config.type';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KyselyService {
  private readonly dialect: PostgresDialect;
  private readonly db: Kysely<DB>;

  constructor() {
    this.dialect = new PostgresDialect({
      pool: new Pool({
        connectionString: new ConfigService<EnvConfig>().get('DATABASE_URL'),
        max: 10,
      }),
    });
    this.db = new Kysely<DB>({
      dialect: this.dialect,
    });
  }

  public getInstance() {
    return this.db;
  }
}
