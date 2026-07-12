import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, Button, Input } from "@/components/common";
import { Select } from "@/components/forms";
import { driverSchema } from "../schemas";
import { useCreateDriver, useUpdateDriver } from "../hooks";
import { LICENSE_CATEGORIES } from "@/constants/app";

const DEFAULTS = {
  name: "",
  licenseNumber: "",
  licenseCategory: "",
  licenseExpiry: "",
  contactNumber: "",
  safetyScore: 100,
};

export function DriverFormModal({ open, onClose, driver }) {
  const isEdit = Boolean(driver);
  const create = useCreateDriver();
  const update = useUpdateDriver();
  const pending = create.isPending || update.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(driverSchema), defaultValues: DEFAULTS });

  useEffect(() => {
    if (open) reset(driver ? { ...DEFAULTS, ...driver } : DEFAULTS);
  }, [open, driver, reset]);

  function onSubmit(values) {
    const mutation = isEdit
      ? update.mutateAsync({ id: driver.id, payload: values })
      : create.mutateAsync(values);
    mutation.then(onClose).catch(() => {});
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Driver" : "Add Driver"}
      description="License number must be unique across all drivers."
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} loading={pending}>
            {isEdit ? "Save Changes" : "Add Driver"}
          </Button>
        </>
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <Input
          label="Full Name"
          placeholder="Alex"
          required
          containerClassName="sm:col-span-2"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="License Number"
          placeholder="DL-88213"
          required
          error={errors.licenseNumber?.message}
          {...register("licenseNumber")}
        />
        <Select
          label="License Category"
          required
          placeholder="Select category"
          options={LICENSE_CATEGORIES.map((c) => ({ value: c, label: c }))}
          error={errors.licenseCategory?.message}
          {...register("licenseCategory")}
        />
        <Input
          label="License Expiry"
          type="date"
          required
          error={errors.licenseExpiry?.message}
          {...register("licenseExpiry")}
        />
        <Input
          label="Contact Number"
          placeholder="9876500000"
          required
          error={errors.contactNumber?.message}
          {...register("contactNumber")}
        />
        <Input
          label="Safety Score"
          type="number"
          min="0"
          max="100"
          placeholder="100"
          error={errors.safetyScore?.message}
          {...register("safetyScore")}
        />
      </form>
    </Modal>
  );
}
