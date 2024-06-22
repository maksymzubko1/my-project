export function getPages(currentPage: number, totalNumber: number): number[] {
  const delta = 2;
  const pages = [];

  const start = Math.max(1, currentPage - delta);
  const end = Math.min(totalNumber, currentPage + delta);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
}
