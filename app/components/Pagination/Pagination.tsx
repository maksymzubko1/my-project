import { useLocation } from "@remix-run/react";
import { useCallback } from "react";

import { getPages } from "~/components/Pagination/utils";
import {
  Pagination as PaginationBlock,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/shadcn/ui/pagination";

interface PaginationProps {
  total: number;
  current: number;
  hasPrev: boolean;
  hasNext: boolean;
}

const Pagination = ({ total, current, hasNext, hasPrev }: PaginationProps) => {
  const location = useLocation();

  const getPage = useCallback(
    (variant: "prev" | "next" | "custom", pageNumber?: number) => {
      const page =
        pageNumber !== undefined
          ? pageNumber
          : variant === "prev"
            ? current - 1
            : current + 1;

      if (location.search.length > 0) {
        if (page === current) {
          return `${location.search}#`;
        }

        const search = location.search
          .replace("?", "")
          .split("&")
          .filter((s) => !s.includes("page="))
          .join("&");

        return `?${search}${search.length > 0 ? "&" : ""}page=${page}`;
      }

      if (page === current) {
        return `?page=${page}#`;
      }

      return `?page=${page}`;
    },
    [location, current],
  );

  const Pages = useCallback(() => {
    const pages = getPages(current, total);

    return (
      <>
        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              className={`${current === page ? "bg-blue-300" : "bg-muted"} hover:bg-blue-300`}
              href={current === page ? "#" : getPage("custom", page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
      </>
    );
  }, [total, current, getPage]);

  if (current === 1 && total === current) {
    return <></>;
  }

  return (
    <PaginationBlock>
      <PaginationContent>
        {hasPrev ? (
          <PaginationItem>
            <PaginationPrevious
              className="bg-muted hover:bg-blue-300"
              href={getPage("prev")}
            />
          </PaginationItem>
        ) : null}
        {current > 3 ? (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        ) : null}
        <Pages />
        {total - current >= 3 ? (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        ) : null}
        {hasNext ? (
          <PaginationItem>
            <PaginationNext
              className="bg-muted hover:bg-blue-300"
              href={getPage("next")}
            />
          </PaginationItem>
        ) : null}
      </PaginationContent>
    </PaginationBlock>
  );
};

export default Pagination;
