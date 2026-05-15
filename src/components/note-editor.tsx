import { Link, useNavigate } from "@tanstack/react-router";
import {
  Archive,
  ArchiveRestore,
  ArrowLeft,
  Bold,
  BookOpen,
  Code2,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  MoreHorizontal,
  Palette,
  Share2,
  Star,
  Trash2,
  Underline as UnderlineIcon,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { AdvancedCodeBlockView } from "@/components/editor/code-block-view";
import { FileAttachment } from "@/components/editor/file-attachment-node";
import { Quiz } from "@/components/editor/quiz-node";
import { TaskBlock } from "@/components/editor/task-block-node";
import { UploadButton } from "@/components/editor/upload-button";
import { TextStyle } from "@tiptap/extension-text-style";
import { FontFamily } from "@tiptap/extension-font-family";
import { Color } from "@tiptap/extension-color";
import { lowlight } from "@/lib/lowlight-instance";
import type { Note } from "@/lib/db-types";
import { formatRelative } from "@/lib/db-types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUpdateNote, useDeleteNote } from "@/lib/queries";
import { useAuth } from "@/hooks/use-auth";
import { ListChecks, HelpCircle } from "lucide-react";
import { toast } from "sonner";

// Custom FontSize mark — extends TextStyle to add a fontSize attribute
const FontSize = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fontSize: {
        default: null,
        parseHTML: (element) => (element as HTMLElement).style.fontSize || null,
        renderHTML: (attrs: { fontSize?: string | null }) =>
          attrs.fontSize ? { style: `font-size: ${attrs.fontSize}` } : {},
      },
    };
  },
  addCommands() {
    return {
      ...this.parent?.(),
      setFontSize:
        (size: string) =>
        ({ chain }: { chain: () => any }) =>
          chain().setMark("textStyle", { fontSize: size }).run(),
      unsetFontSize:
        () =>
        ({ chain }: { chain: () => any }) =>
          chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run(),
    } as any;
  },
});

const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 96;
const DEFAULT_FONT_SIZE = 16;

function FontSizeControl({ editor }: { editor: Editor }) {
  const current = (editor.getAttributes("textStyle").fontSize as string) || "";
  const currentNum = parseInt(current, 10) || DEFAULT_FONT_SIZE;
  const [val, setVal] = useState<string>(current ? String(currentNum) : "");

  useEffect(() => {
    setVal(current ? String(parseInt(current, 10) || DEFAULT_FONT_SIZE) : "");
  }, [current]);

  const apply = (n: number) => {
    const clamped = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, n));
    (editor.chain().focus() as any).setFontSize(`${clamped}px`).run();
    setVal(String(clamped));
  };

  const bump = (delta: number) => apply((parseInt(val, 10) || DEFAULT_FONT_SIZE) + delta);

  return (
    <div className="flex items-center gap-0.5">
      <button
        type="button"
        title="Diminuir tamanho"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => bump(-1)}
        className="inline-flex h-8 w-7 items-center justify-center rounded-md text-sm text-foreground/70 transition-colors hover:bg-muted"
      >
        −
      </button>
      <input
        type="number"
        min={MIN_FONT_SIZE}
        max={MAX_FONT_SIZE}
        value={val}
        title="Tamanho da fonte (px)"
        placeholder="16"
        onMouseDown={(e) => e.stopPropagation()}
        onChange={(e) => setVal(e.target.value)}
        onBlur={() => {
          const n = parseInt(val, 10);
          if (!Number.isFinite(n)) {
            (editor.chain().focus() as any).unsetFontSize().run();
            setVal("");
          } else apply(n);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            (e.target as HTMLInputElement).blur();
          }
        }}
        className="h-8 w-14 rounded-md border border-input bg-background px-2 text-center text-xs text-foreground/80 outline-none transition-colors focus:ring-1 focus:ring-ring [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        title="Aumentar tamanho"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => bump(1)}
        className="inline-flex h-8 w-7 items-center justify-center rounded-md text-sm text-foreground/70 transition-colors hover:bg-muted"
      >
        +
      </button>
    </div>
  );
}

