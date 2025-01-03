import { Request } from 'express';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { InferSubjects } from '@casl/ability';
import { TUser } from '../../modules/user/model/user.model';

export interface queryObj {
  limit: number;
}

export interface IRequest extends Request {
  queryObj: queryObj;
  user: TUser;
  pagination: {
    limit: number;
    page: number;
    skip: number;
    sort: string;
    sortBy: string;
  };
}

export const getResponseType = (Type: any) => {
  return {
    schema: {
      allOf: [
        {
          properties: {
            result: {
              type: 'array',
              items: { $ref: getSchemaPath(Type) },
            },

            count: {
              type: 'number',
              default: 0,
            },
            page: {
              type: 'number',
              default: 0,
            },
            limit: {
              type: 'number',
              default: 0,
            },
          },
        },
      ],
    },
  };
};

export class TResponse<T> {
  constructor(result: T[], count: number, page: number, limit: number) {
    this.result = result;
    this.count = count;
    this.page = page;
    this.limit = limit;
  }
  @ApiProperty()
  result: T[];

  @ApiProperty()
  count: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}

export interface IQuery {
  limit: number;
  page: number;
  sort: string;
  sortBy: string;
  search?: string[];
  searchVal?: string[];
}

class User {
  id: number;
}

export type Subjects = InferSubjects<typeof User | 'all'>; //update this

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export interface RequiredRule {
  subject: Subjects;
  action: Action;
}
