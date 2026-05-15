import { useRef, useState } from "react";
import { Paperclip } from "lucide-react";
import { toast } from "sonner";
import type { Editor } from "@tiptap/react";
import { supabase } from "@/integrations/supabase/client";

const MAX_BYTES = 20 * 1024 * 1024; // 20 MB
const IMAGE_MIME = /^image\/(jpeg|png|gif|webp)$/;

export function UploadButton({
  editor,
  noteId,
  userId,
}: {
  editor: Editor | null;
  noteId: string;
  userId?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length || !editor || !userId) return;
    setBusy(true);
    try {
      for (const file of Array.from(files)) {
        if (file.size > MAX_BYTES) {
          toast.error(`${file.name}: arquivo maior que 20 MB`);
          continue;
        }
        const safeName = file.name.replace(/[^\w.\-]+/g, "_");
        const path = `${userId}/${noteId}/${crypto.randomUUID()}-${safeName}`;
        const { error } = await supabase.storage
          .from("note-attachments")
          .upload(path, file, { contentType: file.type, upsert: false });
        if (error) {
          toast.error(`Falha no upload: ${error.message}`);
          continue;
        }

        if (IMAGE_MIME.test(file.type)) {
          const { data } = await supabase.storage
            .from("note-attachments")
            .createSignedUrl(path, 60 * 60 * 24 * 7);
          const url = data?.signedUrl;
          if (url) {
            editor.chain().focus().setImage({ src: url, alt: file.name }).run();
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
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <button
        type="button"
        title="Anexar arquivo"
        disabled={busy}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-muted disabled:opacity-50"
      >
        <Paperclip className="h-4 w-4" />
      </button>
    </>
  );
}
