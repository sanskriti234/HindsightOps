"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface Props {
  analytics: any;
}

export default function IncidentAnalytics({
  analytics
}: Props) {

  if (!analytics) {
    return (
      <div className="h-87.5 flex items-center justify-center text-zinc-500">
        Run a query to generate analytics.
      </div>
    );
  }

  const similarityData =
    analytics.similarity_distribution || [];

  const categoryData =
    Object.entries(
      analytics.category_distribution || {}
    ).map(
      ([name, value]) => ({
        name,
        value
      })
    );

  return (

    <div className="space-y-8">

      {/* Similarity Chart */}

      <div className="h-62.5">

        <h3 className="text-sm font-medium mb-3">
          Similar Incident Scores
        </h3>

        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart
            data={similarityData}
          >
            <XAxis dataKey="incident" />
            <YAxis />
            <Tooltip />

            <Bar
              dataKey="score"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

      </div>

      {/* Category Distribution */}

      <div className="h-62.5">

        <h3 className="text-sm font-medium mb-3">
          Incident Categories
        </h3>

        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <PieChart>

            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              label
            >

              {categoryData.map(
                (_, index) => (
                  <Cell
                    key={index}
                  />
                )
              )}

            </Pie>

            <Tooltip />

          </PieChart>
        </ResponsiveContainer>

      </div>

      {/* Metrics */}

      <div className="grid grid-cols-2 gap-4">

        <div className="rounded-xl bg-zinc-900 p-4">

          <p className="text-zinc-400 text-sm">
            Historical Matches
          </p>

          <p className="text-2xl font-bold mt-1">
            {
              analytics.total_matches
            }
          </p>

        </div>

        <div className="rounded-xl bg-zinc-900 p-4">

          <p className="text-zinc-400 text-sm">
            Avg Similarity
          </p>

          <p className="text-2xl font-bold mt-1">
            {
              analytics.avg_similarity
            }%
          </p>

        </div>

      </div>

    </div>
  );
}

