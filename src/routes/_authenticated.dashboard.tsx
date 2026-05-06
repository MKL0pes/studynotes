import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { NotesList } from "@/components/notes-list";
import { NoteEditor } from "@/components/note-editor";
import { notes } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — StudyNotes" },
      { name: "description", content: "Visão geral dos seus cadernos e anotações recentes." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const recent = notes.slice(0, 5);
  return (
    <AppShell
      middle={<NotesList title="Notas recentes" notes={recent} />}
      right={<NoteEditor />}
    />
  );
}
