import { useRef, useState } from "react";

export function ImportNpcCsv({
  onImported,
}: {
  onImported: () => Promise<void> | void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const file = inputRef.current?.files?.[0];
    if (!file) {
      setStatus("Choose a CSV file first.");
      return;
    }

    setIsUploading(true);
    setStatus(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("http://localhost:8000/api/npcs/import", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      setStatus(`Imported ${data.created} NPCs.`);
      await onImported();
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Import failed";
      setStatus(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 rounded-lg border border-slate-800 bg-slate-900 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">Import NPC CSV</h3>
      </div>
      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <label className="block flex-1">
          <span className="mb-1 block text-sm text-slate-300">CSV file</span>
          <input ref={inputRef} type="file" accept=".csv" className="w-full rounded border border-slate-700 bg-slate-950 p-2 text-white" />
        </label>
        <button
          type="submit"
          disabled={isUploading}
          className="rounded bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUploading ? "Importing..." : "Import CSV"}
        </button>
      </div>
      {status && <div className="mt-3 text-sm text-slate-300">{status}</div>}
    </form>
  );
}
