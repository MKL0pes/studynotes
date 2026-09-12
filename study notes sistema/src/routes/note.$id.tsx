import { createFileRoute, useNavigate, useRouter, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowLeft, AlertTriangle, Loader2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { NotesList } from "@/components/notes-list";
import { NoteEditor } from "@/components/note-editor";
import { useNote, useNotes, useNotebooks, useCreateNote } from "@/lib/queries";
import { useAuth } from "@/hooks/use-auth";
import { notebookEmoji } from "@/lib/db-types";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/note/$id")({
  head: () => ({ meta: [{ title: "Nota — StudyNotes" }] }),
  component: NotePage,
  errorComponent: NoteErrorComponent,
  notFoundComponent: NoteNotFound,
});

function NoteErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  console.error(error);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <AlertTriangle className="h-10 w-10 text-destructive" />
      <h1 className="text-xl font-semibold">Não foi possível carregar esta nota</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        {error.message || "Ocorreu um erro ao acessar a nota. Tente novamente ou volte ao início."}
      </p>
      <div className="flex gap-2">
        <Button onClick={() => { router.invalidate(); reset(); }}>Tentar novamente</Button>
        <Button variant="outline" asChild>
          <Link to="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" />Voltar</Link>
        </Button>
      </div>
    </div>
  );
}

function NoteNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <h1 className="text-xl font-semibold">Nota não encontrada</h1>
      <Button asChild><Link to="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" />Voltar</Link></Button>
    </div>
  );
}

function NotePage() {
  const { id } = Route.useParams();
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !session) navigate({ to: "/login" });
  }, [session, loading, navigate]);

  const { data: note, isLoading: noteLoading, error } = useNote(id);
  const { data: notebooks = [] } = useNotebooks();
  const { data: siblings = [], isLoading } = useNotes(note?.notebook_id);
  const createNote = useCreateNote();
  const notebook = notebooks.find((n) => n.id === note?.notebook_id);

  const handleCreate = async () => {
    if (!note) return;
    const created = await createNote.mutateAsync(note.notebook_id);
    navigate({ to: "/note/$id", params: { id: created.id } });
  };

  return (
    <AppShell
      middle={
        <NotesList
          title={notebook ? `${notebookEmoji(notebook.name)}  ${notebook.name}` : "Notas"}
          notes={siblings}
          isLoading={isLoading}
          onCreate={note ? handleCreate : undefined}
        />
      }
      right={
        noteLoading ? (
          <div className="flex h-full items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Carregando nota...
          </div>
        ) : error ? (
          <NoteErrorComponent error={error as Error} reset={() => {}} />
        ) : !note ? (
          <NoteNotFound />
        ) : (
          <NoteEditor
            note={note}
            backTo={{ to: "/notebook/$id", params: { id: note.notebook_id } }}
          />
        )
      }
    />
  );
}
