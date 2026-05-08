import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { NotesList } from "@/components/notes-list";
import { NoteEditor } from "@/components/note-editor";
import { useNotes, useNotebooks, useCreateNote } from "@/lib/queries";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — StudyNotes" },
      { name: "description", content: "Visão geral dos seus cadernos e anotações recentes." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !session) navigate({ to: "/login" });
  }, [session, loading, navigate]);

  const { data: notes = [], isLoading } = useNotes();
  const { data: notebooks = [] } = useNotebooks();
  const createNote = useCreateNote();

  const handleCreate = async () => {
    if (notebooks.length === 0) return;
    const note = await createNote.mutateAsync(notebooks[0].id);
    navigate({ to: "/note/$id", params: { id: note.id } });
  };

  return (
    <AppShell
      middle={
        <NotesList
          title="Notas recentes"
          notes={notes.slice(0, 20)}
          isLoading={isLoading}
          onCreate={notebooks.length ? handleCreate : undefined}
        />
      }
      right={<NoteEditor />}
    />
  );
}
