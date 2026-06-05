"use client";

import { MessageCircleQuestion } from "lucide-react";
import { useState } from "react";

const responses = [
  "Mom says: absolutely.",
  "Mom says: only if you pick it up today.",
  "Mom says: make an offer.",
  "Mom says: I forgot we had that.",
  "Mom says: ask your sister.",
];

export function AskMom() {
  const [response, setResponse] = useState("Mom is reviewing the evidence.");

  function askMom() {
    const next = responses[Math.floor(Math.random() * responses.length)];
    setResponse(next);
  }

  return (
    <section className="rounded-lg border-2 border-broadcast-teal bg-white p-5 shadow-promo">
      <div className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-broadcast-teal">
        <MessageCircleQuestion aria-hidden="true" size={19} />
        Ask Mom
      </div>
      <p className="mb-4 text-2xl font-black leading-tight text-broadcast-ink">
        Is this a good deal?
      </p>
      <button
        type="button"
        onClick={askMom}
        className="w-full rounded-md bg-broadcast-red px-4 py-3 text-sm font-black uppercase tracking-wide text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-broadcast-gold"
      >
        Ask Mom If This Is A Good Deal
      </button>
      <p
        aria-live="polite"
        className="mt-4 rounded-md bg-broadcast-cream p-3 text-base font-bold text-broadcast-ink"
      >
        {response}
      </p>
    </section>
  );
}
