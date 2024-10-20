import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { KyselyDB } from '../../db/kysely/kysely.service';
import { TUser } from './model/user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly kysely: KyselyDB) {}
  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return await this.kysely
      .insertInto('users')
      .values({ ...createUserDto, password: hashedPassword })
      .returning(['id', 'email', 'password', 'name'])
      .executeTakeFirst();
  }

  findAll() {
    return `This action returns all user`;
  }

  async findByEmail(email: string): Promise<TUser> {
    const query = this.kysely
      .selectFrom('users')
      .where('email', '=', email)
      .leftJoin('user_role', 'users.id', 'user_role.user_id')
      .select(({ eb }) => [
        'email',
        'users.id as id',
        'password',
        'name',
        'role',
      ]);
    const result = await query.executeTakeFirst();
    return new TUser({
      id: result.id,
      email: result.email,
      password: '',
      roles: [result.role.toString()],
      name: result.name,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
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
