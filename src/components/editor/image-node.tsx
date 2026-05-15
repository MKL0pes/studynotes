import Image from "@tiptap/extension-image";
import { mergeAttributes } from "@tiptap/core";
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type NodeViewProps,
} from "@tiptap/react";
import { useEffect, useRef, useState } from "react";
import { AlignCenter, AlignLeft, AlignRight, Captions, GripVertical, Trash2 } from "lucide-react";

type Align = "left" | "center" | "right";

function ResizableImageView({ node, updateAttributes, selected, deleteNode, editor }: NodeViewProps) {
  const editable = editor.isEditable;
  const src = node.attrs.src as string;
  const alt = (node.attrs.alt as string) || "";
  const width = node.attrs.width as number | null;
  const align = (node.attrs.align as Align) || "center";
  const caption = (node.attrs.caption as string) || "";

  const [editingCaption, setEditingCaption] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const startResize = (
    e: React.MouseEvent,
    corner: "tl" | "tr" | "bl" | "br" | "l" | "r",
  ) => {
    if (!editable || !imgRef.current || !wrapperRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startWidth = imgRef.current.getBoundingClientRect().width;
    const containerWidth = wrapperRef.current.parentElement?.getBoundingClientRect().width ?? 720;
    const dirRight = corner === "tr" || corner === "br" || corner === "r";

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      const delta = dirRight ? dx : -dx;
      const next = Math.max(80, Math.min(containerWidth, startWidth + delta));
      updateAttributes({ width: Math.round(next) });
    };
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  // Wrapper class applies float so text flows around left/right images.
  const wrapperClass =
    align === "left"
      ? "float-left mr-4 mb-2 clear-left"
      : align === "right"
        ? "float-right ml-4 mb-2 clear-right"
        : "mx-auto block my-3 clear-both";

  const handle =
    "absolute z-10 h-3 w-3 rounded-sm border border-primary bg-background shadow";

  return (
    <NodeViewWrapper as="span" className="inline-block w-full">
      <figure
        ref={wrapperRef}
        className={`relative max-w-full ${wrapperClass} ${selected ? "outline outline-2 outline-primary/60" : ""}`}
        style={{ width: width ? `${width}px` : "auto" }}
      >
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          draggable={true}
          data-drag-handle
          className="block h-auto w-full select-none rounded-md"
        />

        {selected && editable && (
          <>
            <div className={`${handle} -left-1.5 -top-1.5 cursor-nwse-resize`} onMouseDown={(e) => startResize(e, "tl")} />
            <div className={`${handle} -right-1.5 -top-1.5 cursor-nesw-resize`} onMouseDown={(e) => startResize(e, "tr")} />
            <div className={`${handle} -bottom-1.5 -left-1.5 cursor-nesw-resize`} onMouseDown={(e) => startResize(e, "bl")} />
            <div className={`${handle} -bottom-1.5 -right-1.5 cursor-nwse-resize`} onMouseDown={(e) => startResize(e, "br")} />
            <div className={`${handle} top-1/2 -left-1.5 -translate-y-1/2 cursor-ew-resize`} onMouseDown={(e) => startResize(e, "l")} />
            <div className={`${handle} top-1/2 -right-1.5 -translate-y-1/2 cursor-ew-resize`} onMouseDown={(e) => startResize(e, "r")} />

            <div
              contentEditable={false}
              className="absolute -top-10 left-1/2 z-20 flex -translate-x-1/2 items-center gap-0.5 rounded-md border border-border bg-popover p-1 shadow-md"
            >
              <span
                title="Arrastar imagem"
                data-drag-handle
                className="inline-flex h-7 w-7 cursor-grab items-center justify-center rounded text-foreground/60 hover:bg-muted active:cursor-grabbing"
              >
                <GripVertical className="h-3.5 w-3.5" />
              </span>
              <div className="mx-1 h-5 w-px bg-border" />
              {(
                [
                  { v: "left", Icon: AlignLeft, t: "Esquerda (texto envolve)" },
                  { v: "center", Icon: AlignCenter, t: "Centro" },
                  { v: "right", Icon: AlignRight, t: "Direita (texto envolve)" },
                ] as { v: Align; Icon: typeof AlignLeft; t: string }[]
              ).map(({ v, Icon, t }) => (
                <button
                  key={v}
                  type="button"
                  title={t}
                  onClick={() => updateAttributes({ align: v })}
                  className={`inline-flex h-7 w-7 items-center justify-center rounded text-foreground/70 hover:bg-muted ${
                    align === v ? "bg-accent text-accent-foreground" : ""
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </button>
              ))}
              <div className="mx-1 h-5 w-px bg-border" />
              <button
                type="button"
                title="Adicionar legenda"
                onClick={() => setEditingCaption(true)}
                className="inline-flex h-7 w-7 items-center justify-center rounded text-foreground/70 hover:bg-muted"
              >
                <Captions className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                title="Remover imagem"
                onClick={() => deleteNode()}
                className="inline-flex h-7 w-7 items-center justify-center rounded text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </>
        )}

        {(caption || editingCaption) && (
          <figcaption className="mt-2 text-center text-xs text-muted-foreground">
            {editable && editingCaption ? (
              <input
                autoFocus
                value={caption}
                placeholder="Legenda da imagem..."
                onChange={(e) => updateAttributes({ caption: e.target.value })}
                onBlur={() => setEditingCaption(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setEditingCaption(false);
                  }
                }}
                className="w-full bg-transparent text-center outline-none"
              />
            ) : (
              <span
                onClick={() => editable && setEditingCaption(true)}
                className={editable ? "cursor-text" : ""}
              >
                {caption}
              </span>
            )}
          </figcaption>
        )}
      </figure>
    </NodeViewWrapper>
  );
}

export const ResizableImage = Image.extend({
  name: "image",
  draggable: true,
  selectable: true,
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (el) => {
          const w = (el as HTMLElement).getAttribute("width");
          return w ? parseInt(w, 10) : null;
        },
        renderHTML: (attrs: { width?: number | null }) =>
          attrs.width ? { width: attrs.width } : {},
      },
      align: {
        default: "center",
        parseHTML: (el) => (el as HTMLElement).getAttribute("data-align") || "center",
        renderHTML: (attrs: { align?: string }) =>
          attrs.align ? { "data-align": attrs.align } : {},
      },
      caption: {
        default: "",
        parseHTML: (el) => (el as HTMLElement).getAttribute("data-caption") || "",
        renderHTML: (attrs: { caption?: string }) =>
          attrs.caption ? { "data-caption": attrs.caption } : {},
      },
    };
  },
  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(HTMLAttributes)];
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageView);
  },
});
