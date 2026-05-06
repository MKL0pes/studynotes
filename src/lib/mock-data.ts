export type Notebook = { id: string; name: string; emoji: string; color: string };
export type Note = { id: string; notebookId: string; title: string; preview: string; updatedAt: string };

export const notebooks: Notebook[] = [
  { id: "calc", name: "Cálculo I", emoji: "📐", color: "oklch(0.7 0.18 30)" },
  { id: "fis", name: "Física", emoji: "⚛️", color: "oklch(0.65 0.18 250)" },
  { id: "prog", name: "Programação", emoji: "💻", color: "oklch(0.65 0.18 150)" },
  { id: "hist", name: "História", emoji: "📜", color: "oklch(0.7 0.15 70)" },
  { id: "fil", name: "Filosofia", emoji: "🧠", color: "oklch(0.6 0.2 320)" },
];

export const notes: Note[] = [
  { id: "n1", notebookId: "calc", title: "Limites e continuidade", preview: "Definição formal de limite usando epsilon e delta...", updatedAt: "Hoje, 14:32" },
  { id: "n2", notebookId: "calc", title: "Derivadas — regras básicas", preview: "Regra do produto, quociente e cadeia com exemplos...", updatedAt: "Ontem" },
  { id: "n3", notebookId: "calc", title: "Aula 04 — Integrais", preview: "Integral definida e indefinida, teorema fundamental...", updatedAt: "2 dias" },
  { id: "n4", notebookId: "fis", title: "Leis de Newton", preview: "Inércia, força e ação-reação aplicadas a sistemas...", updatedAt: "3 dias" },
  { id: "n5", notebookId: "prog", title: "Estruturas de dados", preview: "Listas, pilhas, filas e árvores binárias...", updatedAt: "1 sem" },
];

export const getNotebook = (id: string) => notebooks.find((n) => n.id === id);
export const getNote = (id: string) => notes.find((n) => n.id === id);
export const getNotesByNotebook = (id: string) => notes.filter((n) => n.notebookId === id);
