import { User } from './user';

export class Post {
  id: number;

  title: string;

  content?: string;

  published: boolean;

  author?: User;

  authorId?: number;
}
