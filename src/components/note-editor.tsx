import { Link } from "@tanstack/react-router";
import { ArrowLeft, MoreHorizontal, Share2, Star } from "lucide-react";
import type { Note } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

export function NoteEditor({ note, backTo }: { note?: Note; backTo?: { to: "/_authenticated/notebook/$id"; params: { id: string } } }) {
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
          <span className="text-xs text-muted-foreground">Atualizado {note.updatedAt}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8"><Star className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8"><Share2 className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6 py-10 md:px-10 md:py-14">
          <h1
            contentEditable
            suppressContentEditableWarning
            className="text-3xl font-bold tracking-tight outline-none md:text-4xl"
          >
            {note.title}
          </h1>
          <div
            contentEditable
            suppressContentEditableWarning
            className="prose prose-neutral dark:prose-invert mt-6 min-h-[40vh] text-base leading-relaxed text-foreground/90 outline-none"
          >
            <p>{note.preview}</p>
            <p className="mt-4 text-muted-foreground">
              Comece a digitar para adicionar conteúdo a esta anotação. Use cabeçalhos, listas e formatação para
              estruturar suas ideias da aula.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
