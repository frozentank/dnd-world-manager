import type { Location, NPC, Region, ScheduleRule } from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) throw new Error(`${response.status}: ${await response.text()}`);
  return response.json();
}

async function post<T>(path: string, payload: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`${response.status}: ${await response.text()}`);
  }

  return response.json();
}

async function put<T>(path: string, payload: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`${response.status}: ${await response.text()}`);
  }

  return response.json();
}

async function del(path: string): Promise<void> {
  const response = await fetch(`${API_URL}${path}`, { method: "DELETE" });

  if (!response.ok) {
    throw new Error(`${response.status}: ${await response.text()}`);
  }
}

export const api = {
  npcs: () => get<NPC[]>("/npcs"),
  createNpc: (payload: Omit<NPC, "id">) => post<NPC>("/npcs", payload),
  updateNpc: (id: number, payload: Omit<NPC, "id">) => put<NPC>(`/npcs/${id}`, payload),
  deleteNpc: (id: number) => del(`/npcs/${id}`),
  regions: () => get<Region[]>("/regions"),
  createRegion: (payload: Omit<Region, "id">) => post<Region>("/regions", payload),
  updateRegion: (id: number, payload: Omit<Region, "id">) => put<Region>(`/regions/${id}`, payload),
  deleteRegion: (id: number) => del(`/regions/${id}`),
  locations: () => get<Location[]>("/locations"),
  createLocation: (payload: Omit<Location, "id">) => post<Location>("/locations", payload),
  updateLocation: (id: number, payload: Omit<Location, "id">) => put<Location>(`/locations/${id}`, payload),
  deleteLocation: (id: number) => del(`/locations/${id}`),
  scheduleRules: () => get<ScheduleRule[]>("/schedule-rules"),
};
