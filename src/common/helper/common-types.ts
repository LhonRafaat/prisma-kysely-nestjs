import { Request } from 'express';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { InferSubjects } from '@casl/ability';

export interface queryObj {
  regular: {
    [field: string]: {
      [operator: string]: string | string[] | number | [];
    };
  };
  references: {
    [reference: string]: {
      paths: Array<string>;
      value: {
        [operator: string]: string | string[] | number | [];
      };
    };
  };
}

export interface IRequest extends Request {
  queryObj: queryObj;
  user: any;
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
