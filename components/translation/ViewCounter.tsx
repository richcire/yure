"use client";

import { useEffect } from "react";

export default function ViewCounter({ permalink }: { permalink: string }) {
  useEffect(() => {
    fetch("/api/increment-views", {
      method: "POST",
      body: JSON.stringify({ permalink }),
    });
  }, [permalink]);

  return null;
}
