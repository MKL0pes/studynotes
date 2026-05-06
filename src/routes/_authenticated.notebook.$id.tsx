import { createFileRoute, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { NotesList } from "@/components/notes-list";
import { NoteEditor } from "@/components/note-editor";
import { getNotebook, getNotesByNotebook } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/notebook/$id")({
  head: () => ({
    meta: [{ title: "Caderno — StudyNotes" }],
  }),
  loader: ({ params }) => {
    const nb = getNotebook(params.id);
    if (!nb) throw notFound();
    return { notebook: nb, notes: getNotesByNotebook(params.id) };
  },
  component: NotebookPage,
});

function NotebookPage() {
  const { notebook, notes } = Route.useLoaderData();
  return (
    <AppShell
      mobileView="list"
      middle={<NotesList title={`${notebook.emoji}  ${notebook.name}`} notes={notes} />}
      right={<NoteEditor />}
    />
  );
}
