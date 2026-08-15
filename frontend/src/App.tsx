import { useEffect, useState } from "react";
import { api } from "./api";
import type { Location, NPC } from "./types";

type View = "dashboard" | "npcs" | "locations";

export default function App() {
  const [view, setView] = useState<View>("dashboard");
  const [npcs, setNpcs] = useState<NPC[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.npcs(), api.locations()])
      .then(([n, l]) => { setNpcs(n); setLocations(l); })
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-7xl justify-between px-6 py-4">
          <h1 className="text-xl font-bold">D&D World Manager</h1>
          <span className="text-sm text-slate-400">Campaign Console</span>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        <aside className="w-56 shrink-0 border-r border-slate-800 p-4">
          {(["dashboard", "npcs", "locations"] as View[]).map((item) => (
            <button
              key={item}
              onClick={() => setView(item)}
              className={`mb-2 w-full rounded px-3 py-2 text-left capitalize ${
                view === item ? "bg-indigo-600" : "hover:bg-slate-800"
              }`}
            >
              {item}
            </button>
          ))}
        </aside>

        <main className="flex-1 p-6">
          {error && <div className="mb-6 rounded bg-red-950 p-4 text-red-200">API error: {error}</div>}
          {view === "dashboard" && <Dashboard npcs={npcs} locations={locations} />}
          {view === "npcs" && <List title="NPCs" items={npcs.map(n => ({title: n.name, subtitle: n.title, body: n.description}))} />}
          {view === "locations" && <List title="Locations" items={locations.map(l => ({title: l.name, subtitle: l.location_type, body: l.description}))} />}
        </main>
      </div>
    </div>
  );
}

function Dashboard({ npcs, locations }: { npcs: NPC[]; locations: Location[] }) {
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

function List({ title, items }: { title: string; items: {title: string; subtitle?: string; body?: string}[] }) {
  return (
    <>
      <h2 className="mb-6 text-2xl font-semibold">{title}</h2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <div className="font-semibold">{item.title}</div>
            {item.subtitle && <div className="text-sm text-slate-400">{item.subtitle}</div>}
            {item.body && <p className="mt-2 text-sm text-slate-300">{item.body}</p>}
          </div>
        ))}
        {items.length === 0 && <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-slate-400">Nothing here yet.</div>}
      </div>
    </>
  );
}
