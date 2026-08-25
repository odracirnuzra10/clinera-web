"use client";

import { useState } from "react";

export function CopyButton({
  value,
  label = "Copiar",
  className = "",
}: {
  value: string;
  label?: string;
  className?: string;
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
      className={`rounded-lg border border-[#EAEAEA] bg-white px-4 py-2 text-[13px] font-medium text-[#111111] transition-colors duration-200 hover:bg-[#F7F6F3] ${className}`}
    >
      {copied ? "Copiado" : label}
    </button>
  );
}
