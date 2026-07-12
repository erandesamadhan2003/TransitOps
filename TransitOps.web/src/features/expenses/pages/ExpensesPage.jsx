import { useState } from "react";
import { Plus, Fuel, Receipt } from "lucide-react";
import { Card, CardHeader, StatCard } from "@/components/ui";
import { Button, Loader, Pagination } from "@/components/common";
import {
  useFuelLogs,
  useExpenses,
  useCreateFuelLog,
  useCreateExpense,
} from "../hooks";
import { permissionService } from "@/services/permission.service";
import { formatCurrency } from "@/utils/format";
import { useVehicles } from "@/features/vehicles/hooks";
import { useForm } from "react-hook-form";
import { Modal, Input } from "@/components/common";
import { Select } from "@/components/forms";
import { EXPENSE_CATEGORIES } from "@/constants/app";

function FuelLogModal({ open, onClose, vehicles }) {
  const create = useCreateFuelLog();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { vehicleId: "", logDate: "", liters: "", cost: "" },
  });
  const onSubmit = (v) => {
    create
      .mutateAsync({
        vehicleId: Number(v.vehicleId),
        liters: Number(v.liters),
        cost: Number(v.cost),
        logDate: v.logDate,
      })
      .then(() => { reset(); onClose(); })
      .catch(() => {});
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Log Fuel Fill"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} loading={create.isPending}>
            Log Fuel
          </Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Vehicle"
          placeholder="Select vehicle"
          containerClassName="sm:col-span-2"
          options={Array.isArray(vehicles) ? vehicles.map((v) => ({
            value: v.id,
            label: `${v.vehicleName} (${v.registrationNumber})`,
          })) : []}
          {...register("vehicleId")}
        />
        <Input label="Date" type="date" {...register("logDate")} />
        <Input label="Liters" type="number" placeholder="42" {...register("liters")} />
        <Input
          label="Cost"
          type="number"
          placeholder="3150"
          containerClassName="sm:col-span-2"
          {...register("cost")}
        />
      </div>
    </Modal>
  );
}

function ExpenseModal({ open, onClose, vehicles }) {
  const create = useCreateExpense();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { vehicleId: "", category: "", amount: "", description: "", expenseDate: "" },
  });
  const onSubmit = (v) => {
    create
      .mutateAsync({
        vehicleId: Number(v.vehicleId) || undefined,
        category: v.category,
        amount: Number(v.amount),
        description: v.description,
        expenseDate: v.expenseDate,
      })
      .then(() => { reset(); onClose(); })
      .catch(() => {});
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Log Expense"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} loading={create.isPending}>
            Log Expense
          </Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Vehicle (optional)"
          placeholder="Select vehicle"
          containerClassName="sm:col-span-2"
          options={Array.isArray(vehicles) ? vehicles.map((v) => ({
            value: v.id,
            label: `${v.vehicleName} (${v.registrationNumber})`,
          })) : []}
          {...register("vehicleId")}
        />
        <Select
          label="Category"
          placeholder="Select category"
          options={EXPENSE_CATEGORIES.map((c) => ({ value: c, label: c }))}
          {...register("category")}
        />
        <Input label="Amount" type="number" placeholder="150" {...register("amount")} />
        <Input label="Date" type="date" {...register("expenseDate")} />
        <Input label="Description" placeholder="Highway toll pass" {...register("description")} />
      </div>
    </Modal>
  );
}

