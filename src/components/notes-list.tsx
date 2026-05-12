import { Link, useRouterState } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useMemo } from "react";
import type { Note } from "@/lib/db-types";
import { formatRelative } from "@/lib/db-types";
import { useFilters, stripHtml, highlightParts, type NotesFilter } from "@/lib/filters-context";

const TABS: { value: NotesFilter; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "favorites", label: "Favoritas" },
  { value: "archived", label: "Arquivadas" },
];

function Highlighted({ text, term }: { text: string; term: string }) {
  const parts = highlightParts(text, term);
  return (
    <>
      {parts.map((p, i) =>
        p.match ? (
          <mark key={i} className="rounded bg-primary/25 px-0.5 text-foreground">
            {p.text}
          </mark>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </>
  );
}

export function NotesList({
  title,
  notes,
  onNavigate,
  onCreate,
  isLoading,
}: {
  title: string;
  notes: Note[];
  onNavigate?: () => void;
  onCreate?: () => void;
  isLoading?: boolean;
}) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { search, filter, setFilter } = useFilters();

  const filtered = useMemo(() => {
    let list = notes;
    if (filter === "favorites") list = list.filter((n) => n.is_favorite && !n.is_archived);
    else if (filter === "archived") list = list.filter((n) => n.is_archived);
    else list = list.filter((n) => !n.is_archived);

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((n) => {
        const t = n.title.toLowerCase();
        const c = stripHtml(n.content).toLowerCase();
        return t.includes(q) || c.includes(q);
      });
    }
    return list;
  }, [notes, filter, search]);

  const term = search.trim();

  return (
    <div className="flex h-full w-full flex-col bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          <p className="text-xs text-muted-foreground">{filtered.length} notas</p>
        </div>
        {onCreate ? (
          <button
            onClick={onCreate}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <div className="flex gap-1 border-b border-border px-3 py-2">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setFilter(t.value)}
            className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
              filter === t.value
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="px-3 py-4 text-xs text-muted-foreground">Carregando...</div>
        ) : filtered.length === 0 ? (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
            {term
              ? "Nenhuma nota encontrada"
              : filter === "favorites"
                ? "Nenhuma nota favorita."
                : filter === "archived"
                  ? "Nenhuma nota arquivada."
                  : "Nenhuma nota ainda."}
          </div>
        ) : (
          filtered.map((note) => {
            const active = path === `/note/${note.id}`;
            const preview = stripHtml(note.content).slice(0, 140);
            const displayTitle = note.title || "Sem título";
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
                  <h3 className="truncate text-sm font-semibold">
                    <Highlighted text={displayTitle} term={term} />
                  </h3>
                  <span className="shrink-0 text-[10px] uppercase tracking-wide text-muted-foreground">
                    {formatRelative(note.updated_at)}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {preview ? <Highlighted text={preview} term={term} /> : "Sem conteúdo"}
                </p>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