const FONT_FAMILIES = [
  { label: "Inter", value: "Inter, ui-sans-serif, system-ui, sans-serif" },
  { label: "Arial", value: "Arial, Helvetica, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Times New Roman", value: "'Times New Roman', Times, serif" },
  { label: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
  { label: "Verdana", value: "Verdana, Geneva, sans-serif" },
  { label: "Courier New", value: "'Courier New', Courier, monospace" },
  { label: "JetBrains Mono", value: "'JetBrains Mono', ui-monospace, Menlo, monospace" },
  { label: "Playfair Display", value: "'Playfair Display', Georgia, serif" },
  { label: "Roboto", value: "Roboto, system-ui, sans-serif" },
  { label: "Lato", value: "Lato, system-ui, sans-serif" },
  { label: "Merriweather", value: "Merriweather, Georgia, serif" },
];

function ToolbarSelect({
  value,
  onChange,
  options,
  title,
  width = "w-32",
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  title: string;
  width?: string;
}) {
  return (
    <select
      title={title}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onMouseDown={(e) => e.stopPropagation()}
      className={`h-8 ${width} rounded-md border border-input bg-background px-2 text-xs text-foreground/80 outline-none transition-colors hover:bg-muted focus:ring-1 focus:ring-ring`}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}


function ToolbarButton({
  onClick,
  active,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={title}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors hover:bg-muted ${
        active ? "bg-accent text-accent-foreground" : "text-foreground/70"
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;
  const sep = <div className="mx-1 h-5 w-px bg-border" />;
  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-background/60 px-3 py-1.5">
      <ToolbarButton
        title="Negrito"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Itálico"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Sublinhado"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="h-4 w-4" />
      </ToolbarButton>
      {sep}
      <ToolbarButton
        title="Título 1"
        active={editor.isActive("heading", { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Título 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-4 w-4" />
      </ToolbarButton>
      {sep}
      <ToolbarButton
        title="Lista com marcadores"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Lista numerada"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>
      {sep}
      <ToolbarButton
        title="Bloco de código"
        active={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <Code2 className="h-4 w-4" />
      </ToolbarButton>
      {sep}
      <ToolbarSelect
        title="Família da fonte"
        width="w-32"
        value={(editor.getAttributes("textStyle").fontFamily as string) || ""}
        onChange={(v) => {
          if (!v) editor.chain().focus().unsetFontFamily().run();
          else editor.chain().focus().setFontFamily(v).run();
        }}
        options={[{ label: "Fonte", value: "" }, ...FONT_FAMILIES]}
      />
      <FontSizeControl editor={editor} />
      {sep}
      <label
        title="Cor do texto"
        className="relative inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-muted"
        onMouseDown={(e) => e.preventDefault()}
      >
        <Palette className="h-4 w-4" />
        <span
          className="pointer-events-none absolute bottom-1 left-1/2 h-1 w-4 -translate-x-1/2 rounded-sm border border-border"
          style={{
            backgroundColor:
              (editor.getAttributes("textStyle").color as string) || "transparent",
          }}
        />
        <input
          type="color"
          value={(editor.getAttributes("textStyle").color as string) || "#000000"}
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </label>
      <ToolbarButton
        title="Limpar cor"
        onClick={() => editor.chain().focus().unsetColor().run()}
      >
        <X className="h-3.5 w-3.5" />
      </ToolbarButton>
    </div>
  );
}

export function NoteEditor({
  note,
  backTo,
}: {
  note?: Note;
  backTo?: { to: "/notebook/$id"; params: { id: string } };
}) {
  const update = useUpdateNote();
  const del = useDeleteNote();
  const navigate = useNavigate();
  const [title, setTitle] = useState(note?.title ?? "");
  const [tags, setTags] = useState<string[]>(note?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [readingMode, setReadingMode] = useState(false);
  const lastSavedRef = useRef<{ title: string; content: string; tags: string[] }>({
    title: "",
    content: "",
    tags: [],
  });
  // Snapshot of the currently open note to evaluate emptiness on unmount/switch
  const currentRef = useRef<{
    id: string;
    title: string;
    content: string;
    tags: string[];
    is_favorite: boolean;
  } | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      Image.configure({ inline: false, allowBase64: false }),
      FileAttachment,
      Quiz,
      TaskBlock,
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(AdvancedCodeBlockView);
        },
        addKeyboardShortcuts() {
          return {
            ...this.parent?.(),
            Tab: () => {
              if (!this.editor.isActive("codeBlock")) return false;
              this.editor.chain().focus().insertContent("  ").run();
              return true;
            },
            Enter: () => {
              const ed = this.editor;
              if (!ed.isActive("codeBlock")) return false;
              const { state } = ed;
              const { $from } = state.selection;
              const lineStart = $from.start();
              const before = state.doc.textBetween(lineStart, $from.pos, "\n", "\n");
              const lastLine = before.split("\n").pop() || "";
              const indentMatch = lastLine.match(/^(\s+)/);
              const indent = indentMatch ? indentMatch[1] : "";
              const trimmed = lastLine.trim();
              const opens = /[{[(]\s*$/.test(trimmed);
              const extra = opens ? "  " : "";
              ed.chain().focus().insertContent("\n" + indent + extra).run();
              return true;
            },
            "Shift-Tab": () => {
              const ed = this.editor;
              if (!ed.isActive("codeBlock")) return false;
              const { state } = ed;
              const { $from } = state.selection;
              const lineStart = $from.start();
              const before = state.doc.textBetween(lineStart, $from.pos, "\n", "\n");
              const lastLine = before.split("\n").pop() || "";
              if (lastLine.startsWith("  ")) {
                const from = $from.pos - lastLine.length;
                ed.chain().focus().setTextSelection({ from, to: from + 2 }).deleteSelection().run();
                return true;
              }
              return false;
            },
          };
        },
      }).configure({ lowlight, defaultLanguage: "plaintext" }),
      FontSize,
      FontFamily.configure({ types: ["textStyle"] }),
      Color.configure({ types: ["textStyle"] }),
    ],
    content: note?.content || "",
    editorProps: {
      attributes: { class: "tiptap" },
      transformPastedHTML: (html) => html,
      handleKeyDown: (_view, event) => {
        // Auto-dedent on closing brace/bracket/paren in code block
        if (!editorRef.current?.isActive("codeBlock")) return false;
        if (!["}", "]", ")"].includes(event.key)) return false;
        const ed = editorRef.current;
        const { state } = ed;
        const { $from } = state.selection;
        const lineStart = $from.start();
        const before = state.doc.textBetween(lineStart, $from.pos, "\n", "\n");
        const lastLine = before.split("\n").pop() || "";
        if (/^\s+$/.test(lastLine) && lastLine.length >= 2) {
          const from = $from.pos - 2;
          ed.chain().focus().setTextSelection({ from, to: from + 2 }).deleteSelection().run();
        }
        return false;
      },
    },
    immediatelyRender: false,
  });
  const editorRef = useRef<Editor | null>(null);
  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  // Decorate <pre> with data-language for the corner label
  useEffect(() => {
    if (!editor) return;
    const decorate = () => {
      const root = editor.view.dom as HTMLElement;
      root.querySelectorAll("pre").forEach((pre) => {
        const codeEl = pre.querySelector("code");
        const cls = codeEl?.className || "";
        const m = cls.match(/language-([\w-]+)/);
        const lang = m ? m[1] : "plaintext";
        pre.setAttribute("data-language", lang);
      });
    };
    decorate();
    editor.on("update", decorate);
    editor.on("selectionUpdate", decorate);
    return () => {
      editor.off("update", decorate);
      editor.off("selectionUpdate", decorate);
    };
  }, [editor]);

  // Hydrate state when note changes
  useEffect(() => {
    if (!note || !editor) return;
    setTitle(note.title);
    setTags(note.tags ?? []);
    if (editor.getHTML() !== (note.content || "<p></p>")) {
      editor.commands.setContent(note.content || "");
    }
    lastSavedRef.current = {
      title: note.title,
      content: note.content,
      tags: note.tags ?? [],
    };
  }, [note?.id, editor]);

  // Debounced autosave
  useEffect(() => {
    if (!note || !editor) return;
    const t = setTimeout(() => {
      const content = editor.getHTML();
      const last = lastSavedRef.current;
      const tagsChanged =
        tags.length !== last.tags.length || tags.some((t, i) => t !== last.tags[i]);
      if (title !== last.title || content !== last.content || tagsChanged) {
        update.mutate({ id: note.id, title, content, tags });
        lastSavedRef.current = { title, content, tags };
      }
    }, 800);
    return () => clearTimeout(t);
  }, [title, tags, note?.id, editor]);

  // Trigger save also on editor updates
  const [, forceTick] = useState(0);
  useEffect(() => {
    if (!editor) return;
    const handler = () => forceTick((n) => n + 1);
    editor.on("update", handler);
    return () => {
      editor.off("update", handler);
    };
  }, [editor]);

  // Keep snapshot in sync with current edits
  useEffect(() => {
    if (!note || !editor) return;
    currentRef.current = {
      id: note.id,
      title,
      content: editor.getHTML(),
      tags,
      is_favorite: note.is_favorite,
    };
  });

  // Notes are only deleted via explicit user action (handleDelete).

  const toggleFavorite = () => {
    if (!note) return;
    update.mutate({ id: note.id, is_favorite: !note.is_favorite });
  };

  const handleShare = async () => {
    if (!note) return;
    const url = `${window.location.origin}/note/${note.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copiado!");
    } catch {
      toast.error("Não foi possível copiar o link");
    }
  };

  const toggleArchive = () => {
    if (!note) return;
    const next = !note.is_archived;
    // Prevent the empty-on-unmount cleanup from also deleting this note
    currentRef.current = null;
    update.mutate(
      { id: note.id, is_archived: next },
      {
        onSuccess: () => toast.success(next ? "Nota arquivada" : "Nota desarquivada"),
      },
    );
  };

  const handleDelete = () => {
    if (!note) return;
    if (!window.confirm("Excluir esta nota? Essa ação não pode ser desfeita.")) return;
    currentRef.current = null;
    del.mutate(note.id, {
      onSuccess: () => {
        toast.success("Nota excluída");
        navigate({ to: "/dashboard" });
      },
    });
  };

  const addTag = (raw: string) => {
    const value = raw.trim().replace(/^#/, "");
    if (!value || tags.includes(value)) return;
    setTags((prev) => [...prev, value]);
    setTagInput("");
  };
  const removeTag = (t: string) => setTags((prev) => prev.filter((x) => x !== t));
  const onTagKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === "Backspace" && !tagInput && tags.length) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  if (!note) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-background px-6 text-center">
        <div className="mb-4 text-5xl">📝</div>
        <h2 className="text-lg font-semibold">Selecione uma nota</h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Escolha uma anotação na lista ao lado para começar a editar, ou crie uma nova.
        </p>
      </div>
    );
  }

  const tagColors = [
    "bg-primary/10 text-primary",
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  ];
  const colorFor = (t: string) => {
    let h = 0;
    for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) % tagColors.length;
    return tagColors[h];
  };

  if (readingMode) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-background">
        <div className="sticky top-0 z-10 flex justify-end border-b border-border/60 bg-background/80 px-6 py-3 backdrop-blur">
          <Button variant="outline" size="sm" onClick={() => setReadingMode(false)}>
            <X className="mr-1.5 h-4 w-4" />
            Sair do modo leitura
          </Button>
        </div>
        <article className="mx-auto max-w-[720px] px-6 py-12 md:py-16">
          <h1 className="mb-8 text-4xl font-bold tracking-tight">{title || "Sem título"}</h1>
          <div
            className="tiptap reading-mode text-[1.0625rem] leading-[1.8]"
            dangerouslySetInnerHTML={{ __html: editor?.getHTML() || note.content || "" }}
          />
        </article>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col bg-background">
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <div className="flex items-center gap-2">
          {backTo ? (
            <Link
              to={backTo.to}
              params={backTo.params}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted md:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          ) : null}
          <span className="text-xs text-muted-foreground">
            Atualizado {formatRelative(note.updated_at)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleFavorite}
            title={note.is_favorite ? "Remover dos favoritos" : "Favoritar"}
          >
            <Star
              className={`h-4 w-4 ${note.is_favorite ? "fill-primary text-primary" : ""}`}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setReadingMode(true)}
            title="Modo leitura"
          >
            <BookOpen className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleShare} title="Copiar link">
            <Share2 className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" title="Mais ações">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={toggleArchive}>
                {note.is_archived ? (
                  <>
                    <ArchiveRestore className="mr-2 h-4 w-4" />
                    Desarquivar nota
                  </>
                ) : (
                  <>
                    <Archive className="mr-2 h-4 w-4" />
                    Arquivar nota
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir nota
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Toolbar editor={editor} />

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6 py-8 md:px-10 md:py-10">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Sem título"
            className="w-full bg-transparent text-3xl font-bold tracking-tight outline-none placeholder:text-muted-foreground/50 md:text-4xl"
          />

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {tags.map((t) => (
              <Badge
                key={t}
                variant="secondary"
                className={`gap-1 rounded-full border-transparent px-2.5 py-0.5 text-xs font-medium ${colorFor(t)}`}
              >
                #{t}
                <button
                  type="button"
                  onClick={() => removeTag(t)}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10"
                  aria-label={`Remover tag ${t}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={onTagKey}
              onBlur={() => tagInput && addTag(tagInput)}
              placeholder={tags.length ? "Adicionar tag" : "Adicionar tags (Enter)"}
              className="min-w-[140px] flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
            />
          </div>

          <div className="mt-6">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
}
