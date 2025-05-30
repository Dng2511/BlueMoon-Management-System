import * as React from "react"

/**
 * Usage Example:
 * 
 * const pagination = usePagination({
 *   initialPage: 1,
 *   initialPageSize: 10,
 *   onPageChange: (page, pageSize) => {
 *     // Handle page change - refetch data with new page/limit
 *     fetchData({ page: page - 1, limit: pageSize }) // Convert to 0-based for API
 *   }
 * })
 * 
 * // In your component:
 * <Button onClick={() => pagination.nextPage()}>Next</Button>
 * <Button onClick={() => pagination.previousPage()}>Previous</Button>
 * <Select onValueChange={(value) => pagination.setPageSize(Number(value))}>...</Select>
 */

export interface UsePaginationProps {
  initialPage?: number
  initialPageSize?: number
  onPageChange?: (page: number, pageSize: number) => void
}

export interface UsePaginationReturn {
  currentPage: number
  pageSize: number
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  nextPage: () => void
  previousPage: () => void
  goToFirstPage: () => void
  goToLastPage: (totalPages: number) => void
  canGoNext: (totalPages: number) => boolean
  canGoPrevious: () => boolean
  getPageNumbers: (totalPages: number, maxVisible?: number) => number[]
}

export function usePagination({
  initialPage = 1,
  initialPageSize = 10,
  onPageChange,
}: UsePaginationProps = {}): UsePaginationReturn {
  const [currentPage, setCurrentPage] = React.useState(initialPage)
  const [pageSize, setPageSize] = React.useState(initialPageSize)

  const setPage = React.useCallback((page: number) => {
    setCurrentPage(page)
    onPageChange?.(page, pageSize)
  }, [pageSize, onPageChange])

  const setPageSizeHandler = React.useCallback((size: number) => {
    setPageSize(size)
    setCurrentPage(1) // Reset to first page when changing page size
    onPageChange?.(1, size)
  }, [onPageChange])

  const nextPage = React.useCallback(() => {
    setPage(currentPage + 1)
  }, [currentPage, setPage])

  const previousPage = React.useCallback(() => {
    if (currentPage > 1) {
      setPage(currentPage - 1)
    }
  }, [currentPage, setPage])

  const goToFirstPage = React.useCallback(() => {
    setPage(1)
  }, [setPage])

  const goToLastPage = React.useCallback((totalPages: number) => {
    setPage(totalPages)
  }, [setPage])

  const canGoNext = React.useCallback((totalPages: number) => {
    return currentPage < totalPages
  }, [currentPage])

  const canGoPrevious = React.useCallback(() => {
    return currentPage > 1
  }, [currentPage])

  const getPageNumbers = React.useCallback((totalPages: number, maxVisible: number = 5) => {
    const pages: number[] = []
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show pages around current page
      const halfVisible = Math.floor(maxVisible / 2)
      let start = Math.max(1, currentPage - halfVisible)
      let end = Math.min(totalPages, start + maxVisible - 1)
      
      // Adjust start if we're near the end
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1)
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }
    
    return pages
  }, [currentPage])

  return {
    currentPage,
    pageSize,
    setPage,
    setPageSize: setPageSizeHandler,
    nextPage,
    previousPage,
    goToFirstPage,
    goToLastPage,
    canGoNext,
    canGoPrevious,
    getPageNumbers,
  }
} 