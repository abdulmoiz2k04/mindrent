"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, Reorder, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { continueQuiz } from "@/app/actions";
import { AppFooter } from "@/components/AppFooter";
import { SupportSection } from "@/components/SupportSection";
import { TimeGreeting } from "@/components/TimeGreeting";
import {
  MAX_QUESTIONS,
  type KitProduct,
  type QuizAnswer,
  type QuizQuestion,
  type QuizResult,
} from "@/lib/quiz-types";
import { shopProducts, type ShopProduct } from "@/lib/shop-products";

type MindRentQuizProps = {
  firstQuestion: QuizQuestion;
};

const kitBasePrices = {
  Basic: 4200,
  Focus: 5400,
  Gift: 6200,
};

const moodStates = [
  "scattered",
  "overstimulated",
  "quietly tired",
  "carrying too much",
  "almost okay",
  "softly rebooting",
  "too many tabs open",
  "needing a pause",
];

const firstVisitHero = {
  headline: "a box that listens before it arrives.",
  body: "answer five gentle prompts. mindrent ai branches toward stress, focus, or self-care, then builds a one-time wellness kit around what your day is actually asking for.",
};

const returningHero = {
  headline: "welcome back. ready for another reset?",
  body: "your answers are private. your next kit is waiting.",
};

const proofNotes = [
  {
    quote: "got my calm kit on a tuesday. actually helped.",
    byline: "zara, lahore",
  },
  {
    quote: "felt oddly seen by a tiny box of things.",
    byline: "hamza, islamabad",
  },
  {
    quote: "less dramatic than therapy. still very useful.",
    byline: "mariam, karachi",
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(price);
}

function productKeys(product: Pick<KitProduct, "id" | "name">) {
  return [product.id.toLowerCase(), product.name.toLowerCase()];
}

function shopProductToKitProduct(product: ShopProduct): KitProduct {
  return {
    id: product.id,
    name: product.name,
    reason: product.description,
    price: product.price,
  };
}

function AmbientBackground() {
  return (
    <div aria-hidden="true" className="ambient-background">
      <span className="ambient-blob ambient-blob-one" />
      <span className="ambient-blob ambient-blob-two" />
      <span className="ambient-blob ambient-blob-three" />
      <span className="ambient-particle ambient-particle-one" />
      <span className="ambient-particle ambient-particle-two" />
      <span className="ambient-particle ambient-particle-three" />
      <span className="ambient-particle ambient-particle-four" />
    </div>
  );
}

function GrainOverlay() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full opacity-[0.18] mix-blend-multiply"
    >
      <filter id="mindrent-grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.72"
          numOctaves="3"
          seed="11"
        />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncA type="table" tableValues="0 0.22" />
        </feComponentTransfer>
      </filter>
      <rect width="100%" height="100%" filter="url(#mindrent-grain)" />
    </svg>
  );
}

function MoodTicker() {
  const tickerText = moodStates.join(" · ");

  return (
    <div className="mood-ticker relative z-10 mt-4 overflow-hidden rounded-full border border-brand-purple/15 bg-white/25 py-3 font-mono text-[0.68rem] font-bold lowercase tracking-[0.24em] text-brand-purple/70 backdrop-blur-xl">
      <div className="mood-ticker-track flex w-max items-center gap-8 whitespace-nowrap">
        {Array.from({ length: 4 }).map((_, index) => (
          <span key={index}>{tickerText}</span>
        ))}
      </div>
    </div>
  );
}

function HeroHeadline({ text }: { text: string }) {
  const heroWords = text.split(" ");

  return (
    <h2
      key={text}
      className="hero-headline hero-copy-fade max-w-3xl text-5xl font-black lowercase leading-[0.92] sm:text-7xl"
    >
      {heroWords.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="hero-word"
          style={{ animationDelay: `${220 + index * 135}ms` }}
        >
          {word}
        </span>
      ))}
    </h2>
  );
}

