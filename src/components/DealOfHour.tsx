"use client";

import { BadgeDollarSign, ShoppingCart, Sparkles } from "lucide-react";
import type { SaleItem } from "@/data/items";
import { formatPrice, savingsText } from "@/lib/format";
import { ItemVisual } from "./ItemVisual";

type DealOfHourProps = {
  item: SaleItem;
  onAddToCart: (item: SaleItem) => void;
};

export function DealOfHour({ item, onAddToCart }: DealOfHourProps) {
  return (
    <section
      id="watch"
      className="bg-broadcast-ink px-4 py-12 text-white sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-broadcast-red px-4 py-2 text-sm font-black uppercase tracking-wide text-white">
            <Sparkles aria-hidden="true" size={18} />
            Deal of the Hour
          </div>
          <h2 className="font-display text-4xl font-black leading-none text-broadcast-gold sm:text-6xl">
            {item.name}
          </h2>
          <p className="mt-4 max-w-2xl text-xl font-bold leading-8 text-white/90">
            {item.pitch}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-white p-4 text-broadcast-ink">
              <p className="text-xs font-black uppercase tracking-wide text-neutral-500">
                Category
              </p>
              <p className="text-lg font-black">{item.category}</p>
            </div>
            <div className="rounded-lg bg-white p-4 text-broadcast-ink">
              <p className="text-xs font-black uppercase tracking-wide text-neutral-500">
                Original fake price
              </p>
              <p className="text-lg font-black line-through">
                {formatPrice(item.fakeOriginalPrice)}
              </p>
            </div>
            <div className="rounded-lg bg-broadcast-gold p-4 text-broadcast-ink">
              <p className="text-xs font-black uppercase tracking-wide">
                Garage sale price
              </p>
              <p className="text-3xl font-black">{formatPrice(item.price)}</p>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <div className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-black uppercase text-broadcast-red">
              <BadgeDollarSign aria-hidden="true" size={20} />
              {savingsText(item.price, item.fakeOriginalPrice)}
            </div>
            <button
              type="button"
              onClick={() => onAddToCart(item)}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-broadcast-teal px-5 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-broadcast-gold"
            >
              <ShoppingCart aria-hidden="true" size={18} />
              Add to Imaginary Cart
            </button>
          </div>
        </div>
        <ItemVisual item={item} large />
      </div>
    </section>
  );
}
