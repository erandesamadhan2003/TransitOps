import { useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Ban,
  CheckCircle,
  Users,
  Search,
  AlertTriangle,
} from "lucide-react";
import { Card, StatusBadge } from "@/components/ui";
import { Button, Table, ConfirmDialog } from "@/components/common";
import { Select } from "@/components/forms";
import { useDrivers, useSuspendDriver, useReinstateDriver } from "../hooks";
import { DriverFormModal } from "../components/DriverFormModal";
import { useDebounce } from "@/hooks";
import { permissionService } from "@/services/permission.service";
import { DRIVER_STATUS, DRIVER_STATUS_LABELS } from "@/constants/app";

export default function DriversPage() {
  const canEdit = permissionService.can("drivers", "edit");
  const [filters, setFilters] = useState({});
  const debouncedSearch = useDebounce(filters.search, 350);
  const {
    data: drivers = [],
    isLoading,
    error,
    refetch,
  } = useDrivers({ ...filters, search: debouncedSearch });
  const suspendDriver = useSuspendDriver();
  const reinstateDriver = useReinstateDriver();

  const [formOpen, setFormOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [confirmSuspend, setConfirmSuspend] = useState(null);
  const [confirmReinstate, setConfirmReinstate] = useState(null);

  function openCreate() {
    setEditingDriver(null);
    setFormOpen(true);
  }
  function openEdit(d) {
    setEditingDriver(d);
    setFormOpen(true);
  }

  const isExpired = (expiry) => expiry && new Date(expiry) < new Date();

  const columns = useMemo(
    () => [
      { header: "Name", accessorKey: "name" },
      {
        header: "License No.",
        accessorKey: "licenseNumber",
        cell: (info) => (
          <span className="font-mono text-xs">{info.getValue()}</span>
        ),
      },
      { header: "Category", accessorKey: "licenseCategory" },
      {
        header: "License Expiry",
        accessorKey: "licenseExpiry",
        cell: (info) => {
          const val = info.getValue();
          return (
            <span
              className={`inline-flex items-center gap-1 ${isExpired(val) ? "text-red-600 font-medium" : ""}`}
            >
              {val ?? "—"}
              {isExpired(val) && <AlertTriangle size={13} />}
            </span>
          );
        },
      },
      { header: "Contact", accessorKey: "contactNumber" },
      {
        header: "Safety Score",
        accessorKey: "safetyScore",
        cell: (info) => {
          const score = info.getValue();
          const color =
            score >= 90
              ? "text-green-600"
              : score >= 70
                ? "text-amber-600"
                : "text-red-600";
          return (
            <span className={`font-semibold ${color}`}>{score ?? "—"}</span>
          );
        },
      },
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
                    aria-label={`Edit ${row.original.name}`}
                    className="rounded-lg p-1.5 text-text-tertiary hover:bg-ink-50 hover:text-ink-600"
                  >
                    <Pencil size={14} />
                  </button>
                  {row.original.status !== DRIVER_STATUS.SUSPENDED ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmSuspend(row.original);
                      }}
                      aria-label={`Suspend ${row.original.name}`}
                      className="rounded-lg p-1.5 text-text-tertiary hover:bg-red-50 hover:text-red-600"
                    >
                      <Ban size={14} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmReinstate(row.original);
                      }}
                      aria-label={`Reinstate ${row.original.name}`}
                      className="rounded-lg p-1.5 text-text-tertiary hover:bg-green-50 hover:text-green-600"
                    >
                      <CheckCircle size={14} />
                    </button>
                  )}
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
            Drivers
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage all registered drivers and their availability.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select
            placeholder="Status: All"
            value={filters.status ?? ""}
            onChange={(e) =>
              setFilters((f) => ({ ...f, status: e.target.value || undefined }))
            }
            options={Object.entries(DRIVER_STATUS_LABELS).map(
              ([value, label]) => ({ value, label }),
            )}
            containerClassName="w-40"
          />
          <div className="relative w-52">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
            />
            <input
              type="search"
              placeholder="Search name / license…"
              value={filters.search ?? ""}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  search: e.target.value || undefined,
                }))
              }
              className="h-10 w-full rounded-lg border border-border-strong bg-white pl-9 pr-3 text-sm focus:border-ink-500 focus:outline-none"
            />
          </div>
          {canEdit && (
            <Button icon={<Plus size={16} />} onClick={openCreate}>
              Add Driver
            </Button>
          )}
        </div>
      </div>

      <Card>
        <Table
          columns={columns}
          data={drivers}
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
          emptyTitle="No drivers yet"
          emptyDescription="Add your first driver to get started."
          emptyAction={
            canEdit && (
              <Button icon={<Plus size={16} />} onClick={openCreate}>
                Add Driver
              </Button>
            )
          }
        />
        <p className="mt-4 flex items-center gap-1.5 text-xs text-amber-700">
          <Users size={13} />
          Rule: Suspended drivers and those with expired licenses cannot be
          dispatched.
        </p>
      </Card>

      {canEdit && (
        <DriverFormModal
          open={formOpen}
          onClose={() => setFormOpen(false)}
          driver={editingDriver}
        />
      )}

      <ConfirmDialog
        open={Boolean(confirmSuspend)}
        onClose={() => setConfirmSuspend(null)}
        onConfirm={() =>
          suspendDriver.mutate(confirmSuspend.id, {
            onSuccess: () => setConfirmSuspend(null),
          })
        }
        title={`Suspend ${confirmSuspend?.name}?`}
        description="Suspended drivers cannot be assigned to new trips."
        confirmLabel="Suspend Driver"
        loading={suspendDriver.isPending}
      />

      <ConfirmDialog
        open={Boolean(confirmReinstate)}
        onClose={() => setConfirmReinstate(null)}
        onConfirm={() =>
          reinstateDriver.mutate(confirmReinstate.id, {
            onSuccess: () => setConfirmReinstate(null),
          })
        }
        title={`Reinstate ${confirmReinstate?.name}?`}
        description="This will return the driver to Available status."
        confirmLabel="Reinstate Driver"
        loading={reinstateDriver.isPending}
        tone="secondary"
      />
    </div>
  );
}
