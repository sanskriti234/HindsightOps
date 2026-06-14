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
    answer: string;
    rootCause: string;
    resolution: string;
    confidence: number;
    postmortem?: string;
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

      {/* AI Summary */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Brain
            size={18}
            className="text-purple-400"
          />

          <h3 className="font-medium">
            AI Incident Assessment
          </h3>
        </div>

        <div className="rounded-xl bg-zinc-900 p-4 border border-zinc-800">
          <p className="text-zinc-200 leading-relaxed">
            {data.answer}
          </p>
        </div>
      </div>

      {/* Root Cause */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle
            size={18}
            className="text-yellow-400"
          />

          <h3 className="font-medium">
            Root Cause
          </h3>
        </div>

        <div className="rounded-xl bg-zinc-900 p-4 border border-zinc-800">
          <p>{data.rootCause}</p>
        </div>
      </div>

      {/* Resolution */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2
            size={18}
            className="text-green-400"
          />

          <h3 className="font-medium">
            Recommended Resolution
          </h3>
        </div>

        <div className="rounded-xl bg-zinc-900 p-4 border border-zinc-800">
          <p className="whitespace-pre-line">
            {data.resolution}
          </p>
        </div>
      </div>

      {/* Postmortem */}
      {data.postmortem && (
        <div>
          <h3 className="font-medium mb-2">
            Preventive Recommendations
          </h3>

          <div className="rounded-xl bg-zinc-900 p-4 border border-zinc-800">
            <p className="text-zinc-300">
              {data.postmortem}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}