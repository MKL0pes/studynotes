import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { NoteEditor } from "@/components/note-editor";
import { useNote } from "@/lib/queries";
import { useAuth } from "@/hooks/use-auth";
import { useIncomingShares, useAcceptShare } from "@/lib/shared-notes-queries";
import { Users } from "lucide-react";

export const Route = createFileRoute("/shared/$id")({
  head: () => ({ meta: [{ title: "Compartilhada — StudyNotes" }] }),
  component: SharedPage,
});

function SharedPage() {
  const { id } = Route.useParams();
  const { session, user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !session) navigate({ to: "/login" });
  }, [session, loading, navigate]);

  const { data: note, isLoading } = useNote(id);
  const { data: incoming = [] } = useIncomingShares(user?.email ?? undefined);
  const accept = useAcceptShare();

  const share = incoming.find((s) => s.note_id === id);

  useEffect(() => {
    if (share && !share.accepted) accept.mutate(share.id);
  }, [share?.id]);

  return (
    <AppShell
      middle={
        <div className="flex h-full flex-col bg-background">
          <div className="border-b border-border px-5 py-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              Compartilhadas comigo
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            {incoming.length === 0 ? (
              <p className="px-2 py-3 text-xs text-muted-foreground">Nada por aqui.</p>
            ) : (
              <ul className="space-y-1">
                {incoming.map((s) => (
                  <li key={s.id}>
                    <Link
                      to="/shared/$id"
                      params={{ id: s.note_id }}
                      className={`flex flex-col rounded-md px-3 py-2 text-sm transition ${
                        s.note_id === id
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <span className="truncate font-medium">Nota compartilhada</span>
                      <span className="text-xs text-muted-foreground">
                        {s.permission === "edit" ? "Editar" : "Apenas ler"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      }
      right={
        isLoading ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Carregando...
          </div>
        ) : !note ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Nota não encontrada ou sem acesso.
          </div>
        ) : (
          <NoteEditor
            note={note}
            readOnly={!share || share.permission === "view"}
            backTo={{ to: "/dashboard" }}
          />
        )
      }
    />
  );
}
