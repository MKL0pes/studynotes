import { Link } from "@tanstack/react-router";
import { ArrowLeft, MoreHorizontal, Share2, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Note } from "@/lib/db-types";
import { formatRelative } from "@/lib/db-types";
import { Button } from "@/components/ui/button";
import { useUpdateNote } from "@/lib/queries";

export function NoteEditor({
  note,
  backTo,
}: {
  note?: Note;
  backTo?: { to: "/notebook/$id"; params: { id: string } };
}) {
  const update = useUpdateNote();
  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState(note?.content ?? "");
  const lastSavedRef = useRef<{ title: string; content: string }>({ title: "", content: "" });

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      lastSavedRef.current = { title: note.title, content: note.content };
    }
  }, [note?.id]);

  useEffect(() => {
    if (!note) return;
    const t = setTimeout(() => {
      if (
        title !== lastSavedRef.current.title ||
        content !== lastSavedRef.current.content
      ) {
        update.mutate({ id: note.id, title, content });
        lastSavedRef.current = { title, content };
      }
    }, 800);
    return () => clearTimeout(t);
  }, [title, content, note?.id]);

  const toggleFavorite = () => {
    if (!note) return;
    update.mutate({ id: note.id, is_favorite: !note.is_favorite });
  };

  if (!note) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-background px-6 text-center">
        <div className="mb-4 text-5xl">📝</div>
        <h2 className="text-lg font-semibold">Selecione uma nota</h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Escolha uma anotação na lista ao lado para começar a editar, ou crie uma nova.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col bg-background">
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <div className="flex items-center gap-2">
          {backTo ? (
            <Link
              to={backTo.to}
              params={backTo.params}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted md:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          ) : null}
          <span className="text-xs text-muted-foreground">
            Atualizado {formatRelative(note.updated_at)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleFavorite}>
            <Star className={`h-4 w-4 ${note.is_favorite ? "fill-primary text-primary" : ""}`} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6 py-10 md:px-10 md:py-14">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Sem título"
            className="w-full bg-transparent text-3xl font-bold tracking-tight outline-none placeholder:text-muted-foreground/50 md:text-4xl"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Comece a escrever sua anotação..."
            className="mt-6 min-h-[60vh] w-full resize-none bg-transparent text-base leading-relaxed text-foreground/90 outline-none placeholder:text-muted-foreground/60"
          />
        </div>
      </div>
    </div>
  );
}
