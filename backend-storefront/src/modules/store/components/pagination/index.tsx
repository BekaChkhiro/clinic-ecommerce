"use client"

import { clx } from "@medusajs/ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export function Pagination({
  page,
  totalPages,
  'data-testid': dataTestid
}: {
  page: number
  totalPages: number
  'data-testid'?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const arrayRange = (start: number, stop: number) =>
    Array.from({ length: stop - start + 1 }, (_, index) => start + index)

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", newPage.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  const renderPageButton = (
    p: number,
    label: string | number,
    isCurrent: boolean
  ) => (
    <button
      key={p}
      className={clx(
        "w-10 h-10 rounded-xl text-sm font-medium transition-all duration-200",
        isCurrent
          ? "bg-brand-red text-white shadow-md shadow-brand-red/25"
          : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200"
      )}
      disabled={isCurrent}
      onClick={() => handlePageChange(p)}
    >
      {label}
    </button>
  )

  const renderEllipsis = (key: string) => (
    <span
      key={key}
      className="w-10 h-10 flex items-center justify-center text-gray-400 text-sm"
    >
      ...
    </span>
  )

  const renderPageButtons = () => {
    const buttons = []

    if (totalPages <= 7) {
      buttons.push(
        ...arrayRange(1, totalPages).map((p) =>
          renderPageButton(p, p, p === page)
        )
      )
    } else {
      if (page <= 4) {
        buttons.push(
          ...arrayRange(1, 5).map((p) => renderPageButton(p, p, p === page))
        )
        buttons.push(renderEllipsis("ellipsis1"))
        buttons.push(
          renderPageButton(totalPages, totalPages, totalPages === page)
        )
      } else if (page >= totalPages - 3) {
        buttons.push(renderPageButton(1, 1, 1 === page))
        buttons.push(renderEllipsis("ellipsis2"))
        buttons.push(
          ...arrayRange(totalPages - 4, totalPages).map((p) =>
            renderPageButton(p, p, p === page)
          )
        )
      } else {
        buttons.push(renderPageButton(1, 1, 1 === page))
        buttons.push(renderEllipsis("ellipsis3"))
        buttons.push(
          ...arrayRange(page - 1, page + 1).map((p) =>
            renderPageButton(p, p, p === page)
          )
        )
        buttons.push(renderEllipsis("ellipsis4"))
        buttons.push(
          renderPageButton(totalPages, totalPages, totalPages === page)
        )
      }
    }

    return buttons
  }

  return (
    <div className="flex justify-center w-full mt-12" data-testid={dataTestid}>
      <div className="flex items-center gap-2">
        {/* Previous */}
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className={clx(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 border",
            page === 1
              ? "border-gray-100 text-gray-300 cursor-not-allowed"
              : "border-gray-200 bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          )}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        {renderPageButtons()}

        {/* Next */}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className={clx(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 border",
            page === totalPages
              ? "border-gray-100 text-gray-300 cursor-not-allowed"
              : "border-gray-200 bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          )}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
