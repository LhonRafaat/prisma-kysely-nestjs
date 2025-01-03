import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { IRequest } from './common-types';

@Injectable()
export class QueryMiddleware implements NestMiddleware {
  async use(req: IRequest, res: Response, next: NextFunction) {
    this.addDefaultPagination(req);

    next();
  }

  addDefaultPagination(req: IRequest) {
    req.query.limit = (req.query.limit || '10') as string;
    req.query.page = (req.query.page || '1') as string;
    req.query.skip = ((+req.query.page - 1) * +req.query.limit).toString();
    req.query.sort = (req.query.sort || 'created_at') as string;
    req.query.sortBy = (req.query.sortBy || 'desc') as string;
    if (req.query.search && !Array.isArray(req.query.search)) {
      req.query.search = [req.query.search as string];
    }
    if (req.query.searchVal && !Array.isArray(req.query.searchVal)) {
      req.query.searchVal = [req.query.searchVal as string];
    }
    req.pagination = {
      limit: +req.query.limit,
      page: +req.query.page,
      skip: +req.query.skip,
      sort: req.query.sort,
      sortBy: req.query.sortBy,
    };
  }
}
