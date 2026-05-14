import { NodeViewContent, NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const LANGUAGES = [
  { label: "Plain text", value: "plaintext" },
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "Python", value: "python" },
  { label: "HTML", value: "xml" },
  { label: "CSS", value: "css" },
  { label: "SQL", value: "sql" },
  { label: "Bash", value: "bash" },
  { label: "Java", value: "java" },
  { label: "C", value: "c" },
  { label: "C++", value: "cpp" },
];

export function CodeBlockView({ node, updateAttributes, editor }: NodeViewProps) {
  const [copied, setCopied] = useState(false);
  const language = (node.attrs.language as string) || "plaintext";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(node.textContent);
      setCopied(true);
      toast.success("Copiado!");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Não foi possível copiar");
    }
  };

  return (
    <NodeViewWrapper className="code-block-wrapper relative my-3 overflow-hidden rounded-lg border border-border bg-muted/40">
      <div
        className="flex items-center justify-between gap-2 border-b border-border/60 bg-muted/60 px-2 py-1"
        contentEditable={false}
      >
        <select
          value={language}
          onChange={(e) => updateAttributes({ language: e.target.value })}
          disabled={!editor.isEditable}
          className="h-6 rounded border border-input bg-background px-1.5 text-[11px] text-foreground/80 outline-none focus:ring-1 focus:ring-ring"
        >
          {LANGUAGES.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title="Copiar código"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>
      <pre className="overflow-x-auto px-3 py-2 text-sm">
        <NodeViewContent
          as={"code" as unknown as "div"}
          className={`language-${language}`}
        />
      </pre>
    </NodeViewWrapper>
  );
}
