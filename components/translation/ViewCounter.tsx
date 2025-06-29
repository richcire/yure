"use client";

import { useEffect, useRef } from "react";

export default function ViewCounter({ permalink }: { permalink: string }) {
  const hasIncremented = useRef(false);

  useEffect(() => {
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

    fetch("/api/increment-views", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ permalink }),
    }).catch((error) => {
      // Reset on error so it can be retried
      hasIncremented.current = false;
      console.error("Failed to increment view:", error);
    });
  }, [permalink]);

  return null;
}
