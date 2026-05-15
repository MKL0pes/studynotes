import { createLowlight, all } from "lowlight";
import javascript from "highlight.js/lib/languages/javascript";
import sql from "highlight.js/lib/languages/sql";

export const lowlight = createLowlight(all);

// Aliases for languages users expect but that don't exist as standalone in hljs
lowlight.register("mongodb", javascript);
lowlight.register("postgresql", sql);
lowlight.register("mysql", sql);

export const SUPPORTED_LANGUAGES: { label: string; value: string; group: string }[] = [
  { label: "Plain text", value: "plaintext", group: "Outros" },
  // Web
  { label: "JavaScript", value: "javascript", group: "Web" },
  { label: "TypeScript", value: "typescript", group: "Web" },
  { label: "JSX", value: "javascript", group: "Web" },
  { label: "TSX", value: "typescript", group: "Web" },
  { label: "HTML", value: "xml", group: "Web" },
  { label: "CSS", value: "css", group: "Web" },
  { label: "SCSS", value: "scss", group: "Web" },
  { label: "JSON", value: "json", group: "Web" },
  { label: "XML", value: "xml", group: "Web" },
  { label: "Markdown", value: "markdown", group: "Web" },
  { label: "GraphQL", value: "graphql", group: "Web" },
  // Back-end
  { label: "Python", value: "python", group: "Back-end" },
  { label: "Java", value: "java", group: "Back-end" },
  { label: "Kotlin", value: "kotlin", group: "Back-end" },
  { label: "PHP", value: "php", group: "Back-end" },
  { label: "Ruby", value: "ruby", group: "Back-end" },
  { label: "Go", value: "go", group: "Back-end" },
  { label: "Rust", value: "rust", group: "Back-end" },
  { label: "Swift", value: "swift", group: "Back-end" },
  { label: "C#", value: "csharp", group: "Back-end" },
  { label: "C++", value: "cpp", group: "Back-end" },
  { label: "C", value: "c", group: "Back-end" },
  // DB
  { label: "SQL", value: "sql", group: "Banco" },
  { label: "PostgreSQL", value: "postgresql", group: "Banco" },
  { label: "MySQL", value: "mysql", group: "Banco" },
  { label: "MongoDB", value: "mongodb", group: "Banco" },
  // DevOps
  { label: "Bash", value: "bash", group: "DevOps" },
  { label: "Shell", value: "shell", group: "DevOps" },
  { label: "PowerShell", value: "powershell", group: "DevOps" },
  { label: "Dockerfile", value: "dockerfile", group: "DevOps" },
  { label: "YAML", value: "yaml", group: "DevOps" },
  { label: "TOML", value: "ini", group: "DevOps" },
  { label: "Nginx", value: "nginx", group: "DevOps" },
  { label: "Apache", value: "apache", group: "DevOps" },
  // Outros
  { label: "R", value: "r", group: "Outros" },
  { label: "MATLAB", value: "matlab", group: "Outros" },
  { label: "LaTeX", value: "latex", group: "Outros" },
  { label: "Dart", value: "dart", group: "Outros" },
  { label: "Scala", value: "scala", group: "Outros" },
  { label: "Haskell", value: "haskell", group: "Outros" },
  { label: "Elixir", value: "elixir", group: "Outros" },
  { label: "Lua", value: "lua", group: "Outros" },
  { label: "Vim Script", value: "vim", group: "Outros" },
];

// Color per language (left border accent)
const LANG_COLORS: Record<string, string> = {
  javascript: "#f7df1e",
  typescript: "#3178c6",
  python: "#3572A5",
  java: "#b07219",
  kotlin: "#A97BFF",
  php: "#777bb4",
  ruby: "#cc342d",
  go: "#00ADD8",
  rust: "#dea584",
  swift: "#F05138",
  csharp: "#178600",
  cpp: "#f34b7d",
  c: "#555555",
  xml: "#e34c26",
  css: "#563d7c",
  scss: "#c6538c",
  json: "#cb9a4a",
  markdown: "#083fa1",
  graphql: "#e10098",
  sql: "#e38c00",
  postgresql: "#336791",
  mysql: "#00758F",
  mongodb: "#13aa52",
  bash: "#89e051",
  shell: "#89e051",
  powershell: "#012456",
  dockerfile: "#2496ED",
  yaml: "#cb171e",
  nginx: "#009639",
  apache: "#d22128",
  r: "#198CE7",
  dart: "#00B4AB",
  scala: "#c22d40",
  haskell: "#5e5086",
  elixir: "#6e4a7e",
  lua: "#000080",
  plaintext: "#9ca3af",
};

export function colorForLang(lang: string) {
  return LANG_COLORS[lang] || "#9ca3af";
}

export function labelForLang(lang: string) {
  const m = SUPPORTED_LANGUAGES.find((l) => l.value === lang);
  return m?.label || lang;
}