function ProofCards() {
  return (
    <section
      aria-label="customer notes"
      className="relative z-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3"
    >
      {proofNotes.map((note, index) => (
        <figure
          key={note.quote}
          className="proof-card glass rounded-[2rem] px-5 py-5"
          style={{ animationDelay: `${index * 0.7}s` }}
        >
          <blockquote className="text-sm font-semibold italic leading-6 lowercase sm:text-base">
            &ldquo;{note.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-4 text-[0.68rem] font-black lowercase tracking-[0.2em] opacity-65">
            {note.byline}
          </figcaption>
        </figure>
      ))}
    </section>
  );
}

function BrainProgress({ progress }: { progress: number }) {
  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 420 330"
      className="pointer-events-none fixed left-1/2 top-8 z-0 h-[28rem] w-[28rem] -translate-x-1/2 text-brand-purple opacity-20 sm:h-[42rem] sm:w-[42rem] lg:left-auto lg:right-[-8rem] lg:top-[-2rem] lg:translate-x-0"
      fill="none"
      initial={false}
    >
      <motion.path
        d="M151 130c-29-25-15-66 23-64 23-41 83-21 83 17 42 2 59 50 30 78 15 36-19 72-55 57-28 32-84 17-84-27-45 0-58-41-28-67 16-14 39-14 57-4 22 12 38 39 24 58-18 23-66 7-67-25-1-42 61-63 101-35 46 32 35 86-6 94-46 9-98-29-92-71 7-51 93-69 136-25 39 39 17 93-36 95-56 3-103-45-84-88 22-50 106-45 135 4 25 41-11 88-62 78-47-9-77-56-58-91 17-31 65-40 99-18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
        initial={{ pathLength: 0.08, opacity: 0.55 }}
        animate={{
          pathLength: Math.max(0.1, progress),
          opacity: 0.32 + progress * 0.42,
        }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
      <motion.path
        d="M207 212c2 32-3 48-22 66"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: progress > 0.8 ? 1 : 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}

function SliderAnswer({
  question,
  onAnswer,
  disabled,
}: {
  question: QuizQuestion;
  onAnswer: (answer: QuizAnswer) => void;
  disabled: boolean;
}) {
  const [score, setScore] = useState(50);
  const selectedIndex = Math.min(2, Math.floor(score / 34));
  const selected = question.answers[selectedIndex];

  return (
    <div className="space-y-7">
      <div className="rounded-[2rem] border border-brand-purple/15 bg-white/35 p-5">
        <input
          aria-label="answer intensity"
          type="range"
          min="0"
          max="100"
          value={score}
          onChange={(event) => setScore(Number(event.target.value))}
          className="mind-slider"
        />
        <div className="mt-5 grid grid-cols-3 gap-3 text-center text-xs font-black lowercase sm:text-sm">
          {question.answers.map((answer) => (
            <span
              key={answer}
              className={
                answer === selected
                  ? "rounded-full bg-brand-purple px-3 py-2 text-brand-lavender-light"
                  : "rounded-full bg-white/40 px-3 py-2"
              }
            >
              {answer}
            </span>
          ))}
        </div>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={() =>
          onAnswer({
            question: question.question,
            answer: selected,
            score,
          })
        }
        className="w-full rounded-full bg-brand-purple px-6 py-4 text-base font-black lowercase text-brand-lavender-light shadow-[0_16px_34px_rgba(49,34,79,0.28)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55"
      >
        settle here
      </button>
    </div>
  );
}

function PriorityAnswer({
  question,
  onAnswer,
  disabled,
}: {
  question: QuizQuestion;
  onAnswer: (answer: QuizAnswer) => void;
  disabled: boolean;
}) {
  const [items, setItems] = useState<string[]>([...question.answers]);

  return (
    <div className="space-y-7">
      <Reorder.Group
        axis="y"
        values={items}
        onReorder={setItems}
        className="space-y-3"
      >
        {items.map((item, index) => (
          <Reorder.Item
            key={item}
            value={item}
            className="cursor-grab rounded-[1.7rem] border border-brand-purple/15 bg-white/45 px-5 py-4 font-black lowercase shadow-[0_12px_30px_rgba(49,34,79,0.12)] active:cursor-grabbing"
            whileDrag={{ scale: 1.03, rotate: index % 2 === 0 ? -1.5 : 1.5 }}
          >
            <div className="flex items-center justify-between gap-4">
              <span>{item}</span>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-purple text-sm text-brand-lavender-light">
                {index + 1}
              </span>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <button
        type="button"
        disabled={disabled}
        onClick={() =>
          onAnswer({
            question: question.question,
            answer: items[0],
            score: 100 - items.indexOf(items[0]) * 25,
          })
        }
        className="w-full rounded-full bg-brand-purple px-6 py-4 text-base font-black lowercase text-brand-lavender-light shadow-[0_16px_34px_rgba(49,34,79,0.28)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55"
      >
        keep this order
      </button>
    </div>
  );
}

function QuizCard({
  question,
  onAnswer,
  pending,
}: {
  question: QuizQuestion;
  onAnswer: (answer: QuizAnswer) => void;
  pending: boolean;
}) {
  return (
    <motion.section
      key={question.id}
      initial={{ opacity: 0, y: 22, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -18, scale: 0.98 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="glass relative z-10 rounded-[3rem] p-5 sm:p-7 lg:rounded-[4rem]"
    >
      <div className="rounded-[2.5rem] border border-brand-purple/15 bg-brand-lavender-light/55 p-5 sm:p-7">
        <div className="mb-8 flex items-start justify-between gap-5">
          <div>
            <p className="text-sm font-black lowercase tracking-[0.2em]">
              step {question.step} of {MAX_QUESTIONS}
            </p>
            <h1 className="mt-3 text-4xl font-black lowercase leading-[0.95] sm:text-5xl">
              {question.question}
            </h1>
          </div>
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-brand-purple/20 bg-white/40 text-xl font-black">
            {question.step}
          </div>
        </div>

        {question.inputMode === "priority" ? (
          <PriorityAnswer
            question={question}
            onAnswer={onAnswer}
            disabled={pending}
          />
        ) : (
          <SliderAnswer
            question={question}
            onAnswer={onAnswer}
            disabled={pending}
          />
        )}

        <p className="mt-5 text-center text-sm font-bold lowercase opacity-75">
          {pending
            ? "asking mindrent ai for the next gentle question..."
            : question.inputMode === "priority"
              ? "drag your strongest answer to the top"
              : "slide until the answer feels closest"}
        </p>
      </div>
    </motion.section>
  );
}

function KitAssemblyBox({
  products,
  lastDroppedId,
}: {
  products: KitProduct[];
  lastDroppedId: string | null;
}) {
  return (
    <div className="kit-assembly mx-auto">
      <div className="kit-drop-zone" aria-hidden="true">
        {products.slice(0, 7).map((product, index) => (
          <span
            key={`${product.id}-${index}`}
            className={
              product.id === lastDroppedId
                ? "kit-drop-item kit-drop-item-new"
                : "kit-drop-item"
            }
            style={{
              animationDelay:
                product.id === lastDroppedId ? "0ms" : `${index * 150}ms`,
              left: `${18 + (index % 4) * 16}%`,
              bottom: `${30 + Math.floor(index / 4) * 16}%`,
            }}
          >
            {product.name.split(" ")[0]}
          </span>
        ))}
      </div>
      <div className="kit-box-lid" />
      <div className="kit-box-body">
        <span>{products.length} soft things</span>
      </div>
    </div>
  );
}

function ProductCarousel({
  products,
  onAdd,
  initialKitKeys,
}: {
  products: KitProduct[];
  onAdd: (product: KitProduct) => void;
  initialKitKeys: Set<string>;
}) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const currentProductKeys = useMemo(
    () => new Set(products.flatMap((product) => productKeys(product))),
    [products],
  );
  const carouselProducts = shopProducts.filter(
    (product) => productKeys(product).every((key) => !initialKitKeys.has(key)),
  );

  function scrollCarousel(direction: -1 | 1) {
    carouselRef.current?.scrollBy({
      left: direction * 340,
      behavior: "smooth",
    });
  }

  if (carouselProducts.length === 0) {
    return null;
  }

  return (
    <section className="rounded-[2.6rem] border border-brand-purple/15 bg-white/35 p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-black lowercase tracking-[0.18em]">
            add something soft
          </p>
          <h3 className="mt-2 text-2xl font-black lowercase sm:text-3xl">
            you might also like
          </h3>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => scrollCarousel(-1)}
            className="grid h-11 w-11 place-items-center rounded-full border border-brand-purple/20 bg-white/45 text-lg font-black transition hover:bg-brand-purple hover:text-brand-lavender-light"
            aria-label="scroll recommendations left"
          >
            &larr;
          </button>
          <button
            type="button"
            onClick={() => scrollCarousel(1)}
            className="grid h-11 w-11 place-items-center rounded-full border border-brand-purple/20 bg-white/45 text-lg font-black transition hover:bg-brand-purple hover:text-brand-lavender-light"
            aria-label="scroll recommendations right"
          >
            &rarr;
          </button>
        </div>
      </div>

      <div
        ref={carouselRef}
        className="carousel-scroll mt-5 flex gap-4 overflow-x-auto pb-3"
      >
        {carouselProducts.map((product) => {
          const added = productKeys(product).some((key) =>
            currentProductKeys.has(key),
          );
          const kitProduct = shopProductToKitProduct(product);

          return (
            <article
              key={product.id}
              className="min-w-[16.5rem] snap-start rounded-[2rem] border border-brand-purple/15 bg-brand-lavender-light/60 p-5 shadow-[0_16px_38px_rgba(49,34,79,0.12)] sm:min-w-[18rem]"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-12 min-w-12 place-items-center rounded-[1.2rem] border border-brand-purple/15 bg-white/45 px-2 text-[0.62rem] font-black lowercase tracking-[0.1em]">
                  {product.icon}
                </span>
                <span className="rounded-full border border-brand-purple/15 px-3 py-1 text-[0.62rem] font-black lowercase tracking-[0.16em] opacity-70">
                  {product.category}
                </span>
              </div>

              <h4 className="mt-5 text-xl font-black lowercase leading-none">
                {product.name}
              </h4>
              <p className="mt-3 min-h-20 text-sm font-semibold leading-6 lowercase opacity-80">
                {product.description}
              </p>

              <div className="mt-5 flex items-center justify-between gap-3">
                <p className="text-base font-black">
                  {formatPrice(product.price)}
                </p>
                <button
                  type="button"
                  disabled={added}
                  onClick={() => onAdd(kitProduct)}
                  className={
                    added
                      ? "rounded-full border border-brand-purple/15 bg-white/45 px-4 py-2 text-sm font-black lowercase opacity-70"
                      : "rounded-full bg-brand-purple px-4 py-2 text-sm font-black lowercase text-brand-lavender-light shadow-[0_14px_30px_rgba(49,34,79,0.2)] transition hover:-translate-y-0.5"
                  }
                >
                  {added ? <>&#10003; added</> : "+ add"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ProductReveal({
  result,
}: {
  result: QuizResult;
}) {
  const [products, setProducts] = useState(result.products);
  const [method, setMethod] = useState<"easypaisa" | "jazzcash">("easypaisa");
  const [lastDroppedId, setLastDroppedId] = useState<string | null>(null);

  const initialKitKeys = useMemo(
    () => new Set(result.products.flatMap((product) => productKeys(product))),
    [result.products],
  );
  const total = useMemo(
    () =>
      kitBasePrices[result.kit] +
      products.reduce((sum, product) => sum + product.price, 0),
    [products, result.kit],
  );

  function addProductToKit(product: KitProduct) {
    setProducts((current) => [...current, product]);
    setLastDroppedId(product.id);
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass relative z-10 w-full rounded-[3rem] p-5 sm:p-7 lg:rounded-[4rem]"
    >
      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.25fr]">
        <div className="rounded-[2.6rem] border border-brand-purple/15 bg-brand-lavender-light/55 p-5 sm:p-6">
          <div className="grid items-center gap-6 sm:grid-cols-[11rem_1fr]">
            <KitAssemblyBox products={products} lastDroppedId={lastDroppedId} />

            <div>
              <p className="text-sm font-black lowercase tracking-[0.2em]">
                your ai recommendation
              </p>
              <h2 className="mt-3 text-4xl font-black lowercase leading-none sm:text-5xl">
                {result.kit} kit
              </h2>
              <p className="mt-4 text-base font-semibold leading-7 sm:text-lg">
                {result.reasoning}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[2.6rem] border border-brand-purple/15 bg-white/35 p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black lowercase tracking-[0.2em]">
                customize your box
              </p>
              <h3 className="mt-2 text-2xl font-black lowercase sm:text-3xl">
                edit your reset
              </h3>
            </div>
            <div className="rounded-full bg-brand-purple px-5 py-3 text-xl font-black text-brand-lavender-light">
              {formatPrice(total)}
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-start gap-3 rounded-[1.7rem] border border-brand-purple/15 bg-brand-lavender-light/55 p-4"
              >
                <div className="flex-1">
                  <p className="font-black lowercase">{product.name}</p>
                  <p className="mt-1 text-sm font-semibold leading-6 opacity-80">
                    {product.reason}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black">
                    {formatPrice(product.price)}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setProducts((current) =>
                        current.filter((item) => item.id !== product.id),
                      )
                    }
                    className="mt-2 grid h-9 w-9 place-items-center rounded-full border border-brand-purple/20 bg-white/50 font-black transition hover:bg-brand-purple hover:text-brand-lavender-light"
                    aria-label={`remove ${product.name}`}
                  >
                    x
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5">
        <ProductCarousel
          products={products}
          initialKitKeys={initialKitKeys}
          onAdd={addProductToKit}
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_0.86fr]">
        <div className="hidden xl:block" />
        <div className="rounded-[2.6rem] bg-brand-purple p-5 text-brand-lavender-light sm:p-6">
          <p className="text-sm font-black lowercase tracking-[0.2em]">
            one-time checkout
          </p>
          <p className="mt-2 text-lg font-bold lowercase leading-7">
            no subscription, no renewal. just one reset box when you are ready.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {(["easypaisa", "jazzcash"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMethod(item)}
                className={
                  method === item
                    ? "rounded-full bg-brand-lavender-light px-4 py-3 font-black lowercase text-brand-purple"
                    : "rounded-full border border-brand-lavender-light/40 px-4 py-3 font-black lowercase"
                }
              >
                {item}
              </button>
            ))}
          </div>
            <button
              type="button"
              className="mt-5 w-full rounded-full bg-brand-lavender-light px-6 py-4 font-black lowercase text-brand-purple shadow-[0_18px_40px_rgba(0,0,0,0.2)]"
            >
              pay once with {method}
            </button>
        </div>
      </div>

      <div className="mt-5">
        <SupportSection compact />
      </div>
    </motion.section>
  );
}

export function MindRentQuiz({ firstQuestion }: MindRentQuizProps) {
  const [question, setQuestion] = useState(firstQuestion);
  const [transcript, setTranscript] = useState<QuizAnswer[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isReturning, setIsReturning] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [isPending, startTransition] = useTransition();
  const heroCopy = isReturning ? returningHero : firstVisitHero;

  const progress = result
    ? 1
    : Math.min((question.step - 1) / MAX_QUESTIONS + 0.12, 0.92);

  useEffect(() => {
    const visitedKey = "mindrent_visited";

    if (window.localStorage.getItem(visitedKey)) {
      const returnTimeoutId = window.setTimeout(() => {
        setIsReturning(true);
      }, 0);

      return () => window.clearTimeout(returnTimeoutId);
    }

    const timeoutId = window.setTimeout(() => {
      window.localStorage.setItem(visitedKey, "true");
    }, 2000);

    return () => window.clearTimeout(timeoutId);
  }, []);

  function answerCurrentQuestion(answer: QuizAnswer) {
    const nextTranscript = [...transcript, answer].slice(0, MAX_QUESTIONS);
    setTranscript(nextTranscript);

    startTransition(async () => {
      const response = await continueQuiz({
        transcript: nextTranscript,
        sessionId,
      });

      if (response.status === "result") {
        setResult(response.result);
        return;
      }

      setQuestion(response.question);
    });
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-brand-lavender text-brand-purple">
      <AmbientBackground />
      <GrainOverlay />
      <BrainProgress progress={progress} />

      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-12">
        <nav className="glass z-10 flex items-center justify-between gap-3 rounded-[2rem] px-4 py-3 sm:px-5">
          <div className="flex items-center gap-3">
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
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/shop"
              className="rounded-full border border-brand-purple/15 bg-white/35 px-4 py-2 text-sm font-black lowercase transition hover:bg-brand-purple hover:text-brand-lavender-light"
            >
              shop
            </Link>
            <div className="rounded-full border border-brand-purple/15 bg-white/35 px-4 py-2 text-sm font-black lowercase">
              {result ? "box ready" : `${question.step}/${MAX_QUESTIONS}`}
            </div>
          </div>
        </nav>

        <MoodTicker />

        {result ? (
          <div className="flex flex-1 items-center py-8 lg:py-10">
            <AnimatePresence mode="wait">
              <ProductReveal key="result" result={result} />
            </AnimatePresence>
          </div>
        ) : (
          <div className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[0.88fr_1.12fr] lg:py-16">
            <motion.div
              className="relative z-10 space-y-6"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="glass rounded-[3.25rem] px-7 py-9 sm:px-10 sm:py-12 lg:rounded-[4.5rem]">
                <p className="mb-5 text-sm font-black lowercase tracking-[0.22em]">
                  ai-guided, one reset at a time
                </p>
                <HeroHeadline text={heroCopy.headline} />
                <p
                  key={heroCopy.body}
                  className="hero-copy-fade mt-6 max-w-2xl text-lg font-semibold leading-8"
                >
                  {heroCopy.body}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {["5 questions max", "private server action", "one-time reset"].map(
                  (note) => (
                    <div
                      key={note}
                      className="glass rounded-[2rem] px-5 py-4 text-sm font-extrabold lowercase"
                    >
                      {note}
                    </div>
                  ),
                )}
              </div>
            </motion.div>

            <div className="space-y-5">
              <AnimatePresence mode="wait">
                <QuizCard
                  key={question.id}
                  question={question}
                  onAnswer={answerCurrentQuestion}
                  pending={isPending}
                />
              </AnimatePresence>
              <ProofCards />
            </div>
          </div>
        )}
      </section>
      <AppFooter />
    </main>
  );
}
