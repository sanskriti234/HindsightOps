"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface Props {
  analytics?: any;
}

export default function IncidentAnalytics({
  analytics
}: Props) {

  if (!analytics) {
    return (
      <div className="h-64 flex items-center justify-center text-zinc-500">
        Run a query to generate analytics.
      </div>
    );
  }

  const data = Object.entries(
    analytics.root_causes || {}
  ).map(
    ([name, value]) => ({
      name,
      count: value
    })
  );

  return (
    <div className="h-72">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />

          <Bar
            dataKey="count"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}