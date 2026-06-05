"use client";

import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import type { SaleItem } from "@/data/items";
import { formatPrice } from "@/lib/format";

export type CartEntry = {
  item: SaleItem;
  quantity: number;
};

type CartDrawerProps = {
  entries: CartEntry[];
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: SaleItem) => void;
  onRemove: (itemId: string) => void;
};

export function CartDrawer({
  entries,
  isOpen,
  onClose,
  onAdd,
  onRemove,
}: CartDrawerProps) {
  const total = entries.reduce(
    (sum, entry) => sum + entry.item.price * entry.quantity,
    0,
  );
  const count = entries.reduce((sum, entry) => sum + entry.quantity, 0);

  return (
    <>
      <button
        type="button"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-broadcast-ink/50 transition ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-label="Close imaginary cart"
      />
      <aside
        className={`fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-md transform flex-col bg-white shadow-2xl transition duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Your Imaginary Cart"
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b-2 border-broadcast-ink bg-broadcast-blue px-5 py-4 text-white">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-broadcast-gold">
              {count} pretend treasures
            </p>
            <h2 className="text-2xl font-black">Your Imaginary Cart</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 transition hover:bg-white/15 focus:outline-none focus:ring-4 focus:ring-broadcast-gold"
            aria-label="Close cart"
          >
            <X aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {entries.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-neutral-300 p-6 text-center">
              <ShoppingBag
                aria-hidden="true"
                className="mx-auto mb-3 text-broadcast-teal"
                size={42}
              />
              <p className="font-black text-broadcast-ink">
                Your cart is empty, but your self-control is intact.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div
                  key={entry.item.id}
                  className="rounded-lg border-2 border-broadcast-ink bg-broadcast-cream p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-black text-broadcast-ink">
                        {entry.item.name}
                      </h3>
                      <p className="text-sm font-bold text-broadcast-blue">
                        {formatPrice(entry.item.price)} each
                      </p>
                    </div>
                    <p className="font-black text-broadcast-red">
                      {formatPrice(entry.item.price * entry.quantity)}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onRemove(entry.item.id)}
                      className="rounded-full border-2 border-broadcast-ink p-2 transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-broadcast-gold"
                      aria-label={`Remove one ${entry.item.name}`}
                    >
                      <Minus aria-hidden="true" size={16} />
                    </button>
                    <span className="min-w-8 text-center font-black">
                      {entry.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onAdd(entry.item)}
                      className="rounded-full border-2 border-broadcast-ink p-2 transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-broadcast-gold"
                      aria-label={`Add one more ${entry.item.name}`}
                    >
                      <Plus aria-hidden="true" size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border-t-2 border-broadcast-ink bg-broadcast-cream p-5">
          <p className="mb-3 text-sm font-bold text-neutral-700">
            This does not reserve anything. It only proves you have excellent
            taste.
          </p>
          <div className="flex items-center justify-between rounded-md bg-broadcast-ink px-4 py-3 text-white">
            <span className="text-sm font-black uppercase tracking-wide">
              Pretend total
            </span>
            <span className="text-2xl font-black">{formatPrice(total)}</span>
          </div>
        </div>
      </aside>
    </>
  );
}
