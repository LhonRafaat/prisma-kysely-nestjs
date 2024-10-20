import { Role } from '@prisma/client';
import { TUser } from './user.model';

export class TUserRole {
  id: number;

  role: Role;

  userId: number;

  user: TUser;
}
