export type PaginationRange = {
  startIndex: number;
  endIndex: number;
};

export function buildPaginationParams(
  range: PaginationRange,
  pageSize: number,
) {
  const safePageSize = pageSize > 0 ? pageSize : 1;
  const offset = Math.max(range.startIndex, 0);
  const limit = safePageSize;
  const page = Math.floor(offset / safePageSize) + 1;
  return { page, offset, limit };
}
