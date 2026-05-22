import Image from "next/image";
import Link from "next/link";
import { AppFooter } from "@/components/AppFooter";
import { TimeGreeting } from "@/components/TimeGreeting";

const todayMoodData = {
  focus: 63,
  calm: 41,
  selfCare: 28,
};

const moodRows = [
  {
    key: "focus",
    count: todayMoodData.focus,
    text: "people are carrying focus friction today",
  },
  {
    key: "calm",
    count: todayMoodData.calm,
    text: "people needed to feel calm",
  },
  {
    key: "selfCare",
    count: todayMoodData.selfCare,
    text: "people are refilling themselves",
  },
] as const;

const maxCount = Math.max(...moodRows.map((row) => row.count));

export default function TodayPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-brand-lavender text-brand-purple">
      <div aria-hidden="true" className="ambient-background">
        <span className="ambient-blob ambient-blob-one" />
        <span className="ambient-blob ambient-blob-two" />
        <span className="ambient-particle ambient-particle-two" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-5 sm:px-8 sm:py-6 lg:px-12">
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
          <Link
            href="/"
            className="rounded-full border border-brand-purple/15 bg-white/35 px-4 py-2 text-sm font-black lowercase transition hover:bg-brand-purple hover:text-brand-lavender-light"
          >
            quiz
          </Link>
        </nav>

        <div className="flex flex-1 items-center py-10">
          <div className="glass w-full rounded-[3.4rem] p-6 sm:p-9 lg:rounded-[4.4rem]">
            <p className="text-sm font-black lowercase tracking-[0.22em] opacity-70">
              anonymous mood weather
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black lowercase leading-[0.92] sm:text-7xl">
              what mindrent is holding today
            </h1>

            <div className="mt-9 space-y-5">
              {moodRows.map((row, index) => (
                <section
                  key={row.key}
                  className="rounded-[2rem] border border-brand-purple/15 bg-white/40 p-5"
                >
                  <p className="text-lg font-black lowercase leading-7">
                    {row.count} {row.text}
                  </p>
                  <div className="mt-4 h-4 overflow-hidden rounded-full bg-brand-purple/10">
                    <div
                      className="today-bar h-full rounded-full bg-brand-purple"
                      style={{
                        animationDelay: `${index * 140}ms`,
                        width: `${(row.count / maxCount) * 100}%`,
                      }}
                    />
                  </div>
                </section>
              ))}
            </div>

            <p className="mt-8 text-center text-sm font-semibold italic lowercase opacity-65">
              no names. no accounts. just honest numbers.
            </p>
          </div>
        </div>
      </section>

      <AppFooter />
    </main>
  );
}
