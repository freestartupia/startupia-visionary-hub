
import { useState } from 'react';

interface UsePaginationProps {
  initialPage?: number;
  initialPageSize?: number;
  totalItems?: number;
}

export function usePagination({
  initialPage = 1,
  initialPageSize = 10,
  totalItems = 0
}: UsePaginationProps = {}) {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [total, setTotal] = useState<number>(totalItems);
  
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const goToPage = (page: number) => {
    const pageNumber = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(pageNumber);
  };

  return {
    currentPage,
    pageSize,
    totalPages,
    total,
    setTotal,
    nextPage,
    prevPage,
    goToPage,
    setPageSize,
    pageItems: {
      skip: (currentPage - 1) * pageSize,
      take: pageSize
    }
  };
}
