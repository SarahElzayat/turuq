export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

/**
 * Clamps raw page/limit query values into safe bounds so a caller can't
 * request page 0, a negative limit, or the entire collection in one response.
 */
export function parsePagination(rawPage?: number, rawLimit?: number): PaginationParams {
  const page = Number.isFinite(rawPage) && (rawPage as number) >= 1 ? Math.floor(rawPage as number) : DEFAULT_PAGE;
  const limit =
    Number.isFinite(rawLimit) && (rawLimit as number) >= 1
      ? Math.min(Math.floor(rawLimit as number), MAX_LIMIT)
      : DEFAULT_LIMIT;

  return { page, limit, skip: (page - 1) * limit };
}

export function buildPaginationMeta(page: number, limit: number, total: number) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}
