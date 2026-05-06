import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const navigate = useNavigate();

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
              onClick={() => setMode("login")}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition ${mode === "login" ? "bg-card shadow-sm" : "text-muted-foreground"}`}
            >
              Entrar
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition ${mode === "signup" ? "bg-card shadow-sm" : "text-muted-foreground"}`}
            >
              Cadastrar
            </button>
          </div>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/dashboard" });
            }}
          >
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" placeholder="Seu nome completo" />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="voce@universidade.edu" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full">
              {mode === "login" ? "Entrar" : "Criar conta"}
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Ao continuar você concorda com os termos de uso.
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Pular para o dashboard →</Link>
        </p>
      </div>
    </div>
  );
}
