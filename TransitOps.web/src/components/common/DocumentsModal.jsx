import { useState } from "react";
import { X, FileText, Trash2, Download, Upload, CheckCircle } from "lucide-react";
import { Button, Modal, Input } from "@/components/common";

export function DocumentsModal({
  isOpen,
  onClose,
  entityId,
  entityName,
  canEdit,
  documents = [],
  isLoading,
  onUpload,
  onDelete,
  onVerify,
}) {
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !docType) return;

    const formData = new FormData();
    formData.append("document", file);
    formData.append("docType", docType);
    if (expiryDate) {
      formData.append("expiryDate", expiryDate);
    }

    setIsUploading(true);
    try {
      await onUpload({ id: entityId, formData });
      setFile(null);
      setDocType("");
      setExpiryDate("");
      // Reset file input via form reset or uncontrolled ref, here we just clear state
      const fileInput = document.getElementById("document-upload-file");
      if (fileInput) fileInput.value = "";
    } finally {
      setIsUploading(false);
    }
  };

  const getFileUrl = (path) => {
    if (!path) return "#";
    if (path.startsWith("http")) return path;
    
    const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
    const baseUrl = apiBase.replace("/api", "");
    return `${baseUrl}${path}`;
  };

  return (
    <Modal open={isOpen} onClose={onClose} title={`Documents: ${entityName}`}>
      <div className="space-y-6">
        {/* Upload Form */}
        {canEdit && (
          <form
            onSubmit={handleUpload}
            className="rounded-lg border border-border bg-ink-50 p-4"
          >
            <h4 className="mb-3 text-sm font-semibold text-text-primary">
              Upload New Document
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="docType" className="block text-sm font-medium text-text-secondary">Document Type *</label>
                <Input
                  id="docType"
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  placeholder="e.g. Insurance, License"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="expiryDate" className="block text-sm font-medium text-text-secondary">Expiry Date</label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <label htmlFor="document-upload-file" className="block text-sm font-medium text-text-secondary">File *</label>
                <input
                  id="document-upload-file"
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="block w-full text-sm text-text-secondary
                    file:mr-4 file:rounded-md file:border-0
                    file:bg-brand-50 file:px-4
                    file:py-2 file:text-sm
                    file:font-semibold file:text-brand-700
                    hover:file:bg-brand-100"
                  required
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                disabled={!file || !docType || isUploading}
                icon={<Upload size={16} />}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </form>
        )}

        {/* Documents List */}
        <div>
          <h4 className="mb-3 text-sm font-semibold text-text-primary">
            Attached Documents
          </h4>
          {isLoading ? (
            <p className="text-sm text-text-secondary">Loading...</p>
          ) : documents.length === 0 ? (
            <p className="text-sm text-text-tertiary italic">
              No documents attached.
            </p>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => {
                const isExpired =
                  doc.expiryDate && new Date(doc.expiryDate) < new Date();

                return (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-ink-50/50"
                  >
                    <a
                      href={getFileUrl(doc.filePath)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          isExpired ? "bg-red-50 text-red-600" : "bg-ink-100 text-ink-600"
                        }`}
                      >
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-text-primary hover:underline">
                          {doc.docType}
                        </p>
                        {doc.expiryDate && (
                          <p
                            className={`text-xs ${
                              isExpired ? "font-semibold text-red-600" : "text-text-secondary"
                            }`}
                          >
                            Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                            {isExpired && " (Expired)"}
                          </p>
                        )}
                        <span className={`text-[11px] px-1.5 py-0.5 rounded-sm font-medium ${doc.isVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {doc.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                    </a>
                    <div className="flex items-center gap-2">
                      <a
                        href={getFileUrl(doc.filePath)}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded p-2 text-text-secondary hover:bg-ink-200 hover:text-text-primary"
                        title="View Document"
                      >
                        <Download size={18} />
                      </a>
                      {canEdit && (
                        <>
                          {onVerify && (
                            <button
                              onClick={() => onVerify({ id: entityId, docId: doc.id, isVerified: !doc.isVerified })}
                              className={`rounded p-2 text-text-secondary hover:text-text-primary ${doc.isVerified ? 'hover:bg-amber-50' : 'hover:bg-green-50'}`}
                              title={doc.isVerified ? "Unverify Document" : "Verify Document"}
                            >
                              {doc.isVerified ? <X size={18} /> : <CheckCircle size={18} />}
                            </button>
                          )}
                          <button
                            onClick={() => onDelete({ id: entityId, docId: doc.id })}
                            className="rounded p-2 text-text-secondary hover:bg-red-50 hover:text-red-600"
                            title="Delete Document"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
