import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button, Input, Modal } from "@/components/common";
import { Select } from "@/components/forms";
import { ROLE_OPTIONS } from "@/constants/app";
import { useCreateUser, useUpdateUser } from "../hooks";

const schema = z.object({
  fullName: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  roleName: z.string().min(1, "Role is required"),
  password: z.string().optional(),
});

export function UserFormModal({ isOpen, onClose, user }) {
  const isEditing = !!user;
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      roleName: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (user) {
        reset({
          fullName: user.fullName || "",
          email: user.email || "",
          roleName: user.roleName || "",
          password: "", // Never prefill password
        });
      } else {
        reset({
          fullName: "",
          email: "",
          roleName: "",
          password: "",
        });
      }
    }
  }, [isOpen, user, reset]);

  const onSubmit = (data) => {
    if (isEditing) {
      const payload = { ...data };
      if (!payload.password) delete payload.password;
      updateUser.mutate(
        { id: user.id, payload },
        {
          onSuccess: onClose,
        }
      );
    } else {
      if (!data.password) {
        data.password = "password123"; // fallback just in case
      }
      createUser.mutate(data, {
        onSuccess: onClose,
      });
    }
  };

  const isPending = createUser.isPending || updateUser.isPending;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Edit User" : "Add User"} open={isOpen}>
      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input
              label="Full Name"
              placeholder="e.g. Jane Doe"
              error={errors.fullName?.message}
              {...register("fullName")}
            />
          </div>
          <div className="sm:col-span-2">
            <Input
              label="Email Address"
              type="email"
              placeholder="jane@transitops.com"
              error={errors.email?.message}
              {...register("email")}
            />
          </div>
          <div>
            <Select
              label="Role"
              options={ROLE_OPTIONS}
              error={errors.roleName?.message}
              {...register("roleName")}
            />
          </div>
          <div>
            <Input
              label={isEditing ? "New Password (Optional)" : "Password"}
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={isPending}>
            {isEditing ? "Save Changes" : "Create User"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
