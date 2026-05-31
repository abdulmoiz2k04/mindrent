"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const needStates = [
  {
    id: "calm",
    label: "calm",
    title: "for the days that feel too loud",
    body: "breathing cards, lavender candle, chamomile tea, guided journaling, fidget tools, and a small dark chocolate pause.",
    signal: "stress and anxiety relief",
  },
  {
    id: "focus",
    label: "focus",
    title: "for the tasks that keep slipping",
    body: "pomodoro timer, planner pad, motivation stickers, snacks, affirmation cards, paint, canvas, tea, and a tiny cue to begin again.",
    signal: "structure and productivity",
  },
  {
    id: "selfCare",
    label: "self-care",
    title: "for the mood that needs tending",
    body: "sheet mask, scented candle, gratitude journal, sleep mask, energy bars, and peppermint green tea for a softer reset.",
    signal: "mood boost and emotional comfort",
  },
];

const flowSteps = [
  {
    title: "answer honestly",
    body: "ten gentle prompts map your stress, focus, and self-care signals.",
  },
  {
    title: "write what options miss",
    body: "custom answers let the AI understand the part that does not fit a button.",
  },
  {
    title: "edit your box",
    body: "keep the recommendation, add extras, or choose premium packaging.",
  },
];

const marquee = [
  "calm kit",
  "focus kit",
  "self-care kit",
  "one-time checkout",
  "private answers",
  "real products",
];

