import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { NOTEBOOK_ICON_CATEGORIES } from "@/lib/notebook-icons";

export const NOTEBOOK_COLORS = [
  "#4F46E5", "#0EA5E9", "#10B981", "#F59E0B",
  "#EF4444", "#EC4899", "#8B5CF6", "#14B8A6",
];

type NotebookData = { name: string; color: string; icon_name: string };

export function CreateNotebookDialog({
  open,
  onOpenChange,
  onCreate,
  isSubmitting,
  initial,
  mode = "create",
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (data: NotebookData) => void | Promise<void>;
  isSubmitting?: boolean;
  initial?: NotebookData;
  mode?: "create" | "edit";
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [color, setColor] = useState(initial?.color ?? NOTEBOOK_COLORS[0]);
  const [iconName, setIconName] = useState(initial?.icon_name ?? "BookOpen");
  const [iconQuery, setIconQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Re-hydrate when opening for a different notebook
  useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setColor(initial?.color ?? NOTEBOOK_COLORS[0]);
      setIconName(initial?.icon_name ?? "BookOpen");
      setIconQuery("");
      setError(null);
    }
  }, [open, initial?.name, initial?.color, initial?.icon_name]);

  const reset = () => {
    setName("");
    setColor(NOTEBOOK_COLORS[0]);
    setIconName("BookOpen");
    setIconQuery("");
    setError(null);
  };

  const filteredCategories = useMemo(() => {
    const q = iconQuery.trim().toLowerCase();
    if (!q) return NOTEBOOK_ICON_CATEGORIES;
    return NOTEBOOK_ICON_CATEGORIES.map((cat) => ({
      ...cat,
      icons: cat.icons.filter((i) => i.name.toLowerCase().includes(q)),
    })).filter((cat) => cat.icons.length > 0);
  }, [iconQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Digite um nome para o caderno.");
      return;
    }
    await onCreate({ name: trimmed, color, icon_name: iconName });
    if (mode === "create") reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v && mode === "create") reset();
      }}
    >
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <DialogHeader>
            <DialogTitle>{mode === "edit" ? "Editar caderno" : "Novo caderno"}</DialogTitle>
            <DialogDescription>
              {mode === "edit"
                ? "Atualize o nome, a cor ou o ícone do caderno."
                : "Organize suas anotações por matéria ou projeto."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="notebook-name">Nome</Label>
            <Input
              id="notebook-name"
              value={name}
              autoFocus
              placeholder="Ex: Cálculo I"
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          <div className="space-y-2">
            <Label>Cor</Label>
            <div className="flex flex-wrap gap-2">
              {NOTEBOOK_COLORS.map((c) => {
                const selected = c === color;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={cn(
                      "relative h-9 w-9 rounded-full border-2 transition-all",
                      selected ? "border-foreground scale-110" : "border-transparent hover:scale-105",
                    )}
                    style={{ backgroundColor: c }}
                    aria-label={`Cor ${c}`}
                  >
                    {selected && (
                      <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Ícone</Label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={iconQuery}
                  onChange={(e) => setIconQuery(e.target.value)}
                  placeholder="Buscar ícone..."
                  className="h-7 w-44 rounded-md border border-input bg-background pl-7 pr-2 text-xs outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>
            <div className="max-h-64 space-y-3 overflow-y-auto rounded-md border border-border p-2">
              {filteredCategories.length === 0 && (
                <p className="px-2 py-4 text-center text-xs text-muted-foreground">
                  Nenhum ícone encontrado
                </p>
              )}
              {filteredCategories.map((cat) => (
                <div key={cat.name}>
                  <div className="px-1 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {cat.name}
                  </div>
                  <div className="grid grid-cols-6 gap-1">
                    {cat.icons.map(({ name: n, component: Icon }) => {
                      const selected = n === iconName;
                      return (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setIconName(n)}
                          title={n}
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-md border-2 transition-colors",
                            selected
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-transparent text-foreground/70 hover:bg-muted",
                          )}
                          style={selected ? { borderColor: color, color } : undefined}
                        >
                          <Icon className="h-4 w-4" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || !name.trim()}>
              {isSubmitting ? "Criando..." : "Criar caderno"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
