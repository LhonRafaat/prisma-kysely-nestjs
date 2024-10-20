import { Kysely } from 'kysely';
import { Injectable } from '@nestjs/common';
import { DB } from '../../../prisma/generated/types';

@Injectable()
export class KyselyDB extends Kysely<DB> {}
