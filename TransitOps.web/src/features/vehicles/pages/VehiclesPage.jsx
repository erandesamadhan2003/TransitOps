import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Truck } from "lucide-react";
import { Card, StatusBadge } from "@/components/ui";
import { Button, Table, ConfirmDialog } from "@/components/common";
import { useVehicles, useDeleteVehicle } from "../hooks";
import { VehicleFilters } from "../components/VehicleFilters";
import { VehicleFormModal } from "../components/VehicleFormModal";
import { useDebounce } from "@/hooks";
import { formatCurrency, formatNumber } from "@/utils/format";
import { permissionService } from "@/services/permission.service";

export default function VehiclesPage() {
  const canEdit = permissionService.can("fleet", "edit");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});
  const debouncedSearch = useDebounce(filters.search, 350);
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useVehicles({ ...filters, search: debouncedSearch, page, pageSize: 10 });
  const deleteVehicle = useDeleteVehicle();

  const [formOpen, setFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  function openCreate() {
    setEditingVehicle(null);
    setFormOpen(true);
  }
  function openEdit(v) {
    setEditingVehicle(v);
    setFormOpen(true);
  }

  const columns = useMemo(
    () => [
      {
        header: "Reg. No.",
        accessorKey: "registrationNumber",
        cell: (info) => (
          <span className="font-mono text-xs">{info.getValue()}</span>
        ),
      },
      { header: "Name / Model", accessorKey: "vehicleName" },
      { header: "Type", accessorKey: "vehicleType" },
      {
        header: "Capacity",
        accessorKey: "maxCapacity",
        cell: (info) => `${formatNumber(info.getValue())} kg`,
      },
      {
        header: "Odometer",
        accessorKey: "odometer",
        cell: (info) => `${formatNumber(info.getValue())} km`,
      },
      {
        header: "Purchase Cost",
        accessorKey: "purchaseCost",
        cell: (info) => formatCurrency(info.getValue()),
      },
      { header: "Region", accessorKey: "region" },
      {
        header: "Status",
        accessorKey: "status",
        cell: (info) => <StatusBadge status={info.getValue()} />,
      },
      ...(canEdit
        ? [
            {
              header: "",
              id: "actions",
              cell: ({ row }) => (
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEdit(row.original);
                    }}
                    aria-label={`Edit ${row.original.vehicleName}`}
                    className="rounded-lg p-1.5 text-text-tertiary hover:bg-ink-50 hover:text-ink-600"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDelete(row.original);
                    }}
                    aria-label={`Remove ${row.original.vehicleName}`}
                    className="rounded-lg p-1.5 text-text-tertiary hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ),
            },
          ]
        : []),
    ],
    [canEdit],
  );

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Vehicle Registry
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Master list of every vehicle in the fleet.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <VehicleFilters filters={filters} onChange={(f) => { setFilters(f); setPage(1); }} />
          {canEdit && (
            <Button icon={<Plus size={16} />} onClick={openCreate}>
              Add Vehicle
            </Button>
          )}
        </div>
      </div>

      <Card>
        <Table
          columns={columns}
          data={data?.vehicles || []}
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
          pagination={{
            page,
            pageSize: 10,
            totalElements: data?.pagination?.total || 0,
            onPageChange: setPage,
          }}
          emptyTitle="No vehicles yet"
          emptyDescription="Add your first vehicle to start building the registry."
          emptyAction={
            canEdit && (
              <Button icon={<Plus size={16} />} onClick={openCreate}>
                Add Vehicle
              </Button>
            )
          }
        />
        <p className="mt-4 flex items-center gap-1.5 text-xs text-amber-700">
          <Truck size={13} />
          Rule: Registration No. must be unique · Retired / In Shop vehicles are
          hidden from the Trip Dispatcher.
        </p>
      </Card>

      {canEdit && (
        <VehicleFormModal
          open={formOpen}
          onClose={() => setFormOpen(false)}
          vehicle={editingVehicle}
        />
      )}

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() =>
          deleteVehicle.mutate(confirmDelete.id, {
            onSuccess: () => setConfirmDelete(null),
          })
        }
        title={`Remove ${confirmDelete?.vehicleName}?`}
        description="This can't be undone. The vehicle will be retired from the registry and any dispatch pools."
        confirmLabel="Retire Vehicle"
        loading={deleteVehicle.isPending}
      />
    </div>
  );
}
