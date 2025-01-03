import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { KyselyDB } from '../../db/kysely/kysely.service';
import { TUser } from './model/user.model';
import * as bcrypt from 'bcrypt';
import { OAuthRegisterDto } from '../auth/dto/oauth-register.dto';
import { RegisterDto } from '../auth/dto/register.dto';
import { IQuery, TResponse } from '../../common/helper/common-types';
import { User } from '../../../prisma/generated/types';

@Injectable()
export class UserService {
  constructor(private readonly kysely: KyselyDB) {}
  async create(createUserDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const result = await this.kysely.transaction().execute(async (tx) => {
      const user = await tx
        .insertInto('users')
        .values({
          email: createUserDto.email,
          password: hashedPassword,
          name: createUserDto.name,
        })
        .executeTakeFirstOrThrow();

      await tx
        .insertInto('user_role')
        .values(
          createUserDto.roles.map((role) => ({ user_id: user.insertId, role })),
        )
        .execute();

      return user;
    });

    const user = await this.findOne(result.insertId as unknown as number);

    return user;
  }

  async createWithProvider(payload: OAuthRegisterDto) {
    return await this.kysely
      .insertInto('users')
      .values(payload)
      .executeTakeFirst();
  }

  async findAll(reqQuery: IQuery): Promise<TResponse<TUser>> {
    const skip = (reqQuery.page - 1) * reqQuery.limit;
    const query = this.kysely.selectFrom('users').where(({ eb }) => {
      if (!reqQuery.search || reqQuery.search?.length < 1) {
        return eb('users.id', '>', 0);
      }
      return eb.or([
        ...reqQuery.search.map((search, index) => {
          return eb(
            search as keyof User,
            'like',
            `%${reqQuery.searchVal[index]}%`,
          );
        }),
      ]);
    });

    const { total } = await query
      .select(this.kysely.fn.countAll().as('total'))
      .executeTakeFirstOrThrow();

    const users = await query
      .selectAll('users')
      .innerJoin('user_role', 'user_role.user_id', 'users.id')
      .select(({ eb }) => [
        eb.fn.agg<string>('group_concat', ['user_role.role']).as('roles'),
      ])
      .groupBy('users.id')
      .limit(+reqQuery.limit)
      .offset(+skip)
      .execute();
    return new TResponse(
      users.map((user) => {
        return new TUser({
          id: user.id,
          email: user.email,
          password: user.password,
          roles: user.roles.split(','),
          name: user.name,
          refresh_token: user.refresh_token,
        });
      }),
      Number(total),
      +reqQuery.page,
      +reqQuery.limit,
    );
  }

  async findByEmail(email: string): Promise<TUser> {
    const query = this.kysely
      .selectFrom('users')
      .where('email', '=', email)
      .innerJoin('user_role', 'users.id', 'user_role.user_id')
      .select(({ eb }) => [
        'email',
        'users.id as id',
        'password',
        'name',
        'refresh_token',
        eb.fn.agg<string>('group_concat', ['user_role.role']).as('roles'),
      ])
      .groupBy('users.id');
    const result = await query.executeTakeFirst();

    return new TUser({
      id: result.id,
      email: result.email,
      password: result.password,
      roles: result.roles.split(','),
      name: result.name,
      refresh_token: result.refresh_token,
    });
  }

  async findOne(id: number): Promise<TUser> {
    const query = await this.kysely
      .selectFrom('users')
      .innerJoin('user_role', 'user_role.user_id', 'users.id')
      .where('users.id', '=', id)
      .selectAll('users')
      .select(({ eb }) => [
        eb.fn.agg<string>('group_concat', ['user_role.role']).as('roles'),
      ])
      .groupBy('users.id')
      .executeTakeFirst();

    return new TUser({
      id: query.id,
      email: query.email,
      password: query.password,
      roles: query.roles.split(','),
      name: query.name,
      refresh_token: query.refresh_token,
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async updateRefreshToken(id: number, refreshToken: string) {
    const user = await this.kysely
      .selectFrom('users')
      .where('id', '=', id)
      .select('refresh_token')
      .executeTakeFirst();

    if (!user) throw new NotFoundException("User doesn't exist");

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    return await this.kysely
      .updateTable('users')
      .set({ refresh_token: hashedRefreshToken })
      .where('id', '=', id)
      .executeTakeFirst();
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
