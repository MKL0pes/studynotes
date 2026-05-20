export type Notebook = {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon_name: string;
  created_at: string;
};

export type Note = {
  id: string;
  user_id: string;
  notebook_id: string;
  title: string;
  content: string;
  is_favorite: boolean;
  is_archived: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
};

export const notebookEmoji = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("calc") || n.includes("mat")) return "📐";
  if (n.includes("fis")) return "⚛️";
  if (n.includes("prog") || n.includes("comp")) return "💻";
  if (n.includes("hist")) return "📜";
  if (n.includes("fil")) return "🧠";
  if (n.includes("bio")) return "🧬";
  if (n.includes("quim")) return "🧪";
  return "📓";
};

export const formatRelative = (iso: string) => {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h`;
  const days = Math.floor(h / 24);
  if (days < 7) return `${days}d`;
  return d.toLocaleDateString("pt-BR");
};
