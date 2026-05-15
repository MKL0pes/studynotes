import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Pencil, Plus, Search, Settings, Moon, Sun, LogOut, Users, X, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useNotebooks, useCreateNotebook, useDeleteNotebook, useUpdateNotebook } from "@/lib/queries";
import { useIncomingShares, useSharedNotes } from "@/lib/shared-notes-queries";
import { getNotebookIcon } from "@/lib/notebook-icons";
import type { Notebook } from "@/lib/db-types";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useFilters } from "@/lib/filters-context";
import { CreateNotebookDialog } from "@/components/create-notebook-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function NotebooksSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { theme, toggle } = useTheme();
  const { data: notebooks = [], isLoading } = useNotebooks();
  const createNotebook = useCreateNotebook();
  const updateNotebook = useUpdateNotebook();
  const deleteNotebook = useDeleteNotebook();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { search, setSearch } = useFilters();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toEdit, setToEdit] = useState<Notebook | null>(null);
  const [toDelete, setToDelete] = useState<Notebook | null>(null);
  const { data: incomingShares = [] } = useIncomingShares(user?.email ?? undefined);
  const { data: sharedNotes = [] } = useSharedNotes(user?.email ?? undefined);
  const pendingCount = incomingShares.filter((s) => !s.accepted).length;

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data as { avatar_url: string | null } | null;
    },
  });
  const avatarUrl = profile?.avatar_url ?? null;

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      const wasActive = path.startsWith(`/notebook/${toDelete.id}`);
      await deleteNotebook.mutateAsync(toDelete.id);
      toast.success("Caderno excluído");
      setToDelete(null);
      if (wasActive) navigate({ to: "/" });
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const handleCreate = async (data: { name: string; color: string; icon_name: string }) => {
    try {
      const nb = await createNotebook.mutateAsync(data);
      setDialogOpen(false);
      navigate({ to: "/notebook/$id", params: { id: nb.id } });
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const handleEditSubmit = async (data: { name: string; color: string; icon_name: string }) => {
    if (!toEdit) return;
    try {
      await updateNotebook.mutateAsync({ id: toEdit.id, ...data });
      toast.success("Caderno atualizado");
      setToEdit(null);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <aside className="flex h-full w-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-primary text-primary-foreground shadow-sm">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            <BookOpen className="h-4 w-4" />
          )}
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold">StudyNotes</span>
        </div>
      </div>

      <div className="px-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar notas..."
            className="w-full rounded-lg border border-sidebar-border bg-background/50 py-2 pl-9 pr-8 text-sm outline-none transition-colors placeholder:text-muted-foreground hover:bg-background focus:border-ring focus:ring-1 focus:ring-ring"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 inline-flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Limpar busca"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between px-5">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cadernos</span>
        <button
          onClick={() => setDialogOpen(true)}
          className="rounded-md p-1 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          aria-label="Novo caderno"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <nav className="mt-2 flex-1 space-y-0.5 overflow-y-auto px-3">
        {isLoading ? (
          <div className="px-3 py-2 text-xs text-muted-foreground">Carregando...</div>
        ) : notebooks.length === 0 ? (
          <div className="px-3 py-2 text-xs text-muted-foreground">
            Nenhum caderno. Clique em + para criar.
          </div>
        ) : (
          notebooks.map((nb) => {
            const active = path.startsWith(`/notebook/${nb.id}`);
            return (
              <div key={nb.id} className="group relative">
                <Link
                  to="/notebook/$id"
                  params={{ id: nb.id }}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 pr-16 text-sm transition-colors ${
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                  }`}
                >
                  {(() => {
                    const Icon = getNotebookIcon(nb.icon_name);
                    return (
                      <span
                        className="flex h-6 w-6 items-center justify-center rounded-md"
                        style={{ backgroundColor: `${nb.color}22`, color: nb.color }}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                    );
                  })()}
                  <span className="truncate">{nb.name}</span>
                </Link>
                <div className="absolute right-1 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 opacity-0 transition group-hover:flex group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setToEdit(nb);
                    }}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    aria-label={`Editar caderno ${nb.name}`}
                    title="Editar caderno"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setToDelete(nb);
                    }}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                    aria-label={`Excluir caderno ${nb.name}`}
                    title="Excluir caderno"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </nav>

      <div className="mt-4 flex items-center justify-between px-5">
        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          Compartilhadas comigo
        </span>
        {pendingCount > 0 && (
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
            {pendingCount}
          </span>
        )}
      </div>
      <nav className="mt-1 max-h-48 space-y-0.5 overflow-y-auto px-3 pb-2">
        {sharedNotes.length === 0 ? (
          <div className="px-3 py-2 text-xs text-muted-foreground">Nada compartilhado.</div>
        ) : (
          sharedNotes.map((n) => {
            const active = path === `/shared/${n.id}`;
            return (
              <Link
                key={n.id}
                to="/shared/$id"
                params={{ id: n.id }}
                onClick={onNavigate}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                }`}
              >
                <span className="flex-1 truncate">{n.title || "Sem título"}</span>
                <span className="shrink-0 text-[10px] uppercase text-muted-foreground">
                  {n._permission === "edit" ? "Edit" : "Ver"}
                </span>
              </Link>
            );
          })
        )}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" className="gap-2" onClick={toggle}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span className="text-xs">{theme === "dark" ? "Claro" : "Escuro"}</span>
          </Button>
          <div className="flex gap-1">
            <Link
              to="/settings"
              onClick={onNavigate}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              aria-label="Configurações"
            >
              <Settings className="h-4 w-4" />
            </Link>
            <button
              onClick={async () => {
                await signOut();
                navigate({ to: "/login" });
              }}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-accent"
              aria-label="Sair"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <CreateNotebookDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreate={handleCreate}
        isSubmitting={createNotebook.isPending}
      />

      <CreateNotebookDialog
        open={!!toEdit}
        onOpenChange={(o) => !o && setToEdit(null)}
        onCreate={handleEditSubmit}
        isSubmitting={updateNotebook.isPending}
        mode="edit"
        initial={
          toEdit
            ? { name: toEdit.name, color: toEdit.color, icon_name: toEdit.icon_name }
            : undefined
        }
      />

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir caderno?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O caderno{" "}
              <span className="font-semibold text-foreground">{toDelete?.name}</span> e{" "}
              <span className="font-semibold text-foreground">todas as suas notas</span> serão
              excluídos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteNotebook.isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={deleteNotebook.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteNotebook.isPending ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  );
}
