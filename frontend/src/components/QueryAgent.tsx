"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface IncidentResponse {
  answer: string;
  rootCause: string;
  resolution: string;
  confidence: number;
  similarIncidents: any[];
  analytics?: any;
}

interface QueryAgentProps {
  onResult: (data: IncidentResponse) => void;
}

const loadingSteps = [
  "Searching Hindsight Memory...",
  "Finding Similar Incidents...",
  "Analyzing Root Cause...",
  "Generating Resolution..."
];

export default function QueryAgent({
  onResult,
}: QueryAgentProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleSubmit = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setCurrentStep(0);

    const interval = setInterval(() => {
      setCurrentStep((prev) =>
        prev < loadingSteps.length - 1 ? prev + 1 : prev
      );
    }, 1200);

    try {
      const response = await fetch(
        "http://localhost:8000/api/query",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query,
          }),
        }
      );

      const data = await response.json();

      onResult(data);
    } catch (error) {
      console.error(error);

      onResult({
        answer: "Unable to retrieve incident data.",
        rootCause: "Unknown",
        resolution: "Retry request.",
        confidence: 0,
        similarIncidents: [],
      });
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
      <h2 className="text-xl font-semibold mb-4">
        Incident Agent
      </h2>

      <div className="flex gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Database latency spike after deployment..."
          className="flex-1 rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 outline-none focus:border-blue-500"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Search size={18} />
          )}

          Analyze
        </button>
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            className="mt-6"
          >
            <div className="space-y-3">
              {loadingSteps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-3"
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      index <= currentStep
                        ? "bg-blue-500"
                        : "bg-zinc-700"
                    }`}
                  />

                  <span
                    className={`text-sm ${
                      index <= currentStep
                        ? "text-white"
                        : "text-zinc-500"
                    }`}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}