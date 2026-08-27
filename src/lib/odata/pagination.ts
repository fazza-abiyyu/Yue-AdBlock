export interface PaginationParams {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export function calculatePagination(
  page: number,
  pageSize: number,
  total: number,
): PaginationParams {
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, Math.min(100, pageSize));
  const totalPages = Math.ceil(total / safePageSize);
  return {
    page: safePage,
    pageSize: safePageSize,
    total,
    totalPages: Math.max(1, totalPages),
  };
}

export function getPaginationRange(page: number, pageSize: number): { skip: number; take: number } {
  const skip = (Math.max(1, page) - 1) * Math.max(1, Math.min(100, pageSize));
  const take = Math.max(1, Math.min(100, pageSize));
  return { skip, take };
}
