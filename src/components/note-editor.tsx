import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bold,
  Code2,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  MoreHorizontal,
  Share2,
  Star,
  Underline as UnderlineIcon,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { createLowlight, common } from "lowlight";
import type { Note } from "@/lib/db-types";
import { formatRelative } from "@/lib/db-types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUpdateNote } from "@/lib/queries";

const lowlight = createLowlight(common);

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
  const [title, setTitle] = useState(note?.title ?? "");
  const [tags, setTags] = useState<string[]>(note?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const lastSavedRef = useRef<{ title: string; content: string; tags: string[] }>({
    title: "",
    content: "",
    tags: [],
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      CodeBlockLowlight.configure({ lowlight, defaultLanguage: "plaintext" }),
    ],
    content: note?.content || "",
    editorProps: {
      attributes: { class: "tiptap" },
      transformPastedHTML: (html) => html,
    },
    immediatelyRender: false,
  });

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

  const toggleFavorite = () => {
    if (!note) return;
    update.mutate({ id: note.id, is_favorite: !note.is_favorite });
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
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
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
