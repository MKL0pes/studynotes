import { useState } from "react";
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
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const NOTEBOOK_COLORS = [
  "#4F46E5", // indigo
  "#0EA5E9", // sky
  "#10B981", // emerald
  "#F59E0B", // amber
  "#EF4444", // red
  "#EC4899", // pink
  "#8B5CF6", // violet
  "#14B8A6", // teal
];

export function CreateNotebookDialog({
  open,
  onOpenChange,
  onCreate,
  isSubmitting,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (data: { name: string; color: string }) => void | Promise<void>;
  isSubmitting?: boolean;
}) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(NOTEBOOK_COLORS[0]);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setName("");
    setColor(NOTEBOOK_COLORS[0]);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Digite um nome para o caderno.");
      return;
    }
    await onCreate({ name: trimmed, color });
    reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) reset();
      }}
    >
      <DialogContent className="sm:max-w-[420px]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <DialogHeader>
            <DialogTitle>Novo caderno</DialogTitle>
            <DialogDescription>
              Organize suas anotações por matéria ou projeto.
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
                      selected
                        ? "border-foreground scale-110"
                        : "border-transparent hover:scale-105",
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

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
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
