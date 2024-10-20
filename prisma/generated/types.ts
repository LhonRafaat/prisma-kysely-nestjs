import type { ColumnType, Insertable } from 'kysely';
export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export const Role = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  MODERATOR: 'MODERATOR',
  GUEST: 'GUEST',
} as const;
export type Role = (typeof Role)[keyof typeof Role];
export type User = {
  id: Generated<number>;
  email: string;
  password: string;
  name: string | null;
  refresh_token: string | null;
};
export type UserRole = {
  id: Generated<number>;
  user_id: number;
  role: Role;
};
export type DB = {
  user_role: UserRole;
  users: User;
};
