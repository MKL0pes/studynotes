import { useRef, useState } from "react";
import { FileUp, Image as ImageIcon, Paperclip } from "lucide-react";
import { toast } from "sonner";
import type { Editor } from "@tiptap/react";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MAX_BYTES = 50 * 1024 * 1024; // 50 MB

const DOC_EXT = /\.(pdf|docx?|xlsx?|pptx?|txt|csv|rtf|odt|ods|odp)$/i;

function folderFor(file: File): "images" | "documents" | "others" {
  if (file.type.startsWith("image/")) return "images";
  if (file.type.startsWith("application/pdf") || DOC_EXT.test(file.name)) return "documents";
  return "others";
}

export function UploadButton({
  editor,
  noteId,
  userId,
  onAfterInsert,
}: {
  editor: Editor | null;
  noteId: string;
  userId?: string;
  onAfterInsert?: () => void;
}) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleFiles = async (files: FileList | null, mode: "image" | "file") => {
    if (!files?.length || !editor || !userId) return;
    setBusy(true);
    try {
      for (const file of Array.from(files)) {
        if (file.size > MAX_BYTES) {
          toast.error(`${file.name}: arquivo maior que 50 MB`);
          continue;
        }
        const folder = mode === "image" ? "images" : folderFor(file);
        const safeName = file.name.replace(/[^\w.\-]+/g, "_");
        const path = `${userId}/${folder}/${noteId}/${crypto.randomUUID()}-${safeName}`;
        const { error } = await supabase.storage
          .from("note-attachments")
          .upload(path, file, { contentType: file.type, upsert: false });
        if (error) {
          toast.error(`Falha no upload: ${error.message}`);
          continue;
        }

        if (mode === "image" && file.type.startsWith("image/")) {
          const { data } = await supabase.storage
            .from("note-attachments")
            .createSignedUrl(path, 60 * 60 * 24 * 7);
          const url = data?.signedUrl;
          if (url) {
            (editor.chain().focus() as any)
              .setImage({ src: url, alt: file.name })
              .run();
          }
        } else {
          editor
            .chain()
            .focus()
            .insertContent({
              type: "fileAttachment",
              attrs: {
                path,
                name: file.name,
                size: file.size,
                mime: file.type,
              },
            })
            .run();
        }
      }
      toast.success("Arquivo(s) enviado(s)");
      onAfterInsert?.();
    } finally {
      setBusy(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        ref={imageInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files, "image")}
      />
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files, "file")}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            title="Inserir imagem ou arquivo"
            disabled={busy}
            onMouseDown={(e) => e.preventDefault()}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-muted disabled:opacity-50"
          >
            <Paperclip className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-52">
          <DropdownMenuItem onClick={() => imageInputRef.current?.click()}>
            <ImageIcon className="mr-2 h-4 w-4" />
            Imagem
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
            <FileUp className="mr-2 h-4 w-4" />
            Arquivo para download
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
