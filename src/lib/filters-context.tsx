import { createContext, useContext, useState, type ReactNode } from "react";

export type NotesFilter = "all" | "favorites" | "archived";

type FiltersCtx = {
  search: string;
  setSearch: (v: string) => void;
  filter: NotesFilter;
  setFilter: (f: NotesFilter) => void;
  selectedTags: string[];
  toggleTag: (t: string) => void;
  clearTags: () => void;
  clearAll: () => void;
};

const Ctx = createContext<FiltersCtx | null>(null);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<NotesFilter>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const toggleTag = (t: string) =>
    setSelectedTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  const clearTags = () => setSelectedTags([]);
  const clearAll = () => {
    setSearch("");
    setSelectedTags([]);
    setFilter("all");
  };
  return (
    <Ctx.Provider
      value={{ search, setSearch, filter, setFilter, selectedTags, toggleTag, clearTags, clearAll }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useFilters() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useFilters must be used within FiltersProvider");
  return v;
}

/** Strip HTML tags + entities for plain-text search/preview. */
export function stripHtml(html: string) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/** Split text into parts marking occurrences of `term` (case-insensitive). */
export function highlightParts(text: string, term: string): { text: string; match: boolean }[] {
  const t = term.trim();
  if (!t) return [{ text, match: false }];
  const re = new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(re);
  const lower = t.toLowerCase();
  return parts.map((p) => ({ text: p, match: p.toLowerCase() === lower }));
}
