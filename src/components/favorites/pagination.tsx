'use client'

import { usePathname, useSearchParams } from 'next/navigation'

import {
  Pagination as PaginationNav,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'

import { cn } from '@/lib/utils'

export interface PaginationProps {
  totalPages: number
  totalPagesToDisplay?: number
  page: number
  totalDocs: number
}

export const Pagination = ({
  totalPages,
  totalPagesToDisplay = 5,
  totalDocs
}: PaginationProps) => {
  const itemsPerPage = 10
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentPage = Math.min(
    Math.max(1, Number(searchParams.get('page')) || 1),
    totalPages
  )

  const startPost = Math.min((currentPage - 1) * itemsPerPage + 1, totalDocs)
  const endPost = Math.min(currentPage * itemsPerPage, totalDocs)

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  const showLeftEllipsis = currentPage - 1 > totalPagesToDisplay / 2
  const showRightEllipsis =
    totalPages - currentPage + 1 > totalPagesToDisplay / 2

  const getPageNumbers = () => {
    if (totalPages <= totalPagesToDisplay) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    } else {
      const half = Math.floor(totalPagesToDisplay / 2)
      // To ensure that the current page is always in the middle
      let start = currentPage - half
      let end = currentPage + half
      // If the current page is near the start
      if (start < 1) {
        start = 1
        end = totalPagesToDisplay
      }
      // If the current page is near the end
      if (end > totalPages) {
        start = totalPages - totalPagesToDisplay + 1
        end = totalPages
      }
      // If showLeftEllipsis is true, add an ellipsis before the start page
      if (showLeftEllipsis) {
        start++
      }
      // If showRightEllipsis is true, add an ellipsis after the end page
      if (showRightEllipsis) {
        end--
      }
      return Array.from({ length: end - start + 1 }, (_, i) => start + i)
    }
  }

  const renderPaginationItems = () => {
    const pageNumbers = getPageNumbers()
    return pageNumbers.map(pageNumber => (
      <PaginationItem key={pageNumber}>
        <PaginationLink
          href={createPageURL(pageNumber)}
          isActive={pageNumber === currentPage}
        >
          {pageNumber}
        </PaginationLink>
      </PaginationItem>
    ))
  }

  return (
    <div className='flex flex-col items-center gap-y-2'>
      <PaginationNav>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={createPageURL(currentPage - 1)}
              aria-disabled={currentPage === 1}
              className={cn(
                currentPage === 1 && 'pointer-events-none opacity-50'
              )}
            />
          </PaginationItem>
          {showLeftEllipsis && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {renderPaginationItems()}
          {showRightEllipsis && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext
              href={createPageURL(currentPage + 1)}
              aria-disabled={currentPage === totalPages}
              className={cn(
                currentPage === totalPages && 'pointer-events-none opacity-50'
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationNav>

      <p className='text-xs text-zinc-400'>{`Showing ${startPost} to ${endPost} of ${totalDocs}`}</p>
    </div>
  )
}
