import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Camera, HelpCircle, LogOut, Moon, Sun, Trash2, User } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteOwnAccount } from "@/lib/account.functions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    q: "Minhas notas estão sincronizadas em todos os dispositivos?",
    a: "Sim. Tudo é salvo automaticamente na nuvem em poucos segundos e fica disponível em qualquer dispositivo onde você fizer login.",
  },
  {
    q: "Como funciona o compartilhamento de notas?",
    a: "Use o ícone de compartilhar na nota, informe o e-mail da pessoa e escolha se ela pode apenas ver ou também editar. O destinatário verá a nota ao fazer login com aquele e-mail.",
  },
  {
    q: "Posso usar imagens, código e quizzes nas notas?",
    a: "Sim. O editor suporta imagens com redimensionamento, blocos de código com mais de 40 linguagens e destaque de sintaxe, quizzes interativos e checklists de tarefas.",
  },
  {
    q: "Como ativo o modo escuro?",
    a: "Use o botão na seção 'Aparência' acima para alternar entre claro e escuro. Sua preferência fica salva no navegador.",
  },
  {
    q: "Minhas notas vão expirar ou ser apagadas?",
    a: "Não. Suas notas ficam armazenadas indefinidamente enquanto sua conta existir. Imagens são recarregadas automaticamente para não expirarem.",
  },
  {
    q: "Como excluo minha conta?",
    a: "Use o botão 'Excluir conta' na seção Conta. A exclusão é permanente e remove todas as notas, cadernos e arquivos enviados.",
  },
];

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Configurações — StudyNotes" },
      { name: "description", content: "Gerencie seu perfil, aparência e conta." },
    ],
  }),
  component: SettingsPage,
});

type Profile = {
  display_name: string | null;
  avatar_url: string | null;
};

function SettingsPage() {
  const { session, user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { theme, toggle } = useTheme();
  const fileRef = useRef<HTMLInputElement>(null);
  const deleteFn = useServerFn(deleteOwnAccount);

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/login" });
  }, [loading, session, navigate]);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return (data ?? { display_name: "", avatar_url: "" }) as Profile;
    },
  });

  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name ?? "");
      setAvatarUrl(profile.avatar_url ?? null);
    }
  }, [profile]);

  const saveProfile = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Não autenticado");
      const { error } = await supabase
        .from("profiles")
        .update({ display_name: displayName, avatar_url: avatarUrl })
        .eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Perfil atualizado!");
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (e) => toast.error((e as Error).message),
  });

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "png";
      const path = `${user.id}/avatar-${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, cacheControl: "3600" });
      if (error) throw error;
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      setAvatarUrl(data.publicUrl);
      toast.success("Foto carregada. Clique em Salvar para confirmar.");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/login" });
  };

  const handleDelete = async () => {
    if (deleteConfirm !== "EXCLUIR") return;
    setDeleting(true);
    try {
      await deleteFn();
      toast.success("Conta excluída");
      await supabase.auth.signOut();
      navigate({ to: "/login" });
    } catch (e) {
      toast.error((e as Error).message);
      setDeleting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Carregando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-8 flex items-center gap-3">
          <Link
            to="/dashboard"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
        </div>

        {/* Perfil */}
        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Perfil
          </h2>

          <div className="mt-5 flex items-center gap-5">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-muted">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50"
                aria-label="Trocar foto"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarChange}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {uploading ? "Enviando foto..." : "Clique no ícone para enviar uma nova foto."}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="display-name">Nome de exibição</Label>
              <Input
                id="display-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Seu nome"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" value={user.email ?? ""} disabled />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={() => saveProfile.mutate()} disabled={saveProfile.isPending}>
              {saveProfile.isPending ? "Salvando..." : "Salvar alterações"}
            </Button>
          </div>
        </section>

        {/* Aparência */}
        <section className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Aparência
          </h2>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Tema</div>
              <p className="text-xs text-muted-foreground">
                Alternar entre modo claro e escuro.
              </p>
            </div>
            <Button variant="outline" onClick={toggle} className="gap-2">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === "dark" ? "Modo claro" : "Modo escuro"}
            </Button>
          </div>
        </section>

        {/* Conta */}
        <section className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Conta
          </h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Sair da conta</div>
                <p className="text-xs text-muted-foreground">
                  Você precisará fazer login novamente.
                </p>
              </div>
              <Button variant="outline" className="gap-2" onClick={() => setSignOutOpen(true)}>
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>

            <div className="flex items-center justify-between border-t border-border pt-4">
              <div>
                <div className="text-sm font-medium text-destructive">Excluir conta</div>
                <p className="text-xs text-muted-foreground">
                  Esta ação é permanente e removerá todos os seus dados.
                </p>
              </div>
              <Button
                variant="destructive"
                className="gap-2"
                onClick={() => {
                  setDeleteConfirm("");
                  setDeleteOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4" />
                Excluir conta
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Sign out confirm */}
      <Dialog open={signOutOpen} onOpenChange={setSignOutOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Sair da conta?</DialogTitle>
            <DialogDescription>
              Você será redirecionado para a tela de login.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setSignOutOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSignOut}>Sair</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={deleteOpen} onOpenChange={(v) => !deleting && setDeleteOpen(v)}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle className="text-destructive">Excluir conta permanentemente</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. Para confirmar, digite{" "}
              <span className="font-mono font-semibold text-foreground">EXCLUIR</span> abaixo.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            placeholder="EXCLUIR"
            autoFocus
          />
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setDeleteOpen(false)} disabled={deleting}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteConfirm !== "EXCLUIR" || deleting}
            >
              {deleting ? "Excluindo..." : "Excluir conta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
