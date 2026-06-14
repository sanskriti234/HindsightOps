"use client";

interface MentalModelsPanelProps {
  models: any[];
}

export default function MentalModelsPanel({
  models,
}: MentalModelsPanelProps) {

  if (!models?.length) {
    return null;
  }

  return (

    <div
      className="
        rounded-3xl
        border
        border-zinc-800
        bg-zinc-950
        p-6
      "
    >

      <h2 className="text-xl font-semibold mb-6">
        🧠 Mental Models
      </h2>

      <div className="grid md:grid-cols-2 gap-4">

        {models.map(
          (model) => (

            <div
              key={model.id}
              className="
                rounded-xl
                border
                border-zinc-800
                bg-zinc-900
                p-4
              "
            >

              <p className="font-medium">
                {model.name}
              </p>

              <p className="text-sm text-zinc-400 mt-2">
                Status:
                {" "}
                {model.status}
              </p>

            </div>

          )
        )}

      </div>

    </div>

  );
}
