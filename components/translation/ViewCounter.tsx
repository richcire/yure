"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";

export default function ViewCounter({ permalink }: { permalink: string }) {
  const hasIncremented = useRef(false);

  useEffect(() => {
    const incrementView = async () => {
      // Prevent multiple increments for the same permalink in the same session
      if (hasIncremented.current) return;

      // Also check if we've recently incremented this permalink (session storage)
      const incrementKey = `view_incremented_${permalink}`;
      const lastIncrement = sessionStorage.getItem(incrementKey);
      const now = Date.now();

      // Only increment if it hasn't been incremented in the last 30 seconds
      if (lastIncrement && now - parseInt(lastIncrement) < 30000) {
        return;
      }

      hasIncremented.current = true;
      sessionStorage.setItem(incrementKey, now.toString());

      // Call Supabase RPC directly using browser client
      const supabase = createClient();
      const { error } = await supabase.rpc("increment_translation_views", {
        _permalink: decodeURIComponent(permalink),
      });

      if (error) {
        // Reset on error so it can be retried
        hasIncremented.current = false;
        console.error("Failed to increment view:", error);
      }
    };

    incrementView().catch(console.error);
  }, [permalink]);

  return null;
}
