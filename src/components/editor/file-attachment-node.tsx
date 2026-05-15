import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { Download, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const u = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${u[i]}`;
}

function FileAttachmentView({ node }: NodeViewProps) {
  const { path, name, size, mime } = node.attrs as {
    path: string;
    name: string;
    size: number;
    mime: string;
  };
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!path) return;
      const { data } = await supabase.storage
        .from("note-attachments")
        .createSignedUrl(path, 3600);
      if (!cancelled && data?.signedUrl) setUrl(data.signedUrl);
    })();
    return () => {
      cancelled = true;
    };
  }, [path]);

  return (
    <NodeViewWrapper className="my-3">
      <div
        contentEditable={false}
        className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
          <FileText className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-foreground">{name}</div>
          <div className="text-xs text-muted-foreground">
            {mime || "arquivo"} · {formatBytes(size)}
          </div>
        </div>
        <a
          href={url || "#"}
          target="_blank"
          rel="noreferrer"
          download={name}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-input bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-accent"
        >
          <Download className="h-3.5 w-3.5" />
          Baixar
        </a>
      </div>
    </NodeViewWrapper>
  );
}

export const FileAttachment = Node.create({
  name: "fileAttachment",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,
  addAttributes() {
    return {
      path: { default: "" },
      name: { default: "arquivo" },
      size: { default: 0 },
      mime: { default: "" },
    };
  },
  parseHTML() {
    return [{ tag: "div[data-file-attachment]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-file-attachment": "true" })];
  },
  addNodeView() {
    return ReactNodeViewRenderer(FileAttachmentView);
  },
});
