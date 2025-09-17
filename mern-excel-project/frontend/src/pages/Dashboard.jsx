import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axios.js";
import UploadModal from "../components/UploadModal.jsx";
import ChartViewer from "../components/ChartViewer.jsx";

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [datasets, setDatasets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [xKey, setXKey] = useState("");
  const [yKey, setYKey] = useState("");
  const [type, setType] = useState("line");

  const load = async () => {
    const { data } = await api.get("/datasets");
    setDatasets(data);
    if (data.length) {
      const first = await api.get(`/datasets/${data[0]._id}`);
      setSelected(first.data);
    }
  };
  useEffect(() => { load(); }, []);

  const columns = useMemo(() => selected?.columns?.map((c) => c.key) || [], [selected]);
  const rows = selected?.rows || [];

  return (
    <div>
      <div className="row">
        <div className="card" style={{ flex: "1 1 320px" }}>
          <h3 style={{ marginTop: 0 }}>Datasets</h3>
          <button className="btn" onClick={() => setOpen(true)}>Upload Dataset</button>
          <div className="spacer"></div>
          <div style={{ maxHeight: 260, overflow: "auto" }}>
            <table>
              <thead><tr><th>Name</th><th>Rows</th><th>Created</th></tr></thead>
              <tbody>
                {datasets.map((d) => (
                  <tr key={d._id}
                      onClick={async () => { const { data } = await api.get(`/datasets/${d._id}`); setSelected(data); }}
                      style={{ cursor: "pointer" }}>
                    <td>{d.name}</td>
                    <td>{d.rows?.length || 0}</td>
                    <td>{new Date(d.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card" style={{ flex: "2 1 520px" }}>
          <h3 style={{ marginTop: 0 }}>Chart</h3>
          <div className="row">
            <select className="input" value={xKey} onChange={(e) => setXKey(e.target.value)}>
              <option value="">X Axis</option>
              {columns.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="input" value={yKey} onChange={(e) => setYKey(e.target.value)}>
              <option value="">Y Axis</option>
              {columns.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="line">Line</option>
              <option value="bar">Bar</option>
              <option value="pie">Pie</option>
            </select>
          </div>
          <div className="spacer"></div>
          <ChartViewer data={rows} xKey={xKey} yKey={yKey} type={type} />
        </div>
      </div>

      <UploadModal open={open} onClose={() => setOpen(false)} onUploaded={load} />
    </div>
  );
}
