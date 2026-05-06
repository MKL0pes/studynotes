import { Link, useRouterState } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import type { Note } from "@/lib/mock-data";

export function NotesList({
  title,
  notes,
  onNavigate,
}: {
  title: string;
  notes: Note[];
  onNavigate?: () => void;
}) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-full w-full flex-col bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          <p className="text-xs text-muted-foreground">{notes.length} notas</p>
        </div>
        <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm hover:opacity-90">
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {notes.length === 0 ? (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
            Nenhuma nota neste caderno ainda.
          </div>
        ) : (
          notes.map((note) => {
            const active = path === `/note/${note.id}`;
            return (
              <Link
                key={note.id}
                to="/note/$id"
                params={{ id: note.id }}
                onClick={onNavigate}
                className={`block rounded-xl p-3 transition-colors ${
                  active ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                }`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="truncate text-sm font-semibold">{note.title}</h3>
                  <span className="shrink-0 text-[10px] uppercase tracking-wide text-muted-foreground">
                    {note.updatedAt}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{note.preview}</p>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
