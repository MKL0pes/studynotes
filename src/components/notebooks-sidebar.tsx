import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Plus, Search, Settings, Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useNotebooks, useCreateNotebook } from "@/lib/queries";
import { notebookEmoji } from "@/lib/db-types";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export function NotebooksSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { theme, toggle } = useTheme();
  const { data: notebooks = [], isLoading } = useNotebooks();
  const createNotebook = useCreateNotebook();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleCreate = async () => {
    const name = window.prompt("Nome do caderno:");
    if (!name?.trim()) return;
    try {
      const nb = await createNotebook.mutateAsync(name.trim());
      navigate({ to: "/notebook/$id", params: { id: nb.id } });
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <aside className="flex h-full w-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <BookOpen className="h-4 w-4" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold">StudyNotes</span>
          <span className="text-xs text-muted-foreground">Universitário</span>
        </div>
      </div>

      <div className="px-3">
        <button className="flex w-full items-center gap-2 rounded-lg border border-sidebar-border bg-background/50 px-3 py-2 text-sm text-muted-foreground hover:bg-background">
          <Search className="h-4 w-4" />
          Buscar...
        </button>
      </div>

      <div className="mt-6 flex items-center justify-between px-5">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cadernos</span>
        <button
          onClick={handleCreate}
          className="rounded-md p-1 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
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
              <Link
                key={nb.id}
                to="/notebook/$id"
                params={{ id: nb.id }}
                onClick={onNavigate}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                }`}
              >
                <span className="text-base">{notebookEmoji(nb.name)}</span>
                <span className="truncate">{nb.name}</span>
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
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
            <button
              onClick={async () => {
                await signOut();
                navigate({ to: "/login" });
              }}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-accent"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
