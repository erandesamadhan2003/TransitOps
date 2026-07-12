import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal, Button, Input } from "@/components/common";
import { Select } from "@/components/forms";
import { useCreateMaintenance } from "../hooks";
import { useVehicles } from "@/features/vehicles/hooks";
import { positiveNumber, requiredString } from "@/utils/validators";

const schema = z.object({
  vehicleId: z.coerce.number().min(1, "Select a vehicle"),
  issue: requiredString("Issue"),
  description: z.string().optional(),
  cost: positiveNumber("Cost"),
  startDate: z.string().min(1, "Start date is required"),
});

const DEFAULTS = {
  vehicleId: "",
  issue: "",
  description: "",
  cost: "",
  startDate: "",
};

export function MaintenanceFormModal({ open, onClose }) {
  const create = useCreateMaintenance();
  // Only show Active (Available + On Trip) vehicles — exclude Retired
  const { data: allVehicles = [] } = useVehicles();
  const vehicles = allVehicles.filter(
    (v) => v.status !== "Retired"
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues: DEFAULTS });

  useEffect(() => {
    if (open) reset(DEFAULTS);
  }, [open, reset]);

  function onSubmit(values) {
    create
      .mutateAsync({
        vehicleId: Number(values.vehicleId),
        issue: values.issue,
        description: values.description,
        cost: Number(values.cost),
        startDate: values.startDate,
      })
      .then(onClose)
      .catch(() => {});
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Log Maintenance"
      description="The vehicle will be marked In Shop until this record is closed."
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={create.isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} loading={create.isPending}>
            Log Record
          </Button>
        </>
      }
    >
      <form noValidate className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="Vehicle"
          required
          placeholder="Select vehicle"
          containerClassName="sm:col-span-2"
          options={vehicles.map((v) => ({
            value: v.id,
            label: `${v.vehicleName} (${v.registrationNumber})`,
          }))}
          error={errors.vehicleId?.message}
          {...register("vehicleId")}
        />
        <Input
          label="Issue"
          required
          placeholder="Brake Replacement"
          containerClassName="sm:col-span-2"
          error={errors.issue?.message}
          {...register("issue")}
        />
        <Input
          label="Description"
          placeholder="Optional details"
          containerClassName="sm:col-span-2"
          {...register("description")}
        />
        <Input
          label="Estimated Cost"
          type="number"
          required
          placeholder="2500"
          error={errors.cost?.message}
          {...register("cost")}
        />
        <Input
          label="Start Date"
          type="date"
          required
          error={errors.startDate?.message}
          {...register("startDate")}
        />
      </form>
    </Modal>
  );
}
