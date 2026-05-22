const supportOrganizations = [
  {
    name: "HEC National Youth Helpline",
    description: "psychosocial support and career counseling for young people",
    phones: [{ label: "0800-69457", href: "tel:080069457" }],
    hours: "check availability on their site",
    website: "https://www.hec.gov.pk",
    tag: "youth focused",
  },
  {
    name: "Umang",
    description:
      "Pakistan's first 24/7 mental health helpline, run by clinical psychologists and psychiatrists",
    phones: [{ label: "0311-7786264", href: "tel:+923117786264" }],
    hours: "24/7",
    email: "info@umang.com.pk",
    website: "https://www.umang.com.pk",
    tag: "24/7 · free",
  },
  {
    name: "Ruhbaru (Soul to Soul)",
    description:
      "free tele-counseling by qualified mental health professionals, in collaboration with Sindh Mental Health Authority",
    phones: [
      { label: "0331-7777784", href: "tel:+923317777784" },
      { label: "021-99215720", href: "tel:+922199215720" },
    ],
    hours: "Monday-Friday, 9am-5pm",
    website: "https://www.ruhbaru.com",
    tag: "free · Karachi",
  },
];

function PhoneIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
    >
      <path
        d="M6.6 3.9 8.7 3c.6-.2 1.2 0 1.5.6l1 2.3c.2.5.1 1-.3 1.4l-1 1c.7 1.4 1.9 2.7 3.3 3.4l1.1-1c.4-.4 1-.5 1.5-.3l2.2 1c.6.3.9.9.6 1.5l-.8 2.1c-.3.7-1 1.1-1.7 1-6.1-.8-10.9-5.6-11.7-11.7-.1-.7.3-1.4 1-1.7Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function SupportSection({ compact = false }: { compact?: boolean }) {
  return (
    <section
      className={
        compact
          ? "rounded-[2rem] border border-brand-purple/15 bg-white/35 p-4 sm:rounded-[2.6rem] sm:p-6"
          : "glass rounded-[2.4rem] p-5 sm:rounded-[3.2rem] sm:p-9 lg:rounded-[4.2rem]"
      }
    >
      <div
        className={
          compact
            ? "flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"
            : "text-center"
        }
      >
        <div>
          <h2
            className={
              compact
                ? "text-3xl font-black lowercase leading-none sm:text-4xl"
                : "text-4xl font-black lowercase leading-[0.92] sm:text-7xl"
            }
          >
            need to talk to someone?
          </h2>
          <p className="mt-3 text-sm font-semibold italic lowercase text-brand-purple/60">
            these are free, confidential, and real.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {supportOrganizations.map((org) => (
          <article
            key={org.name}
            className="rounded-[2rem] border border-brand-purple/15 bg-white/50 p-5 shadow-[0_14px_34px_rgba(49,34,79,0.1)] transition hover:-translate-y-1 hover:bg-white/70 hover:shadow-[0_22px_52px_rgba(49,34,79,0.16)]"
          >
            <span className="inline-flex rounded-full border border-brand-purple/15 bg-brand-lavender-light/75 px-3 py-1 text-[0.66rem] font-black lowercase tracking-[0.16em] text-brand-purple/75">
              {org.tag}
            </span>
            <h3 className="mt-4 text-2xl font-black lowercase leading-none">
              {org.name}
            </h3>
            <p className="mt-3 text-sm font-semibold lowercase leading-6 opacity-80">
              {org.description}
            </p>

            <div className="mt-5 space-y-2">
              {org.phones.map((phone) => (
                <a
                  key={phone.label}
                  href={phone.href}
                  className="flex w-fit items-center gap-2 rounded-full bg-brand-purple px-4 py-2 text-sm font-black text-brand-lavender-light shadow-[0_12px_28px_rgba(49,34,79,0.18)]"
                >
                  <PhoneIcon />
                  {phone.label}
                </a>
              ))}
            </div>

            <dl className="mt-5 space-y-2 text-sm font-semibold lowercase leading-6">
              <div>
                <dt className="font-black opacity-65">hours</dt>
                <dd>{org.hours}</dd>
              </div>
              {org.email ? (
                <div>
                  <dt className="font-black opacity-65">email</dt>
                  <dd>
                    <a
                      href={`mailto:${org.email}`}
                      className="underline decoration-brand-purple/25 underline-offset-4"
                    >
                      {org.email}
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>

            <a
              href={org.website}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex text-sm font-black lowercase text-brand-purple/65 underline decoration-brand-purple/25 underline-offset-4 transition hover:text-brand-purple"
            >
              visit website
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
