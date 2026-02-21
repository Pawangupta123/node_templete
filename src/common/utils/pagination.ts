import { PaginationMeta } from '../helpers/response.helper';

/**
 * Pagination Utility
 * Har list API mein reuse — consistent pagination har jagah
 *
 * Usage (in service/repository):
 *   const { skip, limit, meta } = paginate(req.query);
 *   const users = await UserModel.find().skip(skip).limit(limit);
 *   const total = await UserModel.countDocuments();
 *   sendPaginated(res, users, meta(total));
 */

export interface PaginationOptions {
  page?: number | string;
  limit?: number | string;
}

export interface PaginationResult {
  skip: number;
  limit: number;
  page: number;
  meta: (total: number) => PaginationMeta;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export function paginate(options: PaginationOptions = {}): PaginationResult {
  const page = Math.max(DEFAULT_PAGE, Number(options.page) || DEFAULT_PAGE);
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number(options.limit) || DEFAULT_LIMIT));
  const skip = (page - 1) * limit;

  return {
    skip,
    limit,
    page,
    meta: (total: number): PaginationMeta => ({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    }),
  };
}
