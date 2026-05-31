import Image from "next/image";
import Link from "next/link";
import { AppFooter } from "@/components/AppFooter";
import { SupportSection } from "@/components/SupportSection";
import { TimeGreeting } from "@/components/TimeGreeting";

export default function SupportPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-brand-lavender text-brand-purple">
      <div aria-hidden="true" className="ambient-background">
        <span className="ambient-blob ambient-blob-one" />
        <span className="ambient-blob ambient-blob-two" />
        <span className="ambient-particle ambient-particle-one" />
        <span className="ambient-particle ambient-particle-three" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-8 sm:py-6 lg:px-12">
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
              href="/quiz"
              className="rounded-full border border-brand-purple/15 bg-white/35 px-4 py-2 text-sm font-black lowercase transition hover:bg-brand-purple hover:text-brand-lavender-light"
            >
              quiz
            </Link>
            <Link
              href="/shop"
              className="rounded-full border border-brand-purple/15 bg-white/35 px-4 py-2 text-sm font-black lowercase transition hover:bg-brand-purple hover:text-brand-lavender-light"
            >
              shop
            </Link>
          </div>
        </nav>

        <div className="flex flex-1 items-center py-10">
          <SupportSection />
        </div>
      </section>

      <AppFooter />
    </main>
  );
}
