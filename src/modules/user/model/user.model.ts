import { TUserRole } from './user-role.model';

export class TUser {
  id: number;

  email: string;

  password: string;

  roles: string[];

  name?: string;

  refresh_token?: string;

  constructor({
    id,
    email,
    password,
    roles,
    name,
    refresh_token,
  }: {
    id: number;
    email: string;
    password: string;
    roles: string[];
    name?: string;
    refresh_token?: string;
  }) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.roles = roles;
    this.name = name;
    this.refresh_token = refresh_token;
  }
}
