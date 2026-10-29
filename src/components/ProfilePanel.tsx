const RESUME_HREF =
  "https://drive.google.com/file/d/1V5zcLX-MAGb667flbXnNJDQAa8KGv6BF/view?usp=sharing";
const LINKEDIN_HREF = "https://www.linkedin.com/in/roberto-ventura-745b18207/";
const CONTACT_HREF = "mailto:robertoxventura@gmail.com";

const links = [
  { label: "Resume", href: RESUME_HREF },
  { label: "LinkedIn", href: LINKEDIN_HREF },
  { label: "Contact", href: CONTACT_HREF },
];

export function ProfilePanel() {
  return (
    <section className="flex min-h-dvh flex-col items-center justify-center px-6 pb-36 pt-28 text-center">
      <div className="mb-8 h-36 w-36 overflow-hidden rounded-[28px] bg-[#c8d9f0] shadow-[0_10px_36px_rgba(0,0,0,0.08)] sm:h-44 sm:w-44">
        <img
          src="/nav/profile-mii.webp"
          alt="Roberto Ventura as a Mii-style avatar"
          width={512}
          height={512}
          decoding="async"
          className="h-full w-full object-cover object-center"
        />
      </div>
      <h1 className="font-display text-display-sm leading-tight text-foreground sm:text-display-md">
        Roberto Ventura
      </h1>
      <p className="mt-3 max-w-md font-sans text-body text-muted-foreground">
        Product designer in Los Angeles. I design and ship product UX, end to end.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            {...(link.href.startsWith("mailto:")
              ? {}
              : { target: "_blank", rel: "noopener noreferrer" })}
            className="rounded-full border border-foreground/15 bg-white px-4 py-2 font-sans text-body-sm text-foreground shadow-sm transition hover:border-foreground"
          >
            {link.label}
          </a>
        ))}
      </div>
    </section>
  );
}
