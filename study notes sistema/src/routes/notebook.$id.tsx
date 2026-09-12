import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { NotesList } from "@/components/notes-list";
import { NoteEditor } from "@/components/note-editor";
import { useNotebooks, useNotes, useCreateNote } from "@/lib/queries";
import { useAuth } from "@/hooks/use-auth";
import { notebookEmoji } from "@/lib/db-types";

export const Route = createFileRoute("/notebook/$id")({
  head: () => ({
    meta: [{ title: "Caderno — StudyNotes" }],
  }),
  component: NotebookPage,
});

function NotebookPage() {
  const { id } = Route.useParams();
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !session) navigate({ to: "/login" });
  }, [session, loading, navigate]);

  const { data: notebooks = [] } = useNotebooks();
  const { data: notes = [], isLoading } = useNotes(id);
  const createNote = useCreateNote();
  const notebook = notebooks.find((n) => n.id === id);

  const handleCreate = async () => {
    const note = await createNote.mutateAsync(id);
    navigate({ to: "/note/$id", params: { id: note.id } });
  };

  return (
    <AppShell
      mobileView="list"
      middle={
        <NotesList
          title={notebook ? `${notebookEmoji(notebook.name)}  ${notebook.name}` : "Caderno"}
          notes={notes}
          isLoading={isLoading}
          onCreate={handleCreate}
        />
      }
      right={<NoteEditor />}
    />
  );
}
