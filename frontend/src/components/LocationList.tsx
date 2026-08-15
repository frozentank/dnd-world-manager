import { useState } from "react";
import type { Location, Region } from "../types";

const emptyLocationForm = {
  name: "",
  description: "",
  location_type: "other",
  is_major: true,
  region_id: "",
  grid_location: "",
  map_name: "",
};

export function LocationList({
  locations,
  regions,
  onCreate,
  onUpdate,
  onDelete,
}: {
  locations: Location[];
  regions: Region[];
  onCreate: (payload: Omit<Location, "id">) => Promise<void> | void;
  onUpdate: (id: number, payload: Omit<Location, "id">) => Promise<void> | void;
  onDelete: (id: number) => Promise<void> | void;
}) {
  const [form, setForm] = useState(emptyLocationForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<typeof emptyLocationForm | null>(null);

  const handleChange = (field: keyof typeof emptyLocationForm, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleEditChange = (field: keyof typeof emptyLocationForm, value: string | boolean) => {
    setEditForm((current) => (current ? { ...current, [field]: value } : current));
  };

  const normalizeLocationPayload = (payload: typeof emptyLocationForm) => ({
    ...payload,
    name: payload.name.trim(),
    description: payload.description.trim() || undefined,
    location_type: payload.location_type.trim() || "other",
    region_id: payload.region_id === "" ? null : Number(payload.region_id),
    grid_location: payload.grid_location.trim() || undefined,
    map_name: payload.map_name.trim() || undefined,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await onCreate(normalizeLocationPayload(form));
      setForm(emptyLocationForm);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editForm || editingId === null) return;

    await onUpdate(editingId, normalizeLocationPayload(editForm));
    setEditingId(null);
    setEditForm(null);
  };

  return (
    <>
      <h2 className="mb-6 text-2xl font-semibold">Locations</h2>

      <form onSubmit={handleSubmit} className="mb-8 rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="mb-4 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm text-slate-300">Name</span>
            <input
              required
              value={form.name}
              onChange={(event) => handleChange("name", event.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-950 p-2 text-white"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-slate-300">Type</span>
            <input
              value={form.location_type}
              onChange={(event) => handleChange("location_type", event.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-950 p-2 text-white"
            />
          </label>
        </div>

        <div className="mb-4 grid gap-4 md:grid-cols-3">
          <label className="block">
            <span className="mb-1 block text-sm text-slate-300">Region</span>
            <select
              value={form.region_id}
              onChange={(event) => handleChange("region_id", event.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-950 p-2 text-white"
            >
              <option value="">No region</option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>{region.name}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-slate-300">Grid location</span>
            <input
              value={form.grid_location}
              onChange={(event) => handleChange("grid_location", event.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-950 p-2 text-white"
              placeholder="A1, H-14"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-slate-300">Map</span>
            <input
              value={form.map_name}
              onChange={(event) => handleChange("map_name", event.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-950 p-2 text-white"
              placeholder="World map"
            />
          </label>
        </div>

        <label className="mb-4 block">
          <span className="mb-1 block text-sm text-slate-300">Description</span>
          <textarea
            value={form.description}
            onChange={(event) => handleChange("description", event.target.value)}
            className="min-h-24 w-full rounded border border-slate-700 bg-slate-950 p-2 text-white"
          />
        </label>

        <label className="mb-4 flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={form.is_major}
            onChange={(event) => handleChange("is_major", event.target.checked)}
            className="h-4 w-4 rounded border-slate-700 bg-slate-950"
          />
          Major location
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Add Location"}
        </button>
      </form>

      <div className="space-y-3">
        {locations.map((location) => (
          <div key={location.id} className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold">{location.name}</div>
                <div className="text-sm text-slate-400">
                  {location.location_type}
                  {location.region_id && regions.find((region) => region.id === location.region_id) && (
                    <span className="ml-2 text-indigo-300">• {regions.find((region) => region.id === location.region_id)?.name}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2 py-1 text-xs ${location.is_major ? "bg-amber-900 text-amber-200" : "bg-slate-700 text-slate-200"}`}>
                  {location.is_major ? "Major" : "Minor"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(location.id);
                    setEditForm({
                      name: location.name,
                      description: location.description ?? "",
                      location_type: location.location_type,
                      is_major: location.is_major,
                      region_id: location.region_id ? String(location.region_id) : "",
                      grid_location: location.grid_location ?? "",
                      map_name: location.map_name ?? "",
                    });
                  }}
                  className="rounded bg-sky-700 px-2 py-1 text-xs font-medium text-sky-100 hover:bg-sky-600"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(location.id)}
                  className="rounded bg-red-700 px-2 py-1 text-xs font-medium text-red-100 hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>

            {editingId === location.id && editForm && (
              <form onSubmit={handleEditSubmit} className="mt-4 rounded border border-slate-700 bg-slate-950 p-4">
                <div className="mb-4 grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-sm text-slate-300">Name</span>
                    <input
                      required
                      value={editForm.name}
                      onChange={(event) => handleEditChange("name", event.target.value)}
                      className="w-full rounded border border-slate-700 bg-slate-950 p-2 text-white"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-sm text-slate-300">Type</span>
                    <input
                      value={editForm.location_type}
                      onChange={(event) => handleEditChange("location_type", event.target.value)}
                      className="w-full rounded border border-slate-700 bg-slate-950 p-2 text-white"
                    />
                  </label>
                </div>

                <div className="mb-4 grid gap-4 md:grid-cols-3">
                  <label className="block">
                    <span className="mb-1 block text-sm text-slate-300">Region</span>
                    <select
                      value={editForm.region_id}
                      onChange={(event) => handleEditChange("region_id", event.target.value)}
                      className="w-full rounded border border-slate-700 bg-slate-950 p-2 text-white"
                    >
                      <option value="">No region</option>
                      {regions.map((region) => (
                        <option key={region.id} value={region.id}>{region.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-sm text-slate-300">Grid location</span>
                    <input
                      value={editForm.grid_location}
                      onChange={(event) => handleEditChange("grid_location", event.target.value)}
                      className="w-full rounded border border-slate-700 bg-slate-950 p-2 text-white"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-sm text-slate-300">Map</span>
                    <input
                      value={editForm.map_name}
                      onChange={(event) => handleEditChange("map_name", event.target.value)}
                      className="w-full rounded border border-slate-700 bg-slate-950 p-2 text-white"
                    />
                  </label>
                </div>

                <label className="mb-4 block">
                  <span className="mb-1 block text-sm text-slate-300">Description</span>
                  <textarea
                    value={editForm.description}
                    onChange={(event) => handleEditChange("description", event.target.value)}
                    className="min-h-24 w-full rounded border border-slate-700 bg-slate-950 p-2 text-white"
                  />
                </label>

                <label className="mb-4 flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={editForm.is_major}
                    onChange={(event) => handleEditChange("is_major", event.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-950"
                  />
                  Major location
                </label>

                <div className="flex gap-2">
                  <button type="submit" className="rounded bg-indigo-600 px-3 py-2 font-medium text-white hover:bg-indigo-500">
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setEditForm(null);
                    }}
                    className="rounded border border-slate-700 px-3 py-2 text-slate-200 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {location.grid_location && location.map_name && (
              <p className="mt-3 text-sm text-slate-300">
                Map: {location.map_name} • Grid: {location.grid_location}
              </p>
            )}
            {location.description && <p className="mt-3 text-sm text-slate-300">{location.description}</p>}
          </div>
        ))}
        {locations.length === 0 && (
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-slate-400">
            Nothing here yet.
          </div>
        )}
      </div>
    </>
  );
}
