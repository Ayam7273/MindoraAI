import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function useAvatarUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (userId: string, file: File): Promise<string | null> => {
    setUploading(true);
    setError(null);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${userId}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      // Bust cache with a timestamp so the browser re-fetches the new image
      return `${data.publicUrl}?t=${Date.now()}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading, error };
}
