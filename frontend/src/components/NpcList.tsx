import { useState } from "react";
import type { Location, NPC, Region } from "../types";

const emptyNpcForm = {
  name: "",
  title: "",
  description: "",
  profession: "",
  race: "",
  gender: "",
  quirk: "",
  personality: "",
  appearance: "",
  secrets: "",
  notes: "",
  location_id: "",
  region_id: "",
  active: true,
};

export function NpcList({
  npcs,
  regions,
  locations,
  onCreate,
  onUpdate,
  onDelete,
}: {
  npcs: NPC[];
  regions: Region[];
  locations: Location[];
  onCreate: (payload: Omit<NPC, "id">) => Promise<void> | void;
  onUpdate: (id: number, payload: Omit<NPC, "id">) => Promise<void> | void;
  onDelete: (id: number) => Promise<void> | void;
}) {
  const [form, setForm] = useState(emptyNpcForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<typeof emptyNpcForm | null>(null);

  const handleChange = (field: keyof typeof emptyNpcForm, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleEditChange = (field: keyof typeof emptyNpcForm, value: string | boolean) => {
    setEditForm((current) => (current ? { ...current, [field]: value } : current));
  };

  const normalizeNpcPayload = (payload: typeof emptyNpcForm) => ({
    ...payload,
    name: payload.name.trim(),
    title: payload.title.trim() || undefined,
    description: payload.description.trim() || undefined,
    profession: payload.profession.trim() || undefined,
    race: payload.race.trim() || undefined,
    gender: payload.gender.trim() || undefined,
    quirk: payload.quirk.trim() || undefined,
    personality: payload.personality.trim() || undefined,
    appearance: payload.appearance.trim() || undefined,
    secrets: payload.secrets.trim() || undefined,
    notes: payload.notes.trim() || undefined,
    location_id: payload.location_id === "" ? null : Number(payload.location_id),
    region_id: payload.region_id === "" ? null : Number(payload.region_id),
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await onCreate(normalizeNpcPayload(form));
      setForm(emptyNpcForm);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editForm || editingId === null) return;

    await onUpdate(editingId, normalizeNpcPayload(editForm));
    setEditingId(null);
    setEditForm(null);
  };

  return (
    <>
      <h2 className="mb-6 text-2xl font-semibold">NPCs</h2>

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
            <span className="mb-1 block text-sm text-slate-300">Title</span>
            <input
              value={form.title}
              onChange={(event) => handleChange("title", event.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-950 p-2 text-white"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-slate-300">Profession</span>
            <input
              value={form.profession}
              onChange={(event) => handleChange("profession", event.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-950 p-2 text-white"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-slate-300">Race</span>
            <input
              value={form.race}
              onChange={(event) => handleChange("race", event.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-950 p-2 text-white"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-slate-300">Gender</span>
            <input
              value={form.gender}
              onChange={(event) => handleChange("gender", event.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-950 p-2 text-white"
            />
          </label>
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
          <label className="block md:col-span-2">
            <span className="mb-1 block text-sm text-slate-300">Location</span>
            <select
              value={form.location_id}
              onChange={(event) => handleChange("location_id", event.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-950 p-2 text-white"
            >
              <option value="">No location</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>{location.name}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mb-4 grid gap-4 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="mb-1 block text-sm text-slate-300">Description</span>
            <textarea
              value={form.description}
              onChange={(event) => handleChange("description", event.target.value)}
              className="min-h-24 w-full rounded border border-slate-700 bg-slate-950 p-2 text-white"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-1 block text-sm text-slate-300">Quirk</span>
            <textarea
              value={form.quirk}
              onChange={(event) => handleChange("quirk", event.target.value)}
              className="min-h-20 w-full rounded border border-slate-700 bg-slate-950 p-2 text-white"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-1 block text-sm text-slate-300">Personality</span>
            <textarea
              value={form.personality}
              onChange={(event) => handleChange("personality", event.target.value)}
              className="min-h-20 w-full rounded border border-slate-700 bg-slate-950 p-2 text-white"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-1 block text-sm text-slate-300">Appearance</span>
            <textarea
              value={form.appearance}
              onChange={(event) => handleChange("appearance", event.target.value)}
              className="min-h-20 w-full rounded border border-slate-700 bg-slate-950 p-2 text-white"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-1 block text-sm text-slate-300">Secrets</span>
            <textarea
              value={form.secrets}
              onChange={(event) => handleChange("secrets", event.target.value)}
              className="min-h-20 w-full rounded border border-slate-700 bg-slate-950 p-2 text-white"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-1 block text-sm text-slate-300">Notes</span>
            <textarea
              value={form.notes}
              onChange={(event) => handleChange("notes", event.target.value)}
              className="min-h-20 w-full rounded border border-slate-700 bg-slate-950 p-2 text-white"
            />
          </label>
        </div>

        <label className="mb-4 flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(event) => handleChange("active", event.target.checked)}
            className="h-4 w-4 rounded border-slate-700 bg-slate-950"
          />
          Active
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Add NPC"}
        </button>
      </form>

      <div className="space-y-3">
        {npcs.map((npc) => (
          <div key={npc.id} className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold">{npc.name}</div>
                {npc.title && <div className="text-sm text-slate-400">{npc.title}</div>}
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2 py-1 text-xs ${npc.active ? "bg-emerald-900 text-emerald-200" : "bg-slate-700 text-slate-200"}`}>
                  {npc.active ? "Active" : "Inactive"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(npc.id);
                    setEditForm({
                      name: npc.name,
                      title: npc.title ?? "",
                      description: npc.description ?? "",
                      profession: npc.profession ?? "",
                      race: npc.race ?? "",
                      gender: npc.gender ?? "",
                      quirk: npc.quirk ?? "",
                      personality: npc.personality ?? "",
                      appearance: npc.appearance ?? "",
                      secrets: npc.secrets ?? "",
                      notes: npc.notes ?? "",
                      location_id: npc.location_id ? String(npc.location_id) : "",
                      region_id: npc.region_id ? String(npc.region_id) : "",
                      active: npc.active,
                    });
                  }}
                  className="rounded bg-sky-700 px-2 py-1 text-xs font-medium text-sky-100 hover:bg-sky-600"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(npc.id)}
                  className="rounded bg-red-700 px-2 py-1 text-xs font-medium text-red-100 hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>

            {editingId === npc.id && editForm && (
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
                    <span className="mb-1 block text-sm text-slate-300">Title</span>
                    <input
                      value={editForm.title}
                      onChange={(event) => handleEditChange("title", event.target.value)}
                      className="w-full rounded border border-slate-700 bg-slate-950 p-2 text-white"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-sm text-slate-300">Profession</span>
                    <input
                      value={editForm.profession}
                      onChange={(event) => handleEditChange("profession", event.target.value)}
                      className="w-full rounded border border-slate-700 bg-slate-950 p-2 text-white"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-sm text-slate-300">Race</span>
                    <input
                      value={editForm.race}
                      onChange={(event) => handleEditChange("race", event.target.value)}
                      className="w-full rounded border border-slate-700 bg-slate-950 p-2 text-white"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-sm text-slate-300">Gender</span>
                    <input
                      value={editForm.gender}
                      onChange={(event) => handleEditChange("gender", event.target.value)}
                      className="w-full rounded border border-slate-700 bg-slate-950 p-2 text-white"
                    />
                  </label>
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
                  <label className="block md:col-span-2">
                    <span className="mb-1 block text-sm text-slate-300">Location</span>
                    <select
                      value={editForm.location_id}
                      onChange={(event) => handleEditChange("location_id", event.target.value)}
                      className="w-full rounded border border-slate-700 bg-slate-950 p-2 text-white"
                    >
                      <option value="">No location</option>
                      {locations.map((location) => (
                        <option key={location.id} value={location.id}>{location.name}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mb-4 grid gap-4 md:grid-cols-2">
                  <label className="block md:col-span-2">
                    <span className="mb-1 block text-sm text-slate-300">Description</span>
                    <textarea
                      value={editForm.description}
                      onChange={(event) => handleEditChange("description", event.target.value)}
                      className="min-h-24 w-full rounded border border-slate-700 bg-slate-950 p-2 text-white"
                    />
                  </label>
                  <label className="block md:col-span-2">
                    <span className="mb-1 block text-sm text-slate-300">Quirk</span>
                    <textarea
                      value={editForm.quirk}
                      onChange={(event) => handleEditChange("quirk", event.target.value)}
                      className="min-h-20 w-full rounded border border-slate-700 bg-slate-950 p-2 text-white"
                    />
                  </label>
                  <label className="block md:col-span-2">
                    <span className="mb-1 block text-sm text-slate-300">Personality</span>
                    <textarea
                      value={editForm.personality}
                      onChange={(event) => handleEditChange("personality", event.target.value)}
                      className="min-h-20 w-full rounded border border-slate-700 bg-slate-950 p-2 text-white"
                    />
                  </label>
                  <label className="block md:col-span-2">
                    <span className="mb-1 block text-sm text-slate-300">Appearance</span>
                    <textarea
                      value={editForm.appearance}
                      onChange={(event) => handleEditChange("appearance", event.target.value)}
                      className="min-h-20 w-full rounded border border-slate-700 bg-slate-950 p-2 text-white"
                    />
                  </label>
                  <label className="block md:col-span-2">
                    <span className="mb-1 block text-sm text-slate-300">Secrets</span>
                    <textarea
                      value={editForm.secrets}
                      onChange={(event) => handleEditChange("secrets", event.target.value)}
                      className="min-h-20 w-full rounded border border-slate-700 bg-slate-950 p-2 text-white"
                    />
                  </label>
                  <label className="block md:col-span-2">
                    <span className="mb-1 block text-sm text-slate-300">Notes</span>
                    <textarea
                      value={editForm.notes}
                      onChange={(event) => handleEditChange("notes", event.target.value)}
                      className="min-h-20 w-full rounded border border-slate-700 bg-slate-950 p-2 text-white"
                    />
                  </label>
                </div>

                <label className="mb-4 flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={editForm.active}
                    onChange={(event) => handleEditChange("active", event.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-950"
                  />
                  Active
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

            {npc.description && <p className="mt-3 text-sm text-slate-300">{npc.description}</p>}
            {npc.quirk && <p className="mt-2 text-sm"><span className="font-medium text-slate-200">Quirk:</span> {npc.quirk}</p>}
            {npc.personality && <p className="mt-2 text-sm"><span className="font-medium text-slate-200">Personality:</span> {npc.personality}</p>}
            {npc.appearance && <p className="mt-2 text-sm"><span className="font-medium text-slate-200">Appearance:</span> {npc.appearance}</p>}
            {npc.secrets && <p className="mt-2 text-sm"><span className="font-medium text-slate-200">Secrets:</span> {npc.secrets}</p>}
            {npc.notes && <p className="mt-2 text-sm"><span className="font-medium text-slate-200">Notes:</span> {npc.notes}</p>}
          </div>
        ))}
        {npcs.length === 0 && (
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-slate-400">
            Nothing here yet.
          </div>
        )}
      </div>
    </>
  );
}
