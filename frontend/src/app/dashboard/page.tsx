"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import MentalModelCard
from "@/components/MentalModelCard";
import QueryAgent from "@/components/QueryAgent";
import RCAResponse from "@/components/RCAResponse";

export default function DashboardPage() {

  const [result, setResult] =
    useState<any>(null);

  return (

    <div className="min-h-screen bg-black text-white">

      <div className="max-w-6xl mx-auto px-6 py-8 pb-40">

        {/* Header */}

        <motion.div
          initial={{
            opacity: 0,
            y: -20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="mb-8"
        >

          <h1 className="text-4xl font-bold">
            HindsightOps
          </h1>

          <p className="text-zinc-400 mt-2">
            AI Incident Copilot powered by
            Hindsight Memory
          </p>

        </motion.div>

        {/* Empty State */}

        {!result && (

          <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            className="
              rounded-3xl
              border
              border-zinc-800
              bg-zinc-950
              p-12
              text-center
            "
          >

            <h2 className="text-3xl font-semibold mb-4">
              Describe an Incident
            </h2>

            <p className="text-zinc-400 max-w-2xl mx-auto">
              Investigate outages, deployment failures,
              security incidents, Kubernetes issues,
              database problems, networking failures,
              and operational events using historical
              organizational memory.
            </p>

          </motion.div>

        )}

        {/* Results */}

        {result && (

          <div className="space-y-6">

            {/* Executive Summary */}

            <motion.div
              initial={{
                opacity: 0,
                y: 15
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              className="
                rounded-3xl
                border
                border-blue-500/20
                bg-gradient-to-r
                from-blue-500/10
                to-purple-500/10
                p-6
              "
            >

              <h2 className="text-xl font-semibold mb-3">
                🧠 Executive Summary
              </h2>

              <p className="text-zinc-200 leading-relaxed">
                {
                  result.executiveSummary
                  || result.answer
                }
              </p>

            </motion.div>

            {/* Metrics */}

            <div className="grid md:grid-cols-3 gap-4">

              <MetricCard
                title="Confidence"
                value={`${result.confidence}%`}
              />

              <MetricCard
                title="Historical Matches"
                value={
                  result.similarIncidents?.length || 0
                }
              />

              <MetricCard
                title="Memory Source"
                value="Hindsight"
              />

            </div>

            {result?.mentalModels?.models?.length > 0 && (

              <div className="
                rounded-2xl
                border
                border-purple-500/20
                bg-purple-500/5
                p-6
              ">

                <h2 className="text-xl font-semibold mb-4">
                  🧠 Mental Models Applied
                </h2>

                <div className="space-y-3">

                  {result.mentalModels.models.map(
                    (model: any) => (

                      <div
                        key={model.id}
                        className="
                          rounded-xl
                          bg-zinc-900
                          p-4
                          border
                          border-zinc-800
                        "
                      >

                        <div className="flex items-center justify-between">

                          <h3 className="font-medium">
                            {model.name}
                          </h3>

                          <span className="
                            text-xs
                            px-2
                            py-1
                            rounded-full
                            bg-purple-500/20
                            text-purple-300
                          ">
                            Match Score {model.score}
                          </span>

                        </div>

                        <p className="
                          text-zinc-400
                          text-sm
                          mt-2
                        ">
                          {model.content}
                        </p>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

            {/* RCA */}

            <RCAResponse
              data={result}
            />

            {/* Historical Incidents */}

            <motion.div
              initial={{
                opacity: 0,
                y: 15
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              className="
                rounded-3xl
                border
                border-zinc-800
                bg-zinc-950
                p-6
              "
            >

              <div className="flex items-center justify-between mb-6">

                <h2 className="text-xl font-semibold">
                  📚 Historical Memory Retrieval
                </h2>

                <span className="text-xs text-blue-400">
                  Hindsight Cloud Bank
                </span>

              </div>

              <div className="space-y-5">

                {result.similarIncidents?.map(
                  (
                    incident: any,
                    index: number
                  ) => (

                    <div
                      key={`${incident.incident_id}-${index}`}
                      className="
                        border-l-2
                        border-blue-500
                        pl-5
                        py-1
                      "
                    >

                      <div className="flex items-center gap-3">

                        <div
                          className="
                            h-2
                            w-2
                            rounded-full
                            bg-blue-500
                          "
                        />

                        <span className="font-medium">
                          {
                            incident.incident_id
                          }
                        </span>

                      </div>

                      <p
                        className="
                          text-zinc-400
                          text-sm
                          mt-2
                          leading-relaxed
                        "
                      >
                        {
                          incident.summary ||
                          incident.memory?.slice(0, 300)
                        }
                      </p>

                    </div>

                  )
                )}

              </div>

            </motion.div>

          </div>

        )}

      </div>

      {/* Fixed Query Bar */}

      <div
        className="
          fixed
          bottom-0
          left-0
          right-0
          border-t
          border-zinc-800
          bg-black/90
          backdrop-blur-xl
          p-4
          z-50
        "
      >

        <div className="max-w-6xl mx-auto">

          <QueryAgent
            onResult={setResult}
          />

        </div>

      </div>

    </div>

  );
}

function MetricCard({
  title,
  value
}: {
  title: string;
  value: string | number;
}) {

  return (

    <div
      className="
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-950
        p-5
      "
    >

      <p className="text-sm text-zinc-400">
        {title}
      </p>

      <p className="text-2xl font-bold mt-2">
        {value}
      </p>

    </div>

  );
}
