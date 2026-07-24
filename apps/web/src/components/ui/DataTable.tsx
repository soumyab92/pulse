import { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "./Skeleton";

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  onSortChange?: (key: string) => void;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  emptyState?: ReactNode;
  skeletonRows?: number;
}

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  sortBy,
  sortDir,
  onSortChange,
  onRowClick,
  isLoading,
  emptyState,
  skeletonRows = 6,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border">
            {columns.map((col) => (
              <th key={col.key} className={cn("px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-text-tertiary", col.className)}>
                {col.sortable ? (
                  <button
                    onClick={() => onSortChange?.(col.key)}
                    className="inline-flex items-center gap-1 transition-colors hover:text-text-secondary"
                  >
                    {col.header}
                    {sortBy === col.key ? (
                      sortDir === "asc" ? (
                        <ArrowUp className="h-3 w-3" />
                      ) : (
                        <ArrowDown className="h-3 w-3" />
                      )
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-40" />
                    )}
                  </button>
                ) : (
                  col.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading &&
            Array.from({ length: skeletonRows }).map((_, i) => (
              <tr key={i} className="border-b border-border">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    <Skeleton className="h-4 w-full max-w-[140px]" />
                  </td>
                ))}
              </tr>
            ))}

          {!isLoading && rows.length === 0 && (
            <tr>
              <td colSpan={columns.length}>{emptyState}</td>
            </tr>
          )}

          {!isLoading &&
            rows.map((row, idx) => (
              <motion.tr
                key={getRowId(row)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15, delay: Math.min(idx * 0.02, 0.3) }}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "border-b border-border transition-colors duration-150 last:border-b-0",
                  onRowClick && "cursor-pointer hover:bg-bg",
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className={cn("px-4 py-3 text-text-primary", col.className)}>
                    {col.render(row)}
                  </td>
                ))}
              </motion.tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
