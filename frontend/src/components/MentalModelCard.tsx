"use client";

import { Brain } from "lucide-react";

export default function MentalModelCard({
  model,
}: {
  model: string;
}) {

  if (!model) {
    return null;
  }

  return (

    <div
      className="
        rounded-3xl
        border
        border-purple-500/20
        bg-gradient-to-r
        from-purple-500/10
        to-blue-500/10
        p-6
      "
    >

      <div className="flex items-center gap-3">

        <Brain
          className="text-purple-400"
          size={24}
        />

        <h2 className="text-xl font-semibold">
          Matched Mental Model
        </h2>

      </div>

      <p className="mt-4 text-zinc-200">
        {model}
      </p>

    </div>

  );
}
