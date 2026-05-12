import { createContext, useContext, useState, type ReactNode } from "react";

export type NotesFilter = "all" | "favorites" | "archived";

type FiltersCtx = {
  search: string;
  setSearch: (v: string) => void;
  filter: NotesFilter;
  setFilter: (f: NotesFilter) => void;
};

const Ctx = createContext<FiltersCtx | null>(null);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<NotesFilter>("all");
  return (
    <Ctx.Provider value={{ search, setSearch, filter, setFilter }}>{children}</Ctx.Provider>
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

/** Highlight occurrences of `term` inside `text` (case-insensitive). */
export function highlight(text: string, term: string) {
  if (!term.trim()) return [{ text, match: false }];
  const re = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return text.split(re).map((part) => ({ text: part, match: re.test(part) && part.toLowerCase() === term.toLowerCase() }));
}
