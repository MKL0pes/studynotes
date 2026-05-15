import { NodeViewContent, NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { Check, ChevronDown, Copy, GripHorizontal, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { SUPPORTED_LANGUAGES, colorForLang, labelForLang } from "@/lib/lowlight-instance";

const MIN_HEIGHT = 80;
const MAX_HEIGHT = 800;

export function AdvancedCodeBlockView({ node, updateAttributes, editor }: NodeViewProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const language = (node.attrs.language as string) || "plaintext";
  const height = (node.attrs.height as number | null) ?? null;
  const accent = colorForLang(language);

  const startResize = (e: React.MouseEvent) => {
    if (!editor.isEditable) return;
    e.preventDefault();
    e.stopPropagation();
    const startY = e.clientY;
    const startH = height ?? 200;
    const onMove = (ev: MouseEvent) => {
      const next = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, startH + (ev.clientY - startY)));
      updateAttributes({ height: Math.round(next) });
    };
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SUPPORTED_LANGUAGES;
    return SUPPORTED_LANGUAGES.filter(
      (l) => l.label.toLowerCase().includes(q) || l.value.toLowerCase().includes(q),
    );
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(node.textContent);
      setCopied(true);
      toast.success("Código copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Não foi possível copiar");
    }
  };

  const lineCount = Math.max(1, node.textContent.split("\n").length);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <NodeViewWrapper
      className="code-block-advanced relative my-4 overflow-hidden rounded-lg border border-[#313244] shadow-sm"
      style={{ borderLeft: `3px solid ${accent}` }}
    >
      <div
        className="flex items-center justify-between gap-2 border-b border-[#313244] bg-[#181825] px-3 py-1.5"
        contentEditable={false}
      >
        <div ref={wrapperRef} className="relative">
          <button
            type="button"
            disabled={!editor.isEditable}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-7 items-center gap-1.5 rounded-md border border-[#313244] bg-[#1e1e2e] px-2 text-xs font-medium text-[#cdd6f4] hover:bg-[#313244] disabled:opacity-60"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: accent }}
            />
            {labelForLang(language)}
            <ChevronDown className="h-3 w-3 opacity-70" />
          </button>
          {open && (
            <div className="absolute left-0 top-full z-50 mt-1 max-h-72 w-60 overflow-hidden rounded-md border border-[#313244] bg-[#1e1e2e] shadow-xl">
              <div className="flex items-center gap-1.5 border-b border-[#313244] px-2 py-1.5">
                <Search className="h-3.5 w-3.5 text-[#a6adc8]" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar linguagem..."
                  className="w-full bg-transparent text-xs text-[#cdd6f4] outline-none placeholder:text-[#6c7086]"
                />
              </div>
              <ul className="max-h-56 overflow-y-auto py-1">
                {filtered.length === 0 && (
                  <li className="px-3 py-2 text-xs text-[#6c7086]">Nada encontrado</li>
                )}
                {filtered.map((l) => (
                  <li key={`${l.value}-${l.label}`}>
                    <button
                      type="button"
                      onClick={() => {
                        updateAttributes({ language: l.value });
                        setOpen(false);
                        setQuery("");
                      }}
                      className={`flex w-full items-center gap-2 px-3 py-1 text-left text-xs transition-colors hover:bg-[#313244] ${
                        l.value === language ? "text-[#89b4fa]" : "text-[#cdd6f4]"
                      }`}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: colorForLang(l.value) }}
                      />
                      <span className="flex-1">{l.label}</span>
                      <span className="text-[10px] text-[#6c7086]">{l.group}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] text-[#a6adc8] transition-colors hover:bg-[#313244] hover:text-[#cdd6f4]"
          title="Copiar código"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-[#a6e3a1]" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copiado!" : "Copiar"}
        </button>
      </div>

      <div className="code-block-body relative flex bg-[#1e1e2e]">
        <div
          aria-hidden
          contentEditable={false}
          className="select-none border-r border-[#313244] px-2 py-3 text-right font-mono text-xs leading-[1.6] text-[#6c7086]"
          style={{ fontFamily: "'JetBrains Mono', ui-monospace, Menlo, monospace" }}
        >
          {lineNumbers.map((n) => (
            <div key={n}>{n}</div>
          ))}
        </div>
        <pre className="flex-1 overflow-x-auto px-3 py-3 text-sm leading-[1.6]">
          <NodeViewContent
            as={"code" as unknown as "div"}
            className={`hljs language-${language}`}
          />
        </pre>
      </div>
    </NodeViewWrapper>
  );
}
