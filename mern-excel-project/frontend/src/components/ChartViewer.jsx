import React from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  PieChart, Pie, ResponsiveContainer
} from "recharts";

export default function ChartViewer({ data, xKey, yKey, type = "line" }) {
  if (!data?.length) return <div>No data</div>;
  if (!xKey || !yKey) return <div>Select X and Y</div>;

  return (
    <div style={{ width: "100%", height: 360 }}>
      <ResponsiveContainer>
        {type === "line" ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={yKey} dot={false} />
          </LineChart>
        ) : type === "bar" ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={yKey} />
          </BarChart>
        ) : (
          <PieChart>
            <Pie data={data} dataKey={yKey} nameKey={xKey} label />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
