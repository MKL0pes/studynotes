import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — StudyNotes" },
      { name: "description", content: "Acesse suas anotações universitárias no StudyNotes." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading && session) navigate({ to: "/dashboard" });
  }, [session, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { name },
          },
        });
        if (error) throw error;
        toast.success("Conta criada! Bem-vindo.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-accent/30 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-elevated">
            <BookOpen className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">StudyNotes</h1>
          <p className="mt-1 text-sm text-muted-foreground">Suas anotações universitárias, organizadas.</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="mb-6 flex rounded-lg bg-muted p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition ${mode === "login" ? "bg-card shadow-sm" : "text-muted-foreground"}`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition ${mode === "signup" ? "bg-card shadow-sm" : "text-muted-foreground"}`}
            >
              Cadastrar
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome completo" />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@universidade.edu" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "..." : mode === "login" ? "Entrar" : "Criar conta"}
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Ao continuar você concorda com os termos de uso.
          </p>
        </div>
      </div>
    </div>
  );
}
