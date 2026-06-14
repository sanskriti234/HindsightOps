"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Database,
} from "lucide-react";

interface SimilarIncident {
  incident_id: string;
  similarity: number;
  summary: string;
  root_cause: string;
  resolution: string;
}

interface SimilarIncidentCardProps {
  incident: SimilarIncident;
  onView?: (incident: SimilarIncident) => void;
}

export default function SimilarIncidentCard({
  incident,
  onView,
}: SimilarIncidentCardProps) {
  const similarityPercentage = Math.round(
    incident.similarity * 100
  );

  return (
    <motion.div
      whileHover={{
        y: -5,
        scale: 1.01,
      }}
      whileTap={{
        scale: 0.98,
      }}
      transition={{
        duration: 0.2,
      }}
      className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 cursor-pointer hover:border-blue-500/50"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Database
            size={18}
            className="text-blue-400"
          />

          <span className="font-semibold">
            {incident.incident_id}
          </span>
        </div>

        <div className="px-2 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400">
          {similarityPercentage}% Match
        </div>
      </div>

      {/* Summary */}
      <div className="mb-4">
        <h3 className="text-sm text-zinc-400 mb-2">
          Incident Summary
        </h3>

        <p className="text-sm leading-relaxed text-zinc-200">
          {incident.summary}
        </p>
      </div>

      {/* Root Cause */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle
            size={16}
            className="text-yellow-400"
          />

          <span className="text-sm font-medium">
            Root Cause
          </span>
        </div>

        <p className="text-sm text-zinc-300">
          {incident.root_cause}
        </p>
      </div>

      {/* Resolution */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2
            size={16}
            className="text-green-400"
          />

          <span className="text-sm font-medium">
            Resolution
          </span>
        </div>

        <p className="text-sm text-zinc-300 line-clamp-3">
          {incident.resolution}
        </p>
      </div>

      {/* Footer */}
      <button
        onClick={() => onView?.(incident)}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 transition px-4 py-2"
      >
        View Details

        <ArrowRight size={16} />
      </button>
    </motion.div>
  );
}