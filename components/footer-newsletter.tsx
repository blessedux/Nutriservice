"use client";

import { FormEvent, useState } from "react";

export default function FooterNewsletter() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-2 rounded-lg border border-white/10 bg-white/[0.05] p-1 sm:flex-row sm:items-stretch"
    >
      <label htmlFor="footer-newsletter-email" className="sr-only">
        Correo para newsletter técnico
      </label>
      <input
        id="footer-newsletter-email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="Email Address"
        disabled={sent}
        className="min-h-[42px] flex-1 rounded-md bg-transparent px-4 py-2 text-xs text-white placeholder:text-neutral-400 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40 disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={sent}
        className="shrink-0 rounded-md bg-[#06b6d4] px-4 py-2 text-[10px] font-bold uppercase tracking-wide text-[#0a192f] transition-colors hover:bg-cyan-400 disabled:opacity-70"
      >
        {sent ? "Enviado" : "Join"}
      </button>
    </form>
  );
}
