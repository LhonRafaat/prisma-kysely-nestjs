import { Post as _Post } from './post';
import { User as _User } from './user';

/* eslint-disable @typescript-eslint/no-namespace */

export namespace PrismaModel {
  export class Post extends _Post {}
  export class User extends _User {}

  export const extraModels = [Post, User];
}
