"use client";

import { Menu, Radio, ShoppingCart, Sparkles, Tag, Tv } from "lucide-react";
import { useMemo, useState } from "react";
import type { SaleItem } from "@/data/items";
import { segmentNames } from "@/data/items";
import { saleInfo } from "@/data/sale";
import { AskMom } from "./AskMom";
import { CartDrawer, type CartEntry } from "./CartDrawer";
import { CountdownTimer } from "./CountdownTimer";
import { DealOfHour } from "./DealOfHour";
import { ItemCard } from "./ItemCard";
import { SaleInfo } from "./SaleInfo";

type HomePageClientProps = {
  items: SaleItem[];
  saleDate: string;
};

const ticker =
  "Breaking: Decorative bowl still available * Mystery cables priced to move * Mom willing to negotiate within reason * ";

export function HomePageClient({ items, saleDate }: HomePageClientProps) {
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const deal = useMemo(
    () => items.find((item) => item.dealOfTheHour) ?? items[0],
    [items],
  );

  const cartCount = cart.reduce((sum, entry) => sum + entry.quantity, 0);

  function addToCart(item: SaleItem) {
    setCart((current) => {
      const existing = current.find((entry) => entry.item.id === item.id);
      if (existing) {
        return current.map((entry) =>
          entry.item.id === item.id
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry,
        );
      }

      return [...current, { item, quantity: 1 }];
    });
    setCartOpen(true);
  }

  function removeFromCart(itemId: string) {
    setCart((current) =>
      current.flatMap((entry) => {
        if (entry.item.id !== itemId) {
          return [entry];
        }

        if (entry.quantity <= 1) {
          return [];
        }

        return [{ ...entry, quantity: entry.quantity - 1 }];
      }),
    );
  }

  return (
    <main>
      <button
        type="button"
        onClick={() => setCartOpen(true)}
        className="fixed bottom-4 right-4 z-30 inline-flex items-center gap-2 rounded-full bg-broadcast-red px-5 py-4 text-sm font-black uppercase tracking-wide text-white shadow-promo transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-broadcast-gold"
      >
        <ShoppingCart aria-hidden="true" size={19} />
        Cart
        <span className="rounded-full bg-white px-2 py-0.5 text-broadcast-red">
          {cartCount}
        </span>
      </button>

      <section className="relative overflow-hidden bg-broadcast-blue text-white">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(90deg,rgba(255,255,255,.28)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:42px_42px]" />
        <nav
          aria-label="Primary"
          className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
        >
          <a href="#" className="inline-flex items-center gap-2 font-black">
            <Tv aria-hidden="true" className="text-broadcast-gold" />
            DDN
          </a>
          <div className="hidden items-center gap-2 text-sm font-black uppercase tracking-wide md:flex">
            <a className="rounded-md px-3 py-2 hover:bg-white/10" href="#watch">
              Watch
            </a>
            <a className="rounded-md px-3 py-2 hover:bg-white/10" href="#items">
              Items
            </a>
            <a
              className="rounded-md px-3 py-2 hover:bg-white/10"
              href="#sale-info"
            >
              Sale Info
            </a>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 px-3 py-2 text-xs font-black uppercase tracking-wide md:hidden">
            <Menu aria-hidden="true" size={16} />
            On Air
          </div>
        </nav>

        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 pb-10 pt-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-16">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-broadcast-red px-4 py-2 text-sm font-black uppercase tracking-wide text-white">
              <span className="h-2.5 w-2.5 animate-pulseLive rounded-full bg-white" />
              LIVE
            </div>
            <h1 className="font-display text-5xl font-black leading-none text-broadcast-gold sm:text-7xl lg:text-8xl">
              Driveway Deal Network
            </h1>
            <p className="mt-5 max-w-2xl text-xl font-bold leading-8 text-white sm:text-2xl">
              Live from the driveway: deals you didn&apos;t know you needed.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#watch"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-broadcast-gold px-5 py-4 text-sm font-black uppercase tracking-wide text-broadcast-ink transition hover:bg-yellow-300 focus:outline-none focus:ring-4 focus:ring-white"
              >
                <Radio aria-hidden="true" size={18} />
                Watch the Deals
              </a>
              <a
                href="#items"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-5 py-4 text-sm font-black uppercase tracking-wide text-broadcast-blue transition hover:bg-cyan-50 focus:outline-none focus:ring-4 focus:ring-white"
              >
                <Tag aria-hidden="true" size={18} />
                Browse Items
              </a>
              <a
                href="#sale-info"
                className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-white px-5 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white"
              >
                Sale Info
              </a>
            </div>
          </div>

          <div className="grid content-end gap-4">
            <CountdownTimer saleDate={saleDate} />
            <AskMom />
          </div>
        </div>

        <div className="relative overflow-hidden border-y-4 border-broadcast-ink bg-broadcast-gold py-3 text-broadcast-ink">
          <div className="flex w-[200%] animate-ticker whitespace-nowrap text-sm font-black uppercase tracking-wide">
            <span className="w-1/2 px-4">{ticker.repeat(3)}</span>
            <span className="w-1/2 px-4" aria-hidden="true">
              {ticker.repeat(3)}
            </span>
          </div>
        </div>
      </section>

      <DealOfHour item={deal} onAddToCart={addToCart} />

      <section id="items" className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wide text-broadcast-red">
              <Sparkles aria-hidden="true" size={18} />
              Featured segments
            </p>
            <h2 className="font-display text-4xl font-black text-broadcast-ink sm:text-5xl">
              Tonight&apos;s Driveway Programming
            </h2>
          </div>

          <div className="space-y-12">
            {segmentNames.map((segment) => {
              const segmentItems = items.filter((item) => item.segment === segment);

              return (
                <section key={segment} aria-labelledby={`segment-${segment}`}>
                  <div className="mb-4 flex flex-col gap-2 border-b-4 border-broadcast-ink pb-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-broadcast-teal">
                        Now presenting
                      </p>
                      <h3
                        id={`segment-${segment}`}
                        className="text-3xl font-black text-broadcast-ink"
                      >
                        {segment}
                      </h3>
                    </div>
                    <p className="text-sm font-bold text-neutral-700">
                      {segmentItems.length} dramatic opportunities remain
                    </p>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {segmentItems.map((item) => (
                      <ItemCard
                        key={item.id}
                        item={item}
                        onAddToCart={addToCart}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      <SaleInfo info={saleInfo} />

      <footer className="bg-broadcast-ink px-4 py-8 text-center text-white sm:px-6 lg:px-8">
        <p className="font-black">
          Thanks for watching Driveway Deal Network. Operators are standing by,
          probably.
        </p>
      </footer>

      <CartDrawer
        entries={cart}
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onAdd={addToCart}
        onRemove={removeFromCart}
      />
    </main>
  );
}
