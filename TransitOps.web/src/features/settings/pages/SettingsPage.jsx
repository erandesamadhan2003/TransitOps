import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Settings, Shield } from "lucide-react";
import { Card, CardHeader } from "@/components/ui";
import { Button, Input, Loader } from "@/components/common";
import { Select } from "@/components/forms";
import { useSettings, useUpdateSettings } from "../hooks";
import { permissionService } from "@/services/permission.service";
import { ROLES, ROLE_LABELS } from "@/constants/app";
import { authService } from "@/services/auth.service";

const RBAC_MATRIX = {
  [ROLES.FLEET_MANAGER]: {
    fleet: "edit",
    drivers: "edit",
    trips: "none",
    fuelExpenses: "none",
    analytics: "edit",
  },
  [ROLES.DISPATCHER]: {
    fleet: "view",
    drivers: "none",
    trips: "edit",
    fuelExpenses: "none",
    analytics: "none",
  },
  [ROLES.SAFETY_OFFICER]: {
    fleet: "none",
    drivers: "edit",
    trips: "view",
    fuelExpenses: "none",
    analytics: "none",
  },
  [ROLES.FINANCIAL_ANALYST]: {
    fleet: "view",
    drivers: "none",
    trips: "none",
    fuelExpenses: "edit",
    analytics: "edit",
  },
};

const MODULES = ["fleet", "drivers", "trips", "fuelExpenses", "analytics"];
const MODULE_LABELS = {
  fleet: "Fleet",
  drivers: "Drivers",
  trips: "Trips",
  fuelExpenses: "Fuel & Expenses",
  analytics: "Analytics",
};

function RBACTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-[11px] uppercase tracking-wide text-text-secondary">
            <th className="py-2 pr-4 text-left font-semibold">Role</th>
            {MODULES.map((m) => (
              <th key={m} className="py-2 px-3 text-center font-semibold">
                {MODULE_LABELS[m]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(RBAC_MATRIX).map(([role, perms]) => (
            <tr key={role} className="border-b border-border/60 last:border-0">
              <td className="py-2.5 pr-4 font-medium text-text-primary">
                {ROLE_LABELS[role]}
              </td>
              {MODULES.map((m) => {
                const level = perms[m];
                return (
                  <td key={m} className="py-2.5 px-3 text-center">
                    <span
                      className={`text-xs font-medium ${level === "edit" ? "text-green-600" : level === "view" ? "text-amber-600" : "text-text-tertiary"}`}
                    >
                      {level === "none" ? "—" : level}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SettingsPage() {
  const { data: settings, isLoading } = useSettings();
  const update = useUpdateSettings();
  const currentUser = authService.getUser();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      depotName: "",
      currency: "INR",
      distanceUnit: "Kilometers",
    },
  });

  useEffect(() => {
    if (settings) reset(settings);
  }, [settings, reset]);

  return (
    <div className="animate-fade-up space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Settings
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Manage depot configuration and view access control rules.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="General"
            subtitle="Depot and display preferences"
          />
          {isLoading ? (
            <Loader />
          ) : (
            <form
              onSubmit={handleSubmit((v) => update.mutate(v))}
              className="mt-4 space-y-4"
            >
              <Input label="Depot Name" {...register("depotName")} />
              <Select
                label="Currency"
                options={[
                  { value: "INR", label: "INR (₹)" },
                  { value: "USD", label: "USD ($)" },
                ]}
                {...register("currency")}
              />
              <Select
                label="Distance Unit"
                options={[
                  { value: "Kilometers", label: "Kilometers" },
                  { value: "Miles", label: "Miles" },
                ]}
                {...register("distanceUnit")}
              />
              <div className="flex justify-end">
                <Button type="submit" loading={update.isPending}>
                  Save Settings
                </Button>
              </div>
            </form>
          )}
        </Card>

        <Card>
          <CardHeader
            title="Current Session"
            subtitle="Your signed-in account details"
          />
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-ink-50/40 px-4 py-3">
              <div className="brand-gradient flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white">
                {currentUser?.name?.charAt(0) ?? "?"}
              </div>
              <div>
                <p className="font-semibold text-text-primary">
                  {currentUser?.name ?? "Guest"}
                </p>
                <p className="text-xs text-text-secondary">
                  {currentUser?.email}
                </p>
                <p className="text-xs font-medium text-ink-500">
                  {ROLE_LABELS[currentUser?.role] ?? currentUser?.role}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Role & Access Control (RBAC)"
          subtitle="Read-only — module access level per role"
          icon={<Shield size={16} />}
        />
        <div className="mt-4">
          <RBACTable />
        </div>
      </Card>
    </div>
  );
}
