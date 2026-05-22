import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-brand-lavender px-5 text-center text-brand-purple">
      <div aria-hidden="true" className="breathing-circle" />

      <section className="relative z-10 max-w-3xl">
        <h1 className="text-5xl font-black lowercase leading-[0.92] sm:text-7xl">
          this page doesn&apos;t exist. but you do.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg font-semibold lowercase leading-8 opacity-75">
          maybe you were looking for something to help. start here.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-brand-purple px-7 py-4 text-base font-black lowercase text-brand-lavender-light shadow-[0_18px_44px_rgba(49,34,79,0.26)] transition hover:-translate-y-0.5"
        >
          go back home
        </Link>
      </section>
    </main>
  );
}
