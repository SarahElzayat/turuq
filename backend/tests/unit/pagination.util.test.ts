import { buildPaginationMeta, parsePagination, DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT } from "../../src/utils/pagination";

describe("parsePagination", () => {
  it("defaults page and limit when neither is provided", () => {
    expect(parsePagination(undefined, undefined)).toEqual({
      page: DEFAULT_PAGE,
      limit: DEFAULT_LIMIT,
      skip: 0,
    });
  });

  it("clamps a non-positive page to the default", () => {
    expect(parsePagination(0, 10).page).toBe(DEFAULT_PAGE);
    expect(parsePagination(-5, 10).page).toBe(DEFAULT_PAGE);
  });

  it("clamps a non-positive limit to the default", () => {
    expect(parsePagination(1, 0).limit).toBe(DEFAULT_LIMIT);
    expect(parsePagination(1, -5).limit).toBe(DEFAULT_LIMIT);
  });

  it("clamps a limit above the max to the max", () => {
    expect(parsePagination(1, 10_000).limit).toBe(MAX_LIMIT);
  });

  it("computes skip from page and limit", () => {
    expect(parsePagination(3, 10)).toEqual({ page: 3, limit: 10, skip: 20 });
  });
});

describe("buildPaginationMeta", () => {
  it("computes totalPages from total and limit", () => {
    expect(buildPaginationMeta(1, 10, 42)).toEqual({ page: 1, limit: 10, total: 42, totalPages: 5 });
  });

  it("returns zero totalPages when there are no results", () => {
    expect(buildPaginationMeta(1, 10, 0)).toEqual({ page: 1, limit: 10, total: 0, totalPages: 0 });
  });
});
