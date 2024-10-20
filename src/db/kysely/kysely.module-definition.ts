import { ConfigurableModuleBuilder } from '@nestjs/common';
import { KyselyDBOptions } from './kysely-db.options';

export const {
  ConfigurableModuleClass: ConfigurableDatabaseModule,
  MODULE_OPTIONS_TOKEN: KYSELY_DB_OPTIONS,
} = new ConfigurableModuleBuilder<KyselyDBOptions>()
  .setClassMethodName('forRoot')
  .build();
