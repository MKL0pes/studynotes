import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Note, Notebook } from "./db-types";

export const useNotebooks = () =>
  useQuery({
    queryKey: ["notebooks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notebooks")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as Notebook[];
    },
  });

export const useNotes = (notebookId?: string) =>
  useQuery({
    queryKey: ["notes", notebookId ?? "all"],
    queryFn: async () => {
      let q = supabase.from("notes").select("*").order("updated_at", { ascending: false });
      if (notebookId) q = q.eq("notebook_id", notebookId);
      const { data, error } = await q;
      if (error) throw error;
      return data as Note[];
    },
  });

export const useNote = (id: string) =>
  useQuery({
    queryKey: ["note", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("notes").select("*").eq("id", id).single();
      if (error) throw error;
      return data as Note;
    },
    enabled: !!id,
  });

export const useCreateNotebook = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, color, icon_name }: { name: string; color?: string; icon_name?: string }) => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Não autenticado");
      const insert: { name: string; user_id: string; color?: string; icon_name?: string } = {
        name,
        user_id: u.user.id,
      };
      if (color) insert.color = color;
      if (icon_name) insert.icon_name = icon_name;
      const { data, error } = await supabase
        .from("notebooks")
        .insert(insert)
        .select()
        .single();
      if (error) throw error;
      return data as Notebook;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notebooks"] }),
  });
};

export const useDeleteNotebook = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error: notesErr } = await supabase.from("notes").delete().eq("notebook_id", id);
      if (notesErr) throw notesErr;
      const { error } = await supabase.from("notebooks").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notebooks"] });
      qc.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};

export const useCreateNote = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (notebookId: string) => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Não autenticado");
      const { data, error } = await supabase
        .from("notes")
        .insert({ notebook_id: notebookId, user_id: u.user.id, title: "Nova nota", content: "" })
        .select()
        .single();
      if (error) throw error;
      return data as Note;
    },
    onSuccess: (_n, notebookId) => {
      qc.invalidateQueries({ queryKey: ["notes", notebookId] });
      qc.invalidateQueries({ queryKey: ["notes", "all"] });
    },
  });
};

export const useUpdateNote = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...patch }: Partial<Note> & { id: string }) => {
      const { data, error } = await supabase
        .from("notes")
        .update(patch)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as Note;
    },
    onSuccess: (note) => {
      qc.invalidateQueries({ queryKey: ["note", note.id] });
      qc.invalidateQueries({ queryKey: ["notes", note.notebook_id] });
      qc.invalidateQueries({ queryKey: ["notes", "all"] });
    },
  });
};

export const useDeleteNote = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("notes").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};
