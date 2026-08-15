import type { Location, NPC } from "../types";

export function Dashboard({ npcs, locations }: { npcs: NPC[]; locations: Location[] }) {
  return (
    <>
      <h2 className="mb-6 text-2xl font-semibold">Campaign Overview</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <Stat title="NPCs" value={npcs.length} />
        <Stat title="Major Locations" value={locations.length} />
        <Stat title="World Time" value="08:00" />
      </div>
      <section className="mt-8 rounded-lg border border-slate-800 bg-slate-900 p-6">
        <h3 className="mb-2 text-lg font-semibold">Current Location Snapshot</h3>
        <p className="text-slate-400">
          This will eventually show exactly which NPCs are present at a selected
          location for the current campaign date/time.
        </p>
      </section>
    </>
  );
}

function Stat({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
      <div className="text-sm text-slate-400">{title}</div>
      <div className="mt-2 text-3xl font-bold">{value}</div>
    </div>
  );
}
