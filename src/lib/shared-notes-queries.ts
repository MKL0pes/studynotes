import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Note } from "./db-types";

export type SharedNote = {
  id: string;
  note_id: string;
  owner_id: string;
  shared_with_email: string;
  permission: "view" | "edit";
  accepted: boolean;
  created_at: string;
};

const sb = () => supabase as any;

export const useSharesForNote = (noteId?: string) =>
  useQuery({
    queryKey: ["shares", noteId],
    enabled: !!noteId,
    queryFn: async () => {
      const { data, error } = await sb()
        .from("shared_notes")
        .select("*")
        .eq("note_id", noteId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as SharedNote[];
    },
  });

export const useIncomingShares = (email?: string) =>
  useQuery({
    queryKey: ["shares", "incoming", email],
    enabled: !!email,
    queryFn: async () => {
      const { data, error } = await sb()
        .from("shared_notes")
        .select("*")
        .ilike("shared_with_email", email!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as SharedNote[];
    },
  });

export const useSharedNotes = (email?: string) =>
  useQuery({
    queryKey: ["shared-notes", email],
    enabled: !!email,
    queryFn: async () => {
      const { data: shares, error } = await sb()
        .from("shared_notes")
        .select("note_id,permission,accepted")
        .ilike("shared_with_email", email!);
      if (error) throw error;
      const ids = (shares || []).map((s: any) => s.note_id);
      if (!ids.length) return [] as Array<Note & { _permission: "view" | "edit"; _accepted: boolean }>;
      const { data: notes, error: nErr } = await sb()
        .from("notes")
        .select("*")
        .in("id", ids);
      if (nErr) throw nErr;
      const byId = new Map((shares || []).map((s: any) => [s.note_id, s]));
      return (notes as Note[]).map((n) => ({
        ...n,
        _permission: byId.get(n.id)?.permission as "view" | "edit",
        _accepted: !!byId.get(n.id)?.accepted,
      }));
    },
  });

export const useCreateShare = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      note_id: string;
      shared_with_email: string;
      permission: "view" | "edit";
    }) => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Não autenticado");
      const email = input.shared_with_email.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("E-mail inválido");
      const { data, error } = await sb()
        .from("shared_notes")
        .upsert(
          {
            note_id: input.note_id,
            owner_id: u.user.id,
            shared_with_email: email,
            permission: input.permission,
          },
          { onConflict: "note_id,shared_with_email" },
        )
        .select()
        .single();
      if (error) throw error;
      return data as SharedNote;
    },
    onSuccess: (s) => qc.invalidateQueries({ queryKey: ["shares", s.note_id] }),
  });
};

export const useDeleteShare = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (share: { id: string; note_id: string }) => {
      const { error } = await sb().from("shared_notes").delete().eq("id", share.id);
      if (error) throw error;
      return share;
    },
    onSuccess: (s) => qc.invalidateQueries({ queryKey: ["shares", s.note_id] }),
  });
};

export const useAcceptShare = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await sb().from("shared_notes").update({ accepted: true }).eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["shares", "incoming"] }),
  });
};
