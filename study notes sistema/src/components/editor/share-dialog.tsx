import { useState } from "react";
import { Mail, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  useCreateShare,
  useDeleteShare,
  useSharesForNote,
} from "@/lib/shared-notes-queries";

export function ShareNoteDialog({
  open,
  onOpenChange,
  noteId,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  noteId: string;
}) {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState<"view" | "edit">("view");
  const { data: shares = [] } = useSharesForNote(open ? noteId : undefined);
  const create = useCreateShare();
  const remove = useDeleteShare();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await create.mutateAsync({ note_id: noteId, shared_with_email: email, permission });
      toast.success("Convite enviado");
      setEmail("");
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Compartilhar nota</DialogTitle>
          <DialogDescription>
            Convide outras pessoas para visualizar ou editar esta nota.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-3">
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={permission}
              onChange={(e) => setPermission(e.target.value as "view" | "edit")}
              className="h-10 flex-1 rounded-md border border-input bg-background px-2 text-sm outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="view">Apenas visualizar</option>
              <option value="edit">Visualizar e editar</option>
            </select>
            <Button type="submit" disabled={create.isPending}>
              <UserPlus className="mr-2 h-4 w-4" />
              {create.isPending ? "Enviando..." : "Enviar convite"}
            </Button>
          </div>
        </form>

        {shares.length > 0 && (
          <div className="mt-2 space-y-1">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Pessoas com acesso
            </div>
            <ul className="space-y-1">
              {shares.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2 text-sm"
                >
                  <div className="min-w-0 flex-1 truncate">{s.shared_with_email}</div>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                    {s.permission === "edit" ? "Editar" : "Ver"}
                  </span>
                  {!s.accepted && (
                    <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-600 dark:text-amber-400">
                      Pendente
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => remove.mutate({ id: s.id, note_id: s.note_id })}
                    className="inline-flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    title="Revogar acesso"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
