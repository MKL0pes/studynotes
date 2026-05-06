import { createFileRoute, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { NotesList } from "@/components/notes-list";
import { NoteEditor } from "@/components/note-editor";
import { getNote, getNotebook, getNotesByNotebook } from "@/lib/mock-data";

export const Route = createFileRoute("/note/$id")({
  head: () => ({
    meta: [{ title: "Nota — StudyNotes" }],
  }),
  loader: ({ params }) => {
    const note = getNote(params.id);
    if (!note) throw notFound();
    const notebook = getNotebook(note.notebookId)!;
    return { note, notebook, siblings: getNotesByNotebook(note.notebookId) };
  },
  component: NotePage,
});

function NotePage() {
  const { note, notebook, siblings } = Route.useLoaderData();
  return (
    <AppShell
      middle={<NotesList title={`${notebook.emoji}  ${notebook.name}`} notes={siblings} />}
      right={<NoteEditor note={note} backTo={{ to: "/notebook/$id", params: { id: notebook.id } }} />}
    />
  );
}
