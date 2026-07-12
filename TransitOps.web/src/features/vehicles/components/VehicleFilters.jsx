import { Search } from "lucide-react";
import { Select } from "@/components/forms";
import { VEHICLE_TYPES, VEHICLE_STATUS_LABELS } from "@/constants/app";

export function VehicleFilters({ filters, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        placeholder="Type: All"
        value={filters.type ?? ""}
        onChange={(e) =>
          onChange({ ...filters, type: e.target.value || undefined })
        }
        options={VEHICLE_TYPES.map((t) => ({ value: t, label: t }))}
        containerClassName="w-40"
      />
      <Select
        placeholder="Status: All"
        value={filters.status ?? ""}
        onChange={(e) =>
          onChange({ ...filters, status: e.target.value || undefined })
        }
        options={Object.entries(VEHICLE_STATUS_LABELS).map(
          ([value, label]) => ({ value, label }),
        )}
        containerClassName="w-40"
      />
      <div className="relative w-56">
        <Search
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
        />
        <input
          type="search"
          placeholder="Search reg. no…"
          value={filters.search ?? ""}
          onChange={(e) =>
            onChange({ ...filters, search: e.target.value || undefined })
          }
          className="h-10 w-full rounded-lg border border-border-strong bg-white pl-9 pr-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-ink-500 focus:outline-none"
        />
      </div>
    </div>
  );
}
