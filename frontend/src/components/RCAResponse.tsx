"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Brain,
  Gauge,
} from "lucide-react";

interface RCAResponseProps {
  data?: {
    executiveSummary: string;
    incidentAssessment: string;
    rootCause: string;
    resolution: string;
    confidence: number;
  } | null;
}

export default function RCAResponse({
  data,
}: RCAResponseProps) {
  if (!data) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        <h2 className="text-xl font-semibold mb-4">
          Root Cause Analysis
        </h2>

        <div className="h-100 flex items-center justify-center text-zinc-500">
          Submit an incident query to begin analysis.
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          Root Cause Analysis
        </h2>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
          <Gauge size={16} />
          <span className="text-sm">
            {data.confidence}% Confidence
          </span>
        </div>
      </div>

      {/* Executive Summary */}

      <div className="mb-6">

        <h3 className="font-medium mb-3">
          🧠 Executive Summary
        </h3>

        <div className="rounded-xl bg-zinc-900 p-4 border border-zinc-800">

          <p className="leading-relaxed text-zinc-200">
            {data.executiveSummary}
          </p>

        </div>

      </div>

      {/* Assessment */}

      <div className="mb-6">

        <h3 className="font-medium mb-3">
          🔍 Incident Assessment
        </h3>

        <div className="rounded-xl bg-zinc-900 p-4 border border-zinc-800">

          <p className="whitespace-pre-line">
            {data.incidentAssessment}
          </p>

        </div>

      </div>

      {/* Root Cause */}

      <div className="mb-6">

        <h3 className="font-medium mb-3">
          ⚠️ Most Likely Root Cause
        </h3>

        <div className="rounded-xl bg-zinc-900 p-4 border border-zinc-800">

          <p className="leading-relaxed">
            {data.rootCause}
          </p>

        </div>

      </div>

      {/* Resolution */}

      <div>

        <h3 className="font-medium mb-3">
          🛠 Recommended Actions
        </h3>

        <div className="rounded-xl bg-zinc-900 p-4 border border-zinc-800">

          <p className="whitespace-pre-line">
            {data.resolution}
          </p>

        </div>

      </div>
    </motion.div>
  );
}