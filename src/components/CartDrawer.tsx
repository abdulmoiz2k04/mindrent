"use client";

import Link from "next/link";
import { useState } from "react";
import { PREMIUM_BOX_PRICE, useCart } from "@/context/CartContext";
import { kitCategoryLabels } from "@/lib/shop-products";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    items,
    itemCount,
    total,
    premiumBoxSelected,
    togglePremiumBox,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();
  const hasCartContent = items.length > 0 || premiumBoxSelected;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-40 rounded-[1.6rem] border border-brand-purple/15 bg-white/80 px-5 py-4 text-left text-brand-purple shadow-[0_20px_54px_rgba(49,34,79,0.22)] backdrop-blur-2xl transition hover:-translate-y-1"
        aria-label="open cart"
      >
        <p className="text-[0.68rem] font-black lowercase tracking-[0.2em] opacity-70">
          box
        </p>
        <div className="mt-1 flex items-end gap-3">
          <span className="text-3xl font-black leading-none">{itemCount}</span>
          <span className="pb-1 text-xs font-black lowercase opacity-70">
            {formatPrice(total)}
          </span>
        </div>
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="close cart overlay"
            className="absolute inset-0 bg-brand-purple/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <aside className="glass absolute bottom-0 right-0 top-auto flex max-h-[92vh] w-full flex-col rounded-t-[2rem] p-5 text-brand-purple shadow-[0_24px_90px_rgba(49,34,79,0.24)] sm:bottom-4 sm:right-4 sm:top-4 sm:max-h-none sm:max-w-md sm:rounded-[2.4rem]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black lowercase tracking-[0.2em] opacity-70">
                  your box
                </p>
                <h2 className="mt-2 text-3xl font-black lowercase leading-none">
                  cart
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full border border-brand-purple/15 bg-white/45 font-black transition hover:bg-brand-purple hover:text-brand-lavender-light"
                aria-label="close cart"
              >
                x
              </button>
            </div>

            <div className="mt-5 flex-1 space-y-3 overflow-y-auto pr-1">
              <label className="flex cursor-pointer items-start gap-3 rounded-[1.6rem] border border-brand-purple/15 bg-brand-lavender-light/70 p-4">
                <input
                  type="checkbox"
                  checked={premiumBoxSelected}
                  onChange={togglePremiumBox}
                  className="mt-1 h-5 w-5 accent-brand-purple"
                />
                <span className="flex-1">
                  <span className="block font-black lowercase">
                    premium mindrent box
                  </span>
                  <span className="mt-1 block text-sm font-semibold lowercase leading-5 opacity-75">
                    sturdier keepsake packaging for gifting or storing your
                    reset tools.
                  </span>
                </span>
                <span className="text-sm font-black">
                  {formatPrice(PREMIUM_BOX_PRICE)}
                </span>
              </label>

              {items.length === 0 ? (
                <div className="rounded-[1.8rem] border border-brand-purple/15 bg-white/45 p-5 text-sm font-semibold lowercase leading-6 opacity-75">
                  your box is empty. add something soft from the shop.
                </div>
              ) : (
                items.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-[1.6rem] border border-brand-purple/15 bg-white/45 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-black lowercase">{item.name}</p>
                        <p className="mt-1 text-sm font-semibold lowercase leading-5 opacity-70">
                          {kitCategoryLabels[item.category]} /{" "}
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="grid h-8 w-8 place-items-center rounded-full border border-brand-purple/15 bg-white/45 text-sm font-black transition hover:bg-brand-purple hover:text-brand-lavender-light"
                        aria-label={`remove ${item.name}`}
                      >
                        x
                      </button>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 rounded-full border border-brand-purple/15 bg-brand-lavender-light/70 p-1">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="grid h-8 w-8 place-items-center rounded-full bg-white/70 font-black"
                          aria-label={`decrease ${item.name}`}
                        >
                          -
                        </button>
                        <span className="min-w-8 text-center text-sm font-black">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="grid h-8 w-8 place-items-center rounded-full bg-white/70 font-black"
                          aria-label={`increase ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm font-black">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </article>
                ))
              )}
            </div>

            <div className="mt-5 rounded-[1.8rem] bg-brand-purple p-5 text-brand-lavender-light">
              <div className="flex items-center justify-between gap-3">
                <span className="font-black lowercase">total</span>
                <span className="text-xl font-black">{formatPrice(total)}</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={clearCart}
                  disabled={!hasCartContent}
                  className="rounded-full border border-brand-lavender-light/40 px-4 py-3 text-sm font-black lowercase disabled:opacity-40"
                >
                  clear
                </button>
                <Link
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full bg-brand-lavender-light px-4 py-3 text-center text-sm font-black lowercase text-brand-purple"
                >
                  checkout
                </Link>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