export default function Home() {
  const [activeNeed, setActiveNeed] = useState(needStates[0]);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 35 });
  const [showStickyCta, setShowStickyCta] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShowStickyCta(window.scrollY > 420);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-brand-lavender text-brand-purple"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();

        setSpotlight({
          x: ((event.clientX - rect.left) / rect.width) * 100,
          y: ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 100,
        });
      }}
    >
      <div aria-hidden="true" className="ambient-background">
        <span className="ambient-blob ambient-blob-one" />
        <span className="ambient-blob ambient-blob-two" />
        <span className="ambient-blob ambient-blob-three" />
        <span className="ambient-particle ambient-particle-one" />
        <span className="ambient-particle ambient-particle-three" />
      </div>

      <div
        aria-hidden="true"
        className="home-spotlight"
        style={{
          left: `${spotlight.x}%`,
          top: `${spotlight.y}%`,
        }}
      />

      <Link
        href="/quiz"
        className={
          showStickyCta
            ? "fixed bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-full bg-brand-purple px-6 py-4 text-sm font-black lowercase text-brand-lavender-light opacity-100 shadow-[0_20px_54px_rgba(49,34,79,0.24)] transition"
            : "pointer-events-none fixed bottom-5 left-1/2 z-40 -translate-x-1/2 translate-y-4 rounded-full bg-brand-purple px-6 py-4 text-sm font-black lowercase text-brand-lavender-light opacity-0 shadow-[0_20px_54px_rgba(49,34,79,0.24)] transition"
        }
      >
        take the quiz
      </Link>

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-8 sm:py-6 lg:px-12">
        <nav className="glass flex flex-wrap items-center justify-between gap-3 rounded-[1.6rem] px-4 py-3 sm:rounded-[2rem] sm:px-5">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <Image
              src="/mindrent-logo.jpeg"
              alt="mindrent logo"
              width={48}
              height={48}
              priority
              className="rounded-full border border-brand-purple/15"
            />
            <span className="text-xl font-black lowercase tracking-wide">
              mindrent
            </span>
          </Link>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Link
              href="/shop"
              className="rounded-full border border-brand-purple/15 bg-white/35 px-4 py-2 text-sm font-black lowercase transition hover:bg-brand-purple hover:text-brand-lavender-light"
            >
              shop
            </Link>
            <Link
              href="/support"
              className="rounded-full border border-brand-purple/15 bg-white/35 px-4 py-2 text-sm font-black lowercase transition hover:bg-brand-purple hover:text-brand-lavender-light"
            >
              support
            </Link>
          </div>
        </nav>

        <div className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[1.04fr_0.96fr] lg:py-16">
          <section className="glass home-hero-card relative overflow-hidden rounded-[2.6rem] px-6 py-9 sm:rounded-[3.4rem] sm:px-10 sm:py-12 lg:rounded-[4.6rem]">
            <div aria-hidden="true" className="home-line-field">
              <svg viewBox="0 0 520 260" fill="none">
                <path
                  className="home-line-path"
                  d="M18 174C62 98 123 94 169 138C215 182 255 203 292 151C329 99 354 47 407 74C459 100 464 171 506 139"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="5"
                />
              </svg>
            </div>
            <p className="relative text-sm font-black lowercase tracking-[0.22em] opacity-70">
              a wellness box that listens first
            </p>
            <h1 className="relative mt-5 max-w-4xl text-5xl font-black lowercase leading-[0.88] sm:text-7xl lg:text-8xl">
              rent a little room in your mind back.
            </h1>
            <p className="relative mt-7 max-w-2xl text-lg font-semibold leading-8 lowercase">
              mindrent turns a private emotional check-in into a one-time kit
              for calm, focus, or self-care. no diagnosis. no subscription.
              just a softer way to meet the day you are actually having.
            </p>
            <div className="relative mt-8 flex flex-wrap gap-3">
              <Link
                href="/quiz"
                className="rounded-full bg-brand-purple px-7 py-4 text-base font-black lowercase text-brand-lavender-light shadow-[0_18px_44px_rgba(49,34,79,0.28)] transition hover:-translate-y-0.5"
              >
                find my kit
              </Link>
              <Link
                href="/shop"
                className="rounded-full border border-brand-purple/15 bg-white/35 px-7 py-4 text-base font-black lowercase transition hover:bg-white/65"
              >
                browse products
              </Link>
            </div>
          </section>

          <section className="home-orbit-stage glass relative min-h-[34rem] overflow-hidden rounded-[2.8rem] p-5 sm:p-7">
            <div className="home-orbit-ring" />
            <div className="home-orbit-ring home-orbit-ring-two" />
            <div className="home-kit-preview">
              <p className="text-xs font-black lowercase tracking-[0.2em] opacity-65">
                active signal
              </p>
              <h2 className="mt-3 text-4xl font-black lowercase leading-none">
                {activeNeed.label}
              </h2>
              <p className="mt-4 text-sm font-semibold lowercase leading-6 opacity-80">
                {activeNeed.signal}
              </p>
            </div>
            <div className="absolute inset-x-5 bottom-5 grid gap-3">
              {needStates.map((need) => {
                const active = activeNeed.id === need.id;

                return (
                  <button
                    key={need.id}
                    type="button"
                    onClick={() => setActiveNeed(need)}
                    className={
                      active
                        ? "rounded-[1.5rem] bg-brand-purple px-5 py-4 text-left text-brand-lavender-light shadow-[0_18px_44px_rgba(49,34,79,0.22)] transition"
                        : "rounded-[1.5rem] border border-brand-purple/15 bg-white/45 px-5 py-4 text-left transition hover:-translate-y-0.5 hover:bg-white/70"
                    }
                  >
                    <span className="text-sm font-black lowercase tracking-[0.16em] opacity-75">
                      {need.label}
                    </span>
                    <span className="mt-1 block text-lg font-black lowercase leading-6">
                      {need.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </section>

      <section className="relative z-10 overflow-hidden border-y border-brand-purple/10 bg-white/25 py-4 backdrop-blur-xl">
        <div className="home-marquee flex w-max gap-8 whitespace-nowrap text-sm font-black lowercase tracking-[0.22em] text-brand-purple/65">
          {Array.from({ length: 4 }).flatMap((_, group) =>
            marquee.map((item) => <span key={`${group}-${item}`}>{item}</span>),
          )}
        </div>
      </section>

      <section className="relative z-10 mx-auto grid w-full max-w-7xl gap-5 px-4 py-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12">
        <div className="glass rounded-[2.8rem] p-6 sm:p-8">
          <p className="text-sm font-black lowercase tracking-[0.22em] opacity-65">
            try the signal
          </p>
          <h2 className="mt-4 text-4xl font-black lowercase leading-none sm:text-6xl">
            what are you carrying today?
          </h2>
          <p className="mt-5 text-base font-semibold lowercase leading-7 opacity-80">
            tap a state and watch the kit logic shift. the quiz goes deeper,
            but the feeling is the same: your box should follow your need.
          </p>
        </div>
        <div className="grid gap-4">
          <article className="home-answer-card rounded-[2rem] border border-brand-purple/15 bg-white/45 p-5">
            <p className="text-sm font-black lowercase tracking-[0.18em] opacity-65">
              selected direction
            </p>
            <h3 className="mt-3 text-3xl font-black lowercase leading-none">
              {activeNeed.title}
            </h3>
            <p className="mt-4 text-base font-semibold lowercase leading-7 opacity-80">
              {activeNeed.body}
            </p>
          </article>
          <div className="grid gap-4 sm:grid-cols-3">
            {flowSteps.map((step, index) => (
              <article
                key={step.title}
                className="home-step-card rounded-[2rem] border border-brand-purple/15 bg-white/45 p-5"
              >
                <span className="text-sm font-black tracking-[0.18em] opacity-55">
                  0{index + 1}
                </span>
                <h3 className="mt-3 text-2xl font-black lowercase leading-none">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm font-semibold lowercase leading-6 opacity-75">
                  {step.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 sm:px-8 lg:px-12">
        <div className="home-path rounded-[3rem] border border-brand-purple/15 bg-brand-purple p-6 text-brand-lavender-light shadow-[0_24px_80px_rgba(49,34,79,0.22)] sm:p-8 lg:rounded-[4rem]">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="text-sm font-black lowercase tracking-[0.22em] opacity-75">
                designed for one honest pause
              </p>
              <h2 className="mt-4 text-4xl font-black lowercase leading-none sm:text-6xl">
                from feeling to box in ten questions.
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {["private check-in", "ai-aware custom answer", "one-time kit"].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-[1.7rem] border border-brand-lavender-light/25 bg-brand-lavender-light/10 p-5 font-black lowercase"
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 mx-auto mb-7 w-[calc(100%-2rem)] max-w-7xl rounded-[2.4rem] border border-brand-purple/15 bg-white/35 p-6 text-brand-purple shadow-[0_24px_80px_rgba(49,34,79,0.16)] backdrop-blur-2xl sm:w-[calc(100%-4rem)] sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="text-sm font-black lowercase tracking-[0.22em] opacity-65">
              contact mindrent
            </p>
            <h2 className="mt-3 text-4xl font-black lowercase leading-none sm:text-5xl">
              questions, collabs, or a softer hello.
            </h2>
          </div>
          <div className="space-y-2 text-sm font-bold lowercase leading-6 opacity-80">
            <p>
              email:{" "}
              <a
                className="underline underline-offset-4"
                href="mailto:hello@mindrent.pk"
              >
                hello@mindrent.pk
              </a>
            </p>
            <p>location: pakistan</p>
            <p>instagram: @mindrent.pk</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
