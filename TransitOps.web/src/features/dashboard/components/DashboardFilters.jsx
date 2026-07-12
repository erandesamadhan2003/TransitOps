import { Select } from "@/components/forms";
import { VEHICLE_TYPES, VEHICLE_STATUS_LABELS, REGIONS } from "@/constants/app";

export function DashboardFilters({ filters, onChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Select
        placeholder="Vehicle Type: All"
        value={filters.vehicleType ?? ""}
        onChange={(e) =>
          onChange({ ...filters, vehicleType: e.target.value || undefined })
        }
        options={VEHICLE_TYPES.map((t) => ({ value: t, label: t }))}
        containerClassName="w-44"
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
        containerClassName="w-44"
      />
      <Select
        placeholder="Region: All"
        value={filters.region ?? ""}
        onChange={(e) =>
          onChange({ ...filters, region: e.target.value || undefined })
        }
        options={REGIONS.map((r) => ({ value: r, label: r }))}
        containerClassName="w-44"
      />
    </div>
  );
}
