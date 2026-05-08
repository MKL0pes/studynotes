import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { NotesList } from "@/components/notes-list";
import { NoteEditor } from "@/components/note-editor";
import { useNote, useNotes, useNotebooks, useCreateNote } from "@/lib/queries";
import { useAuth } from "@/hooks/use-auth";
import { notebookEmoji } from "@/lib/db-types";

export const Route = createFileRoute("/note/$id")({
  head: () => ({ meta: [{ title: "Nota — StudyNotes" }] }),
  component: NotePage,
});

function NotePage() {
  const { id } = Route.useParams();
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !session) navigate({ to: "/login" });
  }, [session, loading, navigate]);

  const { data: note } = useNote(id);
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
        <NoteEditor
          note={note}
          backTo={note ? { to: "/notebook/$id", params: { id: note.notebook_id } } : undefined}
        />
      }
    />
  );
}
