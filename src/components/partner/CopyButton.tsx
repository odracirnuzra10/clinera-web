"use client";

import { useState } from "react";

export function CopyButton({
  value,
  label = "Copiar",
  ghost = false,
}: {
  value: string;
  label?: string;
  ghost?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const input = document.createElement("textarea");
      input.value = value;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.left = "-9999px";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={() => void copy()}
      className={ghost ? "partner-btn partner-btn-ghost" : "partner-btn"}
    >
      {copied ? "Copiado" : label}
    </button>
  );
}
