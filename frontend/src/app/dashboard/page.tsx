"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import SimilarIncidentCard from "@/components/SimilarIncidentCard";
import QueryAgent from "@/components/QueryAgent";
import RCAResponse from "@/components/RCAResponse";

export default function DashboardPage() {
  const [result, setResult] = useState<any>(null);
  
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold">
            HindsightOps Dashboard
          </h1>

          <p className="text-zinc-400 mt-2">
            AI-Powered Incident Intelligence & Memory Recall
          </p>
        </motion.div>

        {/* Query Agent */}
        <QueryAgent onResult={setResult} />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* RCA Panel */}
          <div className="lg:col-span-2">
            <RCAResponse data={result} />
          </div>

          {/* Analytics Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
          >
            <h2 className="text-xl font-semibold mb-4">
              Incident Analytics
            </h2>

            <div className="h-64 flex items-center justify-center text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
              Analytics Chart
            </div>
          </motion.div>

        </div>

        {/* Similar Incidents */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              Similar Historical Incidents
            </h2>

            <span className="text-sm text-blue-400">
              Powered by Hindsight Memory
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {result?.similarIncidents?.map(
              (incident: any, index: number) => (
                <SimilarIncidentCard
                  key={
                    incident.incident_id ||
                    incident.memory_id ||
                    incident.id ||
                    index
                  }
                  incident={incident}
                />
              )
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );

  
}