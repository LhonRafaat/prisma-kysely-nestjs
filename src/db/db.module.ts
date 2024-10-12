import { Global, Module } from '@nestjs/common';
import { KyselyService } from './kysely.service';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [KyselyService, PrismaService],
  exports: [KyselyService, PrismaService],
})
export class DbModule {}
