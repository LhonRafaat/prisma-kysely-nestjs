import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { KyselyDB } from './kysely/kysely.service';
import {
  ConfigurableDatabaseModule,
  KYSELY_DB_OPTIONS,
} from './kysely/kysely.module-definition';
import { KyselyDBOptions } from './kysely/kysely-db.options';
import { MysqlDialect } from 'kysely';
import { createPool } from 'mysql2';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: KyselyDB,
      inject: [KYSELY_DB_OPTIONS],
      useFactory: (kyselyDBOptions: KyselyDBOptions) => {
        const dialect = new MysqlDialect({
          pool: createPool({
            uri: kyselyDBOptions.connectionString,
          }),
        });

        return new KyselyDB({
          dialect,
        });
      },
    },
  ],
  exports: [PrismaService, KyselyDB],
})
export class DBModule extends ConfigurableDatabaseModule {}
