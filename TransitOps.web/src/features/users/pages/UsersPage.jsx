import { useState } from "react";
import { Plus, Download, Upload, Shield, UserCog, Mail } from "lucide-react";
import { Button, ErrorState, Input, Table } from "@/components/common";
import { StatusBadge, Badge } from "@/components/ui";
import { useUsers } from "../hooks";
import { ImportUsersModal } from "../components/ImportUsersModal";
import { UserFormModal } from "../components/UserFormModal";
import { ROLE_LABELS } from "@/constants/app";
import { ENDPOINTS } from "@/api/endpoints";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  const { data, isLoading, error, refetch } = useUsers({
    page,
    pageSize: 10,
    search,
  });

  const columns = [
    {
      header: "User",
      accessorKey: "fullName",
      cell: ({ row }) => {
        const user = row.original;
        return (
        <div className="flex items-center gap-3">
          <div className="brand-gradient flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white">
            {user.fullName.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-text-primary">{user.fullName}</span>
            <span className="flex items-center gap-1 text-[11px] text-text-secondary">
              <Mail size={10} />
              {user.email}
            </span>
          </div>
        </div>
      )},
    },
    {
      header: "Role",
      accessorKey: "roleName",
      cell: ({ row }) => {
        const user = row.original;
        return (
        <div className="flex items-center gap-1.5 text-sm text-text-secondary">
          <Shield size={14} className="text-ink-500" />
          {ROLE_LABELS[user.roleName] || user.roleName}
        </div>
      )},
    },
    {
      header: "Status",
      accessorKey: "isActive",
      cell: ({ row }) => {
        const user = row.original;
        return (
        <Badge variant={user.isActive ? "success" : "error"}>
          {user.isActive ? "Active" : "Deactivated"}
        </Badge>
      )},
    },
    {
      header: "Last Login",
      accessorKey: "lastLogin",
      cell: ({ row }) => {
        const user = row.original;
        return (
        <span className="text-sm text-text-secondary">
          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}
        </span>
      )},
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedUser(user);
              setIsFormOpen(true);
            }}
            icon={<UserCog size={14} />}
          >
            Manage
          </Button>
        </div>
      )},
    },
  ];

  function handleDownloadTemplate() {
    window.open(`${import.meta.env.VITE_API_URL}${ENDPOINTS.USERS.IMPORT_TEMPLATE}`, "_blank");
  }

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            User Management
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage system access, roles, and bulk import users.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon={<Download size={16} />}
            onClick={handleDownloadTemplate}
          >
            Template
          </Button>
          <Button
            variant="outline"
            icon={<Upload size={16} />}
            onClick={() => setIsImportOpen(true)}
          >
            Import
          </Button>
          <Button
            variant="primary"
            icon={<Plus size={16} />}
            onClick={() => {
              setSelectedUser(null);
              setIsFormOpen(true);
            }}
          >
            Add User
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface shadow-sm">
        <div className="border-b border-border p-4">
          <div className="max-w-xs">
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        {error ? (
          <div className="p-8">
            <ErrorState message={error.message} onRetry={refetch} />
          </div>
        ) : (
          <Table
            columns={columns}
            data={data?.users || []}
            isLoading={isLoading}
            pagination={{
              page,
              pageSize: 10,
              totalElements: data?.total || 0,
              onPageChange: setPage,
            }}
          />
        )}
      </div>

      <UserFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        user={selectedUser}
      />
      <ImportUsersModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
      />
    </div>
  );
}
