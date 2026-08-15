import { useCallback, useEffect, useState } from "react";
import { api } from "./api";
import { Dashboard } from "./components/Dashboard";
import { ImportNpcCsv } from "./components/ImportNpcCsv";
import { LocationList } from "./components/LocationList";
import { NpcList } from "./components/NpcList";
import { RegionList } from "./components/RegionList";
import type { Location, NPC, Region } from "./types";

type View = "dashboard" | "npcs" | "locations" | "regions";

export default function App() {
  const [view, setView] = useState<View>("dashboard");
  const [npcs, setNpcs] = useState<NPC[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(() => {
    Promise.all([api.npcs(), api.regions(), api.locations()])
      .then(([n, r, l]) => {
        setNpcs(n);
        setRegions(r);
        setLocations(l);
      })
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleCreateNpc = async (payload: Omit<NPC, "id">) => {
    const created = await api.createNpc(payload);
    setNpcs((current) => [...current, created].sort((a, b) => a.name.localeCompare(b.name)));
  };

  const handleDeleteNpc = async (id: number) => {
    await api.deleteNpc(id);
    setNpcs((current) => current.filter((npc) => npc.id !== id));
  };

  const handleUpdateNpc = async (id: number, payload: Omit<NPC, "id">) => {
    const updated = await api.updateNpc(id, payload);
    setNpcs((current) => current.map((npc) => (npc.id === id ? updated : npc)).sort((a, b) => a.name.localeCompare(b.name)));
  };

  const handleCreateRegion = async (payload: Omit<Region, "id">) => {
    const created = await api.createRegion(payload);
    setRegions((current) => [...current, created].sort((a, b) => a.name.localeCompare(b.name)));
  };

  const handleUpdateRegion = async (id: number, payload: Omit<Region, "id">) => {
    const updated = await api.updateRegion(id, payload);
    setRegions((current) => current.map((region) => (region.id === id ? updated : region)).sort((a, b) => a.name.localeCompare(b.name)));
  };

  const handleDeleteRegion = async (id: number) => {
    await api.deleteRegion(id);
    setRegions((current) => current.filter((region) => region.id !== id));
    setLocations((current) => current.map((location) => location.region_id === id ? { ...location, region_id: null } : location));
  };

  const handleCreateLocation = async (payload: Omit<Location, "id">) => {
    const created = await api.createLocation(payload);
    setLocations((current) => [...current, created].sort((a, b) => a.name.localeCompare(b.name)));
  };

  const handleUpdateLocation = async (id: number, payload: Omit<Location, "id">) => {
    const updated = await api.updateLocation(id, payload);
    setLocations((current) => current.map((location) => (location.id === id ? updated : location)).sort((a, b) => a.name.localeCompare(b.name)));
  };

  const handleDeleteLocation = async (id: number) => {
    await api.deleteLocation(id);
    setLocations((current) => current.filter((location) => location.id !== id));
  };

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
          {(["dashboard", "npcs", "locations", "regions"] as View[]).map((item) => (
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
          {error && (
            <div className="mb-6 rounded bg-red-950 p-4 text-red-200">API error: {error}</div>
          )}
          {view === "dashboard" && <Dashboard npcs={npcs} locations={locations} />}
          {view === "npcs" && (
            <>
              <ImportNpcCsv onImported={refreshData} />
              <NpcList
                npcs={npcs}
                regions={regions}
                locations={locations}
                onCreate={handleCreateNpc}
                onUpdate={handleUpdateNpc}
                onDelete={handleDeleteNpc}
              />
            </>
          )}
          {view === "locations" && (
            <LocationList
              locations={locations}
              regions={regions}
              onCreate={handleCreateLocation}
              onUpdate={handleUpdateLocation}
              onDelete={handleDeleteLocation}
            />
          )}
          {view === "regions" && (
            <RegionList
              regions={regions}
              onCreate={handleCreateRegion}
              onUpdate={handleUpdateRegion}
              onDelete={handleDeleteRegion}
            />
          )}
        </main>
      </div>
    </div>
  );
}
