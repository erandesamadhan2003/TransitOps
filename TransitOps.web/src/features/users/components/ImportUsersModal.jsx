import { useState, useRef } from "react";
import { Upload, X, FileSpreadsheet, AlertCircle } from "lucide-react";
import { Button, Modal } from "@/components/common";
import { useImportUsers } from "../hooks";

export function ImportUsersModal({ isOpen, onClose }) {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const importUsers = useImportUsers();

  function handleFileChange(e) {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      setFile(dropped);
    }
  }

  function handleImport() {
    if (!file) return;
    importUsers.mutate(file, {
      onSuccess: () => {
        setFile(null);
        onClose();
      },
    });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Import Users" open={isOpen}>
      <div className="p-6">
        <div className="mb-6 rounded-lg border border-teal-200 bg-teal-50/50 p-4 text-sm text-teal-800">
          <p className="font-semibold mb-1">Bulk Import Instructions</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Download the template using the button on the main page.</li>
            <li>Fill in Full Name, Email, Password, and Role (Admin, Dispatcher, Fleet Manager, etc.).</li>
            <li>Upload the completed .xlsx or .csv file below.</li>
          </ul>
        </div>

        <div
          className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${file ? "border-teal-500 bg-teal-50/30" : "border-border hover:border-ink-400 hover:bg-ink-50/30"}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={handleFileChange}
          />

          {file ? (
            <>
              <div className="mb-3 rounded-full bg-teal-100 p-3 text-teal-600">
                <FileSpreadsheet size={24} />
              </div>
              <p className="text-sm font-semibold text-text-primary">
                {file.name}
              </p>
              <p className="mt-1 text-xs text-text-secondary">
                {(file.size / 1024).toFixed(1)} KB
              </p>
              <button
                type="button"
                className="absolute right-4 top-4 rounded-full p-1 text-text-tertiary hover:bg-red-50 hover:text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
              >
                <X size={16} />
              </button>
            </>
          ) : (
            <>
              <div className="mb-3 rounded-full bg-ink-100 p-3 text-ink-600 transition-transform group-hover:scale-110">
                <Upload size={24} />
              </div>
              <p className="text-sm font-medium text-text-primary">
                Click to upload or drag and drop
              </p>
              <p className="mt-1 text-xs text-text-secondary">
                CSV or Excel (.xlsx)
              </p>
            </>
          )}
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleImport}
            disabled={!file}
            loading={importUsers.isPending}
          >
            Import Users
          </Button>
        </div>
      </div>
    </Modal>
  );
}
