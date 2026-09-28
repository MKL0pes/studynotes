import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Code2, Share2, Tags } from "lucide-react";

const TITLE = "StudyNotes — Anotações universitárias organizadas";
const DESC =
  "Organize suas anotações da faculdade em cadernos, com editor rico, blocos de código, quizzes, tags e compartilhamento.";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://studynotesmk.lovable.app/" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://studynotesmk.lovable.app/" }],
  }),
  component: Home,
});

const FEATURES = [
  { icon: BookOpen, title: "Cadernos por disciplina", text: "Separe as notas de cada matéria com cores e ícones próprios." },
  { icon: Code2, title: "Editor completo", text: "Formatação, imagens, blocos de código com destaque de sintaxe e quizzes." },
  { icon: Tags, title: "Busca e tags", text: "Encontre qualquer anotação em segundos pelo título, conteúdo ou tag." },
  { icon: Share2, title: "Compartilhamento", text: "Envie notas para colegas com permissão de leitura ou edição." },
];

function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">StudyNotes</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Suas anotações da faculdade, organizadas em um só lugar
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">{DESC}</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/login" className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground shadow-sm hover:opacity-90">
            Começar agora
          </Link>
          <Link to="/dashboard" className="rounded-lg border border-border px-6 py-3 font-medium hover:bg-muted">
            Ir para o painel
          </Link>
        </div>
      </section>
      <section className="mx-auto grid max-w-5xl gap-4 px-6 pb-20 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <f.icon className="h-6 w-6 text-primary" />
            <h2 className="mt-3 text-lg font-semibold">{f.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
