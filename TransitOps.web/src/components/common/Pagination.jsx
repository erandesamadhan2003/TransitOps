import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";

export function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-2 py-3">
      <p className="text-[13px] text-text-secondary">
        Page <strong>{page}</strong> of <strong>{totalPages}</strong>
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
          leftIcon={<ChevronLeft size={14} />}
        >
          Prev
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
          rightIcon={<ChevronRight size={14} />}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
