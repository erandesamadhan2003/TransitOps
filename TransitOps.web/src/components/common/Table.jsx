import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { cn } from "@/utils/cn";
import { Loader } from "./Loader";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { Pagination } from "./Pagination";

/**
 * Smart Table wrapper.
 *
 * Props:
 *   columns       – TanStack column defs array
 *   data          – row data array
 *   isLoading     – shows skeleton rows while true
 *   error         – ErrorState if truthy
 *   onRetry       – retry callback for ErrorState
 *   emptyTitle    – title when data is empty
 *   emptyDescription – subtitle when data is empty
 *   emptyAction   – optional CTA node for empty state
 *   pagination    – optional { page, pageSize, totalElements, onPageChange }
 *   className     – extra class on the wrapper div
 */
export function Table({
  columns = [],
  data = [],
  isLoading = false,
  error,
  onRetry,
  emptyTitle = "No data",
  emptyDescription,
  emptyAction,
  pagination,
  className,
}) {
  const resolvedData = Array.isArray(data)
    ? data
    : data?.vehicles || data?.drivers || data?.trips || data?.logs || data?.expenses || data?.users || data?.data || [];

  const table = useReactTable({
    data: resolvedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (error) {
    return (
      <div className="p-8">
        <ErrorState message={error?.message || "Failed to load data."} onRetry={onRetry} />
      </div>
    );
  }

  const rows = table.getRowModel().rows;
  const isEmpty = !isLoading && rows.length === 0;

  return (
    <div className={cn("w-full", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-[13px] text-text-primary">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b border-border bg-ink-50/60"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left font-semibold text-text-secondary uppercase tracking-wider text-[11px]"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading
              ? // Skeleton rows
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/60 animate-pulse">
                    {columns.map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 rounded bg-ink-100/60 w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              : rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-border/60 last:border-0 hover:bg-ink-50/40 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {isEmpty && (
        <div className="py-16">
          <EmptyState
            title={emptyTitle}
            description={emptyDescription}
            action={emptyAction}
          />
        </div>
      )}

      {pagination && pagination.totalElements > pagination.pageSize && (
        <div className="border-t border-border px-4 py-3">
          <Pagination
            page={pagination.page}
            pageSize={pagination.pageSize}
            totalElements={pagination.totalElements}
            onPageChange={pagination.onPageChange}
          />
        </div>
      )}
    </div>
  );
}
