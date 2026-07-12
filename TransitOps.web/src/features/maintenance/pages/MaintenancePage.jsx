import { useMemo, useState } from "react";
import { Plus, CheckCircle2, Wrench } from "lucide-react";
import { Card } from "@/components/ui";
import { Button, Table, ConfirmDialog } from "@/components/common";
import { useMaintenance, useCloseMaintenance } from "../hooks";
import { MaintenanceFormModal } from "../components/MaintenanceFormModal";
import { permissionService } from "@/services/permission.service";
import { formatCurrency } from "@/utils/format";
import { MAINTENANCE_STATUS } from "@/constants/app";
import { cn } from "@/utils/cn";

export default function MaintenancePage() {
  const canEdit = permissionService.can("fleet", "edit");
  const { data: records = [], isLoading, error, refetch } = useMaintenance();
  const close = useCloseMaintenance();

  const [formOpen, setFormOpen] = useState(false);
  const [confirmClose, setConfirmClose] = useState(null);

  const columns = useMemo(
    () => [
      {
        header: "Vehicle",
        accessorKey: "vehicleId",
        cell: (info) => (
          <span className="font-mono text-xs">{info.getValue()}</span>
        ),
      },
      { header: "Issue", accessorKey: "issue" },
      { header: "Start Date", accessorKey: "startDate", cell: (info) => info.getValue()?.slice(0, 10) ?? "—" },
      {
        header: "Cost",
        accessorKey: "cost",
        cell: (info) => formatCurrency(info.getValue()),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (info) => {
          const val = info.getValue();
          return (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                val === MAINTENANCE_STATUS.OPEN
                  ? "bg-amber-50 text-amber-700"
                  : "bg-green-50 text-green-700",
              )}
            >
              {val}
            </span>
          );
        },
      },
      {
        header: "Notes",
        accessorKey: "notes",
        cell: (info) => info.getValue() || "—",
      },
      ...(canEdit
        ? [
            {
              header: "",
              id: "actions",
              cell: ({ row }) =>
                row.original.status === MAINTENANCE_STATUS.OPEN ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={<CheckCircle2 size={13} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmClose(row.original);
                    }}
                  >
                    Close
                  </Button>
                ) : null,
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
            Maintenance
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Track all vehicle service and repair records.
          </p>
        </div>
        {canEdit && (
          <Button icon={<Plus size={16} />} onClick={() => setFormOpen(true)}>
            Log Maintenance
          </Button>
        )}
      </div>

      <Card>
        <Table
          columns={columns}
          data={records}
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
          emptyTitle="No maintenance records"
          emptyDescription="Log your first maintenance record to track vehicle health."
          emptyAction={
            canEdit && (
              <Button
                icon={<Plus size={16} />}
                onClick={() => setFormOpen(true)}
              >
                Log Maintenance
              </Button>
            )
          }
        />
        <p className="mt-4 flex items-center gap-1.5 text-xs text-amber-700">
          <Wrench size={13} />
          Rule: Active maintenance puts the vehicle In Shop — closing it returns
          it to Available.
        </p>
      </Card>

      {canEdit && (
        <MaintenanceFormModal
          open={formOpen}
          onClose={() => setFormOpen(false)}
        />
      )}

      <ConfirmDialog
        open={Boolean(confirmClose)}
        onClose={() => setConfirmClose(null)}
        onConfirm={() =>
          close.mutate(
            { id: confirmClose.id, payload: {} },
            { onSuccess: () => setConfirmClose(null) },
          )
        }
        title="Close maintenance record?"
        description="The vehicle will be returned to Available status."
        confirmLabel="Close Record"
        tone="secondary"
        loading={close.isPending}
      />
    </div>
  );
}
