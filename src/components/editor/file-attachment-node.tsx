import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import {
  Download,
  File as FileIcon,
  FileArchive,
  FileAudio,
  FileCode,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const u = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${u[i]}`;
}

function iconFor(name: string, mime: string) {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  if (mime.startsWith("image/")) return FileImage;
  if (mime.startsWith("video/") || /^(mp4|mov|avi|mkv|webm)$/.test(ext)) return FileVideo;
  if (mime.startsWith("audio/") || /^(mp3|wav|ogg|m4a|flac)$/.test(ext)) return FileAudio;
  if (/^(zip|rar|7z|tar|gz)$/.test(ext)) return FileArchive;
  if (/^(xlsx?|csv|ods|numbers)$/.test(ext)) return FileSpreadsheet;
  if (/^(pdf|docx?|txt|rtf|odt|md)$/.test(ext) || mime === "application/pdf") return FileText;
  if (/^(js|ts|tsx|jsx|json|html|css|py|java|c|cpp|rb|go|rs|sql|sh)$/.test(ext)) return FileCode;
  return FileIcon;
}

function colorFor(name: string, mime: string) {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  if (mime.startsWith("image/")) return "text-emerald-500 bg-emerald-500/10";
  if (mime.startsWith("video/") || /^(mp4|mov|avi|mkv|webm)$/.test(ext)) return "text-violet-500 bg-violet-500/10";
  if (mime.startsWith("audio/") || /^(mp3|wav|ogg|m4a|flac)$/.test(ext)) return "text-amber-500 bg-amber-500/10";
  if (/^(zip|rar|7z|tar|gz)$/.test(ext)) return "text-orange-500 bg-orange-500/10";
  if (/^(xlsx?|csv|ods)$/.test(ext)) return "text-green-600 bg-green-500/10";
  if (ext === "pdf" || mime === "application/pdf") return "text-red-500 bg-red-500/10";
  if (/^(docx?|txt|rtf|odt|md)$/.test(ext)) return "text-blue-500 bg-blue-500/10";
  if (/^(js|ts|tsx|jsx|json|html|css|py|java|c|cpp|rb|go|rs|sql|sh)$/.test(ext))
    return "text-cyan-500 bg-cyan-500/10";
  return "text-foreground/70 bg-muted";
}

function FileAttachmentView({ node, deleteNode, editor }: NodeViewProps) {
  const editable = editor.isEditable;
  const { path, name, size, mime } = node.attrs as {
    path: string;
    name: string;
    size: number;
    mime: string;
  };
  const [downloading, setDownloading] = useState(false);
  const Icon = iconFor(name, mime);
  const color = colorFor(name, mime);

  const handleDownload = async () => {
    if (!path) return;
    setDownloading(true);
    try {
      const { data, error } = await supabase.storage
        .from("note-attachments")
        .createSignedUrl(path, 3600, { download: name });
      if (error || !data?.signedUrl) throw error;
      window.open(data.signedUrl, "_blank", "noopener");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <NodeViewWrapper className="my-3">
      <div
        contentEditable={false}
        className="group flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3 transition hover:bg-muted/50"
      >
        <div className={`flex h-10 w-10 items-center justify-center rounded-md ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-foreground">{name}</div>
          <div className="text-xs text-muted-foreground">
            {(mime || "arquivo").split("/").pop()} · {formatBytes(size)}
          </div>
        </div>
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-input bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-50"
        >
          <Download className="h-3.5 w-3.5" />
          Baixar
        </button>
        {editable && (
          <button
            type="button"
            onClick={() => deleteNode()}
            title="Remover anexo"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </button>
        )}
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
