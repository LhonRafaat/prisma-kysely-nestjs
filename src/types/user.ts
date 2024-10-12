import { Post } from './post';

export class User {
  id: number;

  email: string;

  name?: string;

  posts: Post[];
}
