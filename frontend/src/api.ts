import type { Location, NPC, ScheduleRule } from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) throw new Error(`${response.status}: ${await response.text()}`);
  return response.json();
}

export const api = {
  npcs: () => get<NPC[]>("/npcs"),
  locations: () => get<Location[]>("/locations"),
  scheduleRules: () => get<ScheduleRule[]>("/schedule-rules"),
};
