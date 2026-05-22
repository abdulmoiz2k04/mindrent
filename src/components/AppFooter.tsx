import Link from "next/link";

export function AppFooter() {
  return (
    <footer className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-3 px-5 pb-7 text-sm font-bold lowercase text-brand-purple/60 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
      <span>no pressure. just softer data.</span>
      <div className="flex flex-wrap gap-2">
        <Link
          href="/support"
          className="w-fit rounded-full border border-brand-purple/15 bg-white/30 px-4 py-2 transition hover:bg-brand-purple hover:text-brand-lavender-light"
        >
          get support
        </Link>
        <Link
          href="/today"
          className="w-fit rounded-full border border-brand-purple/15 bg-white/30 px-4 py-2 transition hover:bg-brand-purple hover:text-brand-lavender-light"
        >
          what mindrent is holding today
        </Link>
      </div>
    </footer>
  );
}