export default function ExpensesPage() {
  const canEdit = permissionService.can("fuelExpenses", "edit");
  const [fuelOpen, setFuelOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [fuelPage, setFuelPage] = useState(1);
  const [expensePage, setExpensePage] = useState(1);
  const { data: fuelLogs = [], isLoading: fuelLoading } = useFuelLogs({ page: fuelPage, pageSize: 10 });
  const { data: expenses = [] } = useExpenses({ page: expensePage, pageSize: 10 });
  const { data: vehicles = [] } = useVehicles();

  const resolvedFuelLogs = Array.isArray(fuelLogs) ? fuelLogs : (fuelLogs?.logs || fuelLogs?.data || []);
  const resolvedExpenses = Array.isArray(expenses) ? expenses : (expenses?.expenses || expenses?.data || []);

  const totalFuelCost = resolvedFuelLogs.reduce((s, f) => s + Number(f.cost || 0), 0);
  const totalExpenses = resolvedExpenses.reduce((s, e) => s + Number(e.amount || 0), 0);
  const totalOp = totalFuelCost + totalExpenses;

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Fuel & Expenses
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Track fuel consumption and trip-related expenses.
          </p>
        </div>
        {canEdit && (
          <div className="flex gap-2">
            <Button variant="secondary" icon={<Plus size={16} />} onClick={() => setExpenseOpen(true)}>
              Log Expense
            </Button>
            <Button icon={<Plus size={16} />} onClick={() => setFuelOpen(true)}>
              Log Fuel
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Total Fuel Cost" value={formatCurrency(totalFuelCost)} accent="ink" icon={<Fuel size={18} />} />
        <StatCard label="Other Expenses" value={formatCurrency(totalExpenses)} accent="amber" icon={<Receipt size={18} />} />
        <StatCard label="Total Operational Cost" value={formatCurrency(totalOp)} accent="slate" className="col-span-2 lg:col-span-1" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Fuel Logs" />
          {fuelLoading ? (
            <Loader />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-text-secondary">
                    <th className="py-2 pr-3 font-semibold">Vehicle</th>
                    <th className="py-2 pr-3 font-semibold">Date</th>
                    <th className="py-2 pr-3 font-semibold">Liters</th>
                    <th className="py-2 font-semibold text-right">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {resolvedFuelLogs.map((log) => (
                    <tr key={log.id} className="border-b border-border/60 last:border-0">
                      <td className="py-2.5 pr-3">{log.vehicleName ?? log.vehicleId}</td>
                      <td className="py-2.5 pr-3 text-text-secondary">{log.logDate?.slice(0, 10)}</td>
                      <td className="py-2.5 pr-3">{log.liters} L</td>
                      <td className="py-2.5 text-right font-medium">{formatCurrency(log.cost)}</td>
                    </tr>
                  ))}
                  {!resolvedFuelLogs.length && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-text-secondary">No fuel logs yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          <Pagination 
            page={fuelPage} 
            totalPages={fuelLogs?.pagination?.totalPages || 0} 
            onPageChange={setFuelPage} 
          />
        </Card>

        <Card>
          <CardHeader title="General Expenses" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-text-secondary">
                  <th className="py-2 pr-3 font-semibold">Category</th>
                  <th className="py-2 pr-3 font-semibold">Date</th>
                  <th className="py-2 pr-3 font-semibold">Description</th>
                  <th className="py-2 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {resolvedExpenses.map((exp) => (
                  <tr key={exp.id} className="border-b border-border/60 last:border-0">
                    <td className="py-2.5 pr-3">{exp.category}</td>
                    <td className="py-2.5 pr-3 text-text-secondary">{exp.expenseDate?.slice(0, 10)}</td>
                    <td className="py-2.5 pr-3 text-text-secondary">{exp.description || "—"}</td>
                    <td className="py-2.5 text-right font-medium">{formatCurrency(exp.amount)}</td>
                  </tr>
                ))}
                {!resolvedExpenses.length && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-text-secondary">No expenses yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination 
            page={expensePage} 
            totalPages={expenses?.pagination?.totalPages || 0} 
            onPageChange={setExpensePage} 
          />
        </Card>
      </div>

      {canEdit && (
        <>
          <FuelLogModal open={fuelOpen} onClose={() => setFuelOpen(false)} vehicles={vehicles} />
          <ExpenseModal open={expenseOpen} onClose={() => setExpenseOpen(false)} vehicles={vehicles} />
        </>
      )}
    </div>
  );
}
