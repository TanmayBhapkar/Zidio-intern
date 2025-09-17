import React, { useEffect, useState } from "react";
import api from "../api/axios.js";

export default function History() {
  const [items, setItems] = useState([]);

  const load = async () => {
    const { data } = await api.get("/datasets");
    setItems(data);
  };
  useEffect(() => { load(); }, []);

  const del = async (id) => {
    if (!confirm("Delete this dataset?")) return;
    await api.delete("/datasets/" + id);
    load();
  };

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Upload History</h3>
      <table>
        <thead>
          <tr><th>Name</th><th>File</th><th>Rows</th><th>Created</th><th></th></tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i._id}>
              <td>{i.name}</td>
              <td>{i.originalFilename}</td>
              <td>{i.rows?.length || 0}</td>
              <td>{new Date(i.createdAt).toLocaleString()}</td>
              <td><button className="btn" onClick={() => del(i._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
