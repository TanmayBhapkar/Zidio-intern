import React, { useState } from "react";
import api from "../api/axios.js";

export default function UploadModal({ open, onClose, onUploaded }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  if (!open) return null;

  const send = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const { data } = await api.post("/datasets/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUploaded?.(data);
      onClose();
    } catch (e) {
      alert(e.response?.data?.error || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="panel card" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginTop: 0 }}>Upload Excel (.xlsx, .xls)</h3>
        <input type="file" accept=".xlsx,.xls" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <div className="spacer"></div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn" onClick={send} disabled={loading || !file}>
            {loading ? "Uploading..." : "Upload"}
          </button>
          <button className="btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
