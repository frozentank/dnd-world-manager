import { useState } from "react";
import type { Region } from "../types";

const emptyRegionForm = {
  name: "",
  description: "",
};

export function RegionList({
  regions,
  onCreate,
  onUpdate,
  onDelete,
}: {
  regions: Region[];
  onCreate: (payload: Omit<Region, "id">) => Promise<void> | void;
  onUpdate: (id: number, payload: Omit<Region, "id">) => Promise<void> | void;
  onDelete: (id: number) => Promise<void> | void;
}) {
  const [form, setForm] = useState(emptyRegionForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<typeof emptyRegionForm | null>(null);

  const handleChange = (field: keyof typeof emptyRegionForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleEditChange = (field: keyof typeof emptyRegionForm, value: string) => {
    setEditForm((current) => (current ? { ...current, [field]: value } : current));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await onCreate({
        ...form,
        name: form.name.trim(),
        description: form.description.trim() || undefined,
      });
      setForm(emptyRegionForm);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editForm || editingId === null) return;

    await onUpdate(editingId, {
      ...editForm,
      name: editForm.name.trim(),
      description: editForm.description.trim() || undefined,
    });
    setEditingId(null);
    setEditForm(null);
  };

  return (
    <>
      <h2 className="mb-6 text-2xl font-semibold">Regions</h2>

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
        </div>

        <label className="mb-4 block">
          <span className="mb-1 block text-sm text-slate-300">Description</span>
          <textarea
            value={form.description}
            onChange={(event) => handleChange("description", event.target.value)}
            className="min-h-24 w-full rounded border border-slate-700 bg-slate-950 p-2 text-white"
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Add Region"}
        </button>
      </form>

      <div className="space-y-3">
        {regions.map((region) => (
          <div key={region.id} className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold">{region.name}</div>
                {region.description && <div className="text-sm text-slate-400">{region.description}</div>}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(region.id);
                    setEditForm({
                      name: region.name,
                      description: region.description ?? "",
                    });
                  }}
                  className="rounded bg-sky-700 px-2 py-1 text-xs font-medium text-sky-100 hover:bg-sky-600"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(region.id)}
                  className="rounded bg-red-700 px-2 py-1 text-xs font-medium text-red-100 hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>

            {editingId === region.id && editForm && (
              <form onSubmit={handleEditSubmit} className="mt-4 rounded border border-slate-700 bg-slate-950 p-4">
                <label className="mb-4 block">
                  <span className="mb-1 block text-sm text-slate-300">Name</span>
                  <input
                    required
                    value={editForm.name}
                    onChange={(event) => handleEditChange("name", event.target.value)}
                    className="w-full rounded border border-slate-700 bg-slate-950 p-2 text-white"
                  />
                </label>

                <label className="mb-4 block">
                  <span className="mb-1 block text-sm text-slate-300">Description</span>
                  <textarea
                    value={editForm.description}
                    onChange={(event) => handleEditChange("description", event.target.value)}
                    className="min-h-24 w-full rounded border border-slate-700 bg-slate-950 p-2 text-white"
                  />
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
          </div>
        ))}
        {regions.length === 0 && (
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-slate-400">
            Nothing here yet.
          </div>
        )}
      </div>
    </>
  );
}
