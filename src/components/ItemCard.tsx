"use client";

import { Heart, ShoppingCart, Tag } from "lucide-react";
import type { SaleItem } from "@/data/items";
import { formatPrice } from "@/lib/format";
import { ItemVisual } from "./ItemVisual";

type ItemCardProps = {
  item: SaleItem;
  onAddToCart: (item: SaleItem) => void;
};

export function ItemCard({ item, onAddToCart }: ItemCardProps) {
  return (
    <article className="flex h-full flex-col rounded-lg border-2 border-broadcast-ink bg-white shadow-promo">
      <ItemVisual item={item} />
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-broadcast-gold px-3 py-1 text-xs font-black uppercase text-broadcast-ink">
            {item.badge}
          </span>
          <span className="rounded-full bg-broadcast-ink px-3 py-1 text-xs font-black uppercase text-white">
            {item.hot ? "Hot Item" : "Still Available"}
          </span>
        </div>
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="text-xl font-black leading-tight text-broadcast-ink">
            {item.name}
          </h3>
          <div className="shrink-0 rounded-md bg-broadcast-red px-3 py-2 text-lg font-black text-white">
            {formatPrice(item.price)}
          </div>
        </div>
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold uppercase tracking-wide text-broadcast-blue">
          <span className="inline-flex items-center gap-1">
            <Tag aria-hidden="true" size={14} />
            {item.category}
          </span>
          <span>{item.status}</span>
          <span>{item.condition}</span>
        </div>
        <p className="mb-4 flex-1 text-sm leading-6 text-neutral-700">{item.pitch}</p>
        <div className="mb-4 rounded-md bg-broadcast-cream p-3 text-sm">
          <span className="font-bold text-neutral-500 line-through">
            {formatPrice(item.fakeOriginalPrice)}
          </span>
          <span className="ml-2 font-black text-broadcast-red">
            now {formatPrice(item.price)}
          </span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-broadcast-ink bg-white px-3 py-3 text-xs font-black uppercase tracking-wide text-broadcast-ink transition hover:bg-broadcast-gold focus:outline-none focus:ring-4 focus:ring-broadcast-gold"
          >
            <Heart aria-hidden="true" size={16} />
            I&apos;m Emotionally Interested
          </button>
          <button
            type="button"
            onClick={() => onAddToCart(item)}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-broadcast-teal px-3 py-3 text-xs font-black uppercase tracking-wide text-white transition hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-broadcast-gold"
          >
            <ShoppingCart aria-hidden="true" size={16} />
            Add to Imaginary Cart
          </button>
        </div>
      </div>
    </article>
  );
}
