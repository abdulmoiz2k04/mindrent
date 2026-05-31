"use client";

import Image from "next/image";
import Link from "next/link";
import { AppFooter } from "@/components/AppFooter";
import { TimeGreeting } from "@/components/TimeGreeting";
import { PREMIUM_BOX_PRICE, useCart } from "@/context/CartContext";
import { kitCategoryLabels } from "@/lib/shop-products";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function CartPage() {
  const {
    items,
    subtotal,
    total,
    premiumBoxSelected,
    togglePremiumBox,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();
  const hasCartContent = items.length > 0 || premiumBoxSelected;

  return (
    <main className="relative min-h-screen overflow-hidden bg-brand-lavender px-4 py-5 text-brand-purple sm:px-8 sm:py-6 lg:px-12">
      <div aria-hidden="true" className="ambient-background">
        <span className="ambient-blob ambient-blob-one" />
        <span className="ambient-blob ambient-blob-two" />
        <span className="ambient-particle ambient-particle-three" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-7">
        <nav className="glass flex flex-wrap items-center justify-between gap-3 rounded-[1.6rem] px-4 py-3 sm:rounded-[2rem] sm:px-5">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <Image
              src="/mindrent-logo.jpeg"
              alt="mindrent logo"
              width={44}
              height={44}
              priority
              className="rounded-full border border-brand-purple/15"
            />
            <div className="flex flex-col">
              <span className="text-xl font-black lowercase tracking-wide">
                mindrent
              </span>
              <TimeGreeting />
            </div>
          </Link>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Link
              href="/shop"
              className="rounded-full border border-brand-purple/15 bg-white/35 px-4 py-2 text-sm font-black lowercase transition hover:bg-brand-purple hover:text-brand-lavender-light"
            >
              shop
            </Link>
            <Link
              href="/quiz"
              className="rounded-full border border-brand-purple/15 bg-white/35 px-4 py-2 text-sm font-black lowercase transition hover:bg-brand-purple hover:text-brand-lavender-light"
            >
              quiz
            </Link>
          </div>
        </nav>

        <div className="grid flex-1 items-start gap-5 py-4 lg:grid-cols-[1fr_0.42fr]">
          <section className="glass rounded-[2.4rem] p-5 sm:p-8 lg:rounded-[3.4rem]">
            <p className="text-sm font-black lowercase tracking-[0.22em] opacity-70">
              your mindrent box
            </p>
            <h1 className="mt-4 text-4xl font-black lowercase leading-[0.92] sm:text-6xl">
              cart
            </h1>

            <div className="mt-7 space-y-4">
              <label className="flex cursor-pointer flex-col gap-3 rounded-[2rem] border border-brand-purple/15 bg-brand-lavender-light/70 p-5 sm:flex-row sm:items-start sm:justify-between">
                <span className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={premiumBoxSelected}
                    onChange={togglePremiumBox}
                    className="mt-1 h-5 w-5 accent-brand-purple"
                  />
                  <span>
                    <span className="block text-xl font-black lowercase leading-none">
                      premium mindrent box
                    </span>
                    <span className="mt-2 block text-sm font-semibold lowercase leading-6 opacity-75">
                      add a sturdier keepsake box for gifting, storage, and a
                      more premium unboxing experience.
                    </span>
                  </span>
                </span>
                <span className="font-black">{formatPrice(PREMIUM_BOX_PRICE)}</span>
              </label>

              {items.length === 0 ? (
                <div className="rounded-[2rem] border border-brand-purple/15 bg-white/45 p-6 font-semibold lowercase leading-7">
                  your cart is empty. the shop has calm, focus, and self-care
                  pieces waiting.
                </div>
              ) : (
                items.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-[2rem] border border-brand-purple/15 bg-white/50 p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <span className="rounded-full border border-brand-purple/15 px-3 py-1 text-[0.66rem] font-black lowercase tracking-[0.16em] opacity-70">
                          {kitCategoryLabels[item.category]}
                        </span>
                        <h2 className="mt-3 text-2xl font-black lowercase leading-none">
                          {item.name}
                        </h2>
                        <p className="mt-2 text-sm font-semibold lowercase leading-6 opacity-75">
                          {item.description}
                        </p>
                      </div>
                      <p className="text-lg font-black">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 rounded-full border border-brand-purple/15 bg-brand-lavender-light/70 p-1">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="grid h-9 w-9 place-items-center rounded-full bg-white/75 font-black"
                        >
                          -
                        </button>
                        <span className="min-w-9 text-center font-black">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="grid h-9 w-9 place-items-center rounded-full bg-white/75 font-black"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="rounded-full border border-brand-purple/15 bg-white/45 px-4 py-2 text-sm font-black lowercase transition hover:bg-brand-purple hover:text-brand-lavender-light"
                      >
                        remove
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          <aside className="rounded-[2.4rem] bg-brand-purple p-5 text-brand-lavender-light shadow-[0_20px_54px_rgba(49,34,79,0.22)] sm:p-6">
            <p className="text-sm font-black lowercase tracking-[0.2em] opacity-80">
              order summary
            </p>
            <div className="mt-5 flex items-center justify-between gap-4">
              <span className="font-black lowercase opacity-80">items</span>
              <span className="font-black">{formatPrice(subtotal)}</span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-4">
              <span className="font-black lowercase opacity-80">
                premium box
              </span>
              <span className="font-black">
                {premiumBoxSelected ? formatPrice(PREMIUM_BOX_PRICE) : "-"}
              </span>
            </div>
            <div className="mt-5 flex items-center justify-between gap-4 border-t border-brand-lavender-light/25 pt-5">
              <span className="font-black lowercase">total</span>
              <span className="text-2xl font-black">{formatPrice(total)}</span>
            </div>
            <div className="mt-6 grid gap-3">
              <button
                type="button"
                disabled={!hasCartContent}
                className="rounded-full bg-brand-lavender-light px-5 py-4 font-black lowercase text-brand-purple disabled:opacity-45"
              >
                pay once with easypaisa
              </button>
              <button
                type="button"
                disabled={!hasCartContent}
                className="rounded-full border border-brand-lavender-light/45 px-5 py-4 font-black lowercase disabled:opacity-45"
              >
                pay once with jazzcash
              </button>
              <button
                type="button"
                onClick={clearCart}
                disabled={!hasCartContent}
                className="rounded-full border border-brand-lavender-light/25 px-5 py-3 text-sm font-black lowercase opacity-80 disabled:opacity-35"
              >
                clear cart
              </button>
            </div>
          </aside>
        </div>
      </section>

      <AppFooter />
    </main>
  );
}
