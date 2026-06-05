"use client";

import { BadgeDollarSign, PackageOpen, Sparkles } from "lucide-react";
import { useState } from "react";
import type { SaleItem } from "@/data/items";

type ItemVisualProps = {
  item: SaleItem;
  large?: boolean;
};

const colorByCategory: Record<string, string> = {
  "Decor With A Past": "from-broadcast-gold via-orange-200 to-white",
  "Things We Swear Are Useful": "from-broadcast-teal via-cyan-100 to-white",
  "Mom's Picks": "from-rose-300 via-yellow-100 to-white",
  "Sister's Picks": "from-sky-300 via-lime-100 to-white",
  "Manager Specials": "from-broadcast-blue via-indigo-100 to-white",
  "The Final Few": "from-broadcast-red via-pink-100 to-white",
};

export function ItemVisual({ item, large = false }: ItemVisualProps) {
  const [failed, setFailed] = useState(false);
  const canShowImage = item.image && !failed;
  const iconSize = large ? 58 : 42;

  if (canShowImage) {
    return (
      <div
        className={`relative overflow-hidden rounded-md border-2 border-broadcast-ink bg-white ${
          large ? "min-h-80" : "min-h-48"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.name}
          className="h-full min-h-[inherit] w-full object-cover"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative flex overflow-hidden rounded-md border-2 border-broadcast-ink bg-gradient-to-br ${
        colorByCategory[item.category] ?? "from-broadcast-gold via-white to-cyan-100"
      } ${large ? "min-h-80" : "min-h-48"}`}
      aria-label={`${item.name} placeholder image`}
      role="img"
    >
      <div className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-black uppercase text-broadcast-ink shadow">
        Studio Cam
      </div>
      <div className="absolute right-3 top-3 rotate-3 rounded-md bg-broadcast-red px-3 py-2 text-sm font-black text-white shadow">
        {item.badge}
      </div>
      <div className="m-auto flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-broadcast-ink text-broadcast-gold shadow-promo">
        {item.hot ? (
          <Sparkles aria-hidden="true" size={iconSize} />
        ) : item.price <= 5 ? (
          <BadgeDollarSign aria-hidden="true" size={iconSize} />
        ) : (
          <PackageOpen aria-hidden="true" size={iconSize} />
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-broadcast-ink/90 px-3 py-2 text-center text-xs font-black uppercase tracking-wide text-white">
        Professional driveway product photography pending
      </div>
    </div>
  );
}
