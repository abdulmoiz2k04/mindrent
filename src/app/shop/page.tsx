"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AppFooter } from "@/components/AppFooter";
import { TimeGreeting } from "@/components/TimeGreeting";
import { useCart } from "@/context/CartContext";
import { shopProducts } from "@/lib/shop-products";

const filters = ["all", "focus", "basic", "gift"] as const;

type CategoryFilter = (typeof filters)[number];

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(price);
}

function FloatingCartBubble() {
  const { itemCount, total } = useCart();

  return (
    <div className="fixed bottom-5 right-5 z-30 rounded-[1.6rem] border border-brand-purple/15 bg-white/75 px-5 py-4 text-brand-purple shadow-[0_20px_54px_rgba(49,34,79,0.22)] backdrop-blur-2xl">
      <p className="text-[0.68rem] font-black lowercase tracking-[0.2em] opacity-70">
        box
      </p>
      <div className="mt-1 flex items-end gap-3">
        <span className="text-3xl font-black leading-none">{itemCount}</span>
        <span className="pb-1 text-xs font-black lowercase opacity-70">
          {formatPrice(total)}
        </span>
      </div>
    </div>
  );
}

export default function ShopPage() {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("all");
  const { addItem } = useCart();

  const visibleProducts = useMemo(() => {
    if (activeFilter === "all") {
      return shopProducts;
    }

    return shopProducts.filter((product) => product.category === activeFilter);
  }, [activeFilter]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-brand-lavender px-5 py-6 text-brand-purple sm:px-8 lg:px-12">
      <div aria-hidden="true" className="ambient-background">
        <span className="ambient-blob ambient-blob-one" />
        <span className="ambient-blob ambient-blob-two" />
        <span className="ambient-particle ambient-particle-one" />
        <span className="ambient-particle ambient-particle-three" />
      </div>

      <section className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-7">
        <nav className="glass flex items-center justify-between gap-3 rounded-[2rem] px-4 py-3 sm:px-5">
          <Link href="/" className="flex items-center gap-3">
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
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-full border border-brand-purple/15 bg-white/35 px-4 py-2 text-sm font-black lowercase transition hover:bg-brand-purple hover:text-brand-lavender-light"
            >
              quiz
            </Link>
            <span className="rounded-full bg-brand-purple px-4 py-2 text-sm font-black lowercase text-brand-lavender-light">
              shop
            </span>
          </div>
        </nav>

        <header className="grid gap-5 py-4 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div className="glass rounded-[3rem] px-7 py-9 sm:px-10 lg:rounded-[4rem]">
            <p className="text-sm font-black lowercase tracking-[0.22em]">
              build your box directly
            </p>
            <h1 className="mt-4 max-w-2xl text-5xl font-black lowercase leading-[0.92] sm:text-7xl">
              shop calm without the quiz.
            </h1>
          </div>
          <div className="rounded-[2.4rem] border border-brand-purple/15 bg-white/35 p-5 shadow-[0_18px_46px_rgba(49,34,79,0.12)] backdrop-blur-xl">
            <p className="text-lg font-semibold leading-8 lowercase">
              browse individual resets across focus, basic care, and giftable
              softness. add what fits, skip what does not.
            </p>
          </div>
        </header>

        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => {
            const isActive = activeFilter === filter;

            return (
              <button
                key={filter}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveFilter(filter)}
                className={
                  isActive
                    ? "rounded-full bg-brand-purple px-5 py-3 text-sm font-black lowercase text-brand-lavender-light shadow-[0_14px_32px_rgba(49,34,79,0.22)]"
                    : "rounded-full border border-brand-purple/15 bg-white/45 px-5 py-3 text-sm font-black lowercase transition hover:-translate-y-0.5 hover:bg-white/70"
                }
              >
                {filter}
              </button>
            );
          })}
        </div>

        <section className="grid gap-5 pb-28 md:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product) => (
            <article
              key={product.id}
              className="group rounded-[2.3rem] border border-brand-purple/15 bg-white/60 p-5 shadow-[0_18px_46px_rgba(49,34,79,0.11)] backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/75"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-[1.4rem] border border-brand-purple/15 bg-brand-lavender-light/80 text-[0.66rem] font-black lowercase tracking-[0.12em]">
                  {product.icon}
                </div>
                <span className="rounded-full border border-brand-purple/15 px-3 py-1 text-[0.66rem] font-black lowercase tracking-[0.18em] opacity-70">
                  {product.category}
                </span>
              </div>

              <h2 className="mt-5 text-2xl font-black lowercase leading-none">
                {product.name}
              </h2>
              <p className="mt-3 min-h-16 text-sm font-semibold leading-6 lowercase opacity-78">
                {product.description}
              </p>

              <div className="mt-6 flex items-center justify-between gap-3">
                <p className="text-lg font-black">{formatPrice(product.price)}</p>
                <button
                  type="button"
                  onClick={() => addItem(product)}
                  className="rounded-full bg-brand-purple px-5 py-3 text-sm font-black lowercase text-brand-lavender-light shadow-[0_14px_30px_rgba(49,34,79,0.24)] transition group-hover:-translate-y-0.5"
                >
                  add to box
                </button>
              </div>
            </article>
          ))}
        </section>
      </section>

      <AppFooter />
      <FloatingCartBubble />
    </main>
  );
}
