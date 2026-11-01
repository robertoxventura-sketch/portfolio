import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export type DockSection = "works" | "profile";

const RESUME_HREF =
  "https://drive.google.com/file/d/1V5zcLX-MAGb667flbXnNJDQAa8KGv6BF/view?usp=sharing";
const LINKEDIN_HREF = "https://www.linkedin.com/in/roberto-ventura-745b18207/";
const CONTACT_HREF = "mailto:robertoxventura@gmail.com";

const labelClass =
  "font-sans text-[13px] font-medium tracking-[-0.18px] text-[#1e1a15]";

const iconClass = "block h-12 w-auto max-w-[52px] object-contain drop-shadow-[2px_3px_4px_#DEDEDE]";

const iconSpring = { type: "spring" as const, duration: 0.45, bounce: 0.25 };

function DockItem({
  label,
  active,
  onClick,
  href,
  children,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
  href?: string;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const className =
    "group relative z-0 flex flex-col items-center gap-1.5 border-0 bg-transparent p-0 text-inherit no-underline hover:z-10 focus-visible:z-10";
  const body = (
    <>
      <motion.span
        className="block"
        initial={false}
        animate={{ scale: 1, y: 0 }}
        whileHover={reduceMotion ? undefined : { scale: 1.3, y: -12 }}
        transition={iconSpring}
      >
        {children}
      </motion.span>
      <span
        className={`${labelClass} inline-block rounded px-[5px] leading-[22px] ${
          active ? "bg-[#0081F2] leading-[19px] text-white" : ""
        }`}
      >
        {label}
      </span>
    </>
  );

  if (href) {
    const external = href.startsWith("http");
    return (
      <a
        href={href}
        className={className}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {body}
      </a>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={className}
    >
      {body}
    </button>
  );
}

export function FolderDock({
  active,
  onWorks,
  onProfile,
}: {
  active: DockSection | null;
  onWorks: () => void;
  onProfile: () => void;
}) {
  return (
    <nav
      aria-label="Sections"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(18px,env(safe-area-inset-bottom))]"
    >
      <div className="pointer-events-auto flex items-end gap-3.5 rounded-[26px] border border-white/55 bg-white/45 px-4 pb-[7px] pt-[9px] shadow-[0_0_0_0.5px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05),0_10px_36px_rgba(0,0,0,0.08),inset_0_1.5px_1px_rgba(255,255,255,0.9)] backdrop-blur-[24px] backdrop-saturate-150">
        <DockItem label="Work" active={active === "works"} onClick={onWorks}>
          <img src="/nav/icon-work.webp" alt="" width={256} height={256} decoding="async" className={iconClass} />
        </DockItem>
        <DockItem label="Resume" href={RESUME_HREF}>
          <img src="/nav/icon-resume.webp" alt="" width={256} height={256} decoding="async" className={iconClass} />
        </DockItem>
        <DockItem label="LinkedIn" href={LINKEDIN_HREF}>
          <img src="/nav/icon-linkedin.webp" alt="" width={256} height={256} decoding="async" className={iconClass} />
        </DockItem>
        <DockItem label="Email" href={CONTACT_HREF}>
          <img src="/nav/icon-email.webp" alt="" width={256} height={256} decoding="async" className={iconClass} />
        </DockItem>
        <DockItem label="Profile" active={active === "profile"} onClick={onProfile}>
          <img src="/nav/icon-profile.webp" alt="" width={256} height={256} decoding="async" className={iconClass} />
        </DockItem>
      </div>
    </nav>
  );
}

function useScrolledPast(threshold: number) {
  const [past, setPast] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > threshold;
      setPast((current) => (current === next ? current : next));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return past;
}

const miniIconClass = "block h-8 w-auto max-w-9 object-contain drop-shadow-[1px_2px_2px_#DEDEDE]";

function MiniDockItem({
  label,
  icon,
  href,
  onClick,
}: {
  label: string;
  icon: string;
  href?: string;
  onClick?: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const className =
    "group relative grid size-11 place-items-center rounded-[12px] text-inherit no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e1a15]";
  const body = (
    <>
      <motion.img
        src={icon}
        alt=""
        width={256}
        height={256}
        decoding="async"
        className={miniIconClass}
        whileHover={reduceMotion ? undefined : { y: -4, scale: 1.12 }}
        transition={iconSpring}
      />
      <span className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#1e1a15] px-2 py-1 font-sans text-[11px] font-medium leading-none text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
        {label}
      </span>
    </>
  );

  if (href) {
    const external = href.startsWith("http");
    return (
      <a
        href={href}
        aria-label={label}
        className={className}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {body}
      </a>
    );
  }

  return (
    <button type="button" aria-label={label} onClick={onClick} className={className}>
      {body}
    </button>
  );
}

export function CaseStudyDock() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const visible = useScrolledPast(72);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4 pb-[env(safe-area-inset-bottom)]">
      <motion.nav
        aria-label="Sections"
        aria-hidden={!visible}
        {...(!visible ? { inert: true } : {})}
        initial={false}
        animate={visible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 18, scale: 0.96 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : visible
              ? { type: "spring", stiffness: 340, damping: 26 }
              : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }
        }
        className={`flex items-end gap-1 rounded-[22px] border border-white/70 bg-white/80 px-2.5 py-1.5 shadow-[0_0_0_1px_rgba(30,26,21,0.06),0_8px_24px_rgba(30,26,21,0.1)] backdrop-blur-[16px] ${
          visible ? "pointer-events-auto" : ""
        }`}
      >
        <MiniDockItem label="Work" icon="/nav/icon-work.webp" onClick={() => navigate("/", { state: { view: "works" } })} />
        <MiniDockItem label="Resume" icon="/nav/icon-resume.webp" href={RESUME_HREF} />
        <MiniDockItem label="LinkedIn" icon="/nav/icon-linkedin.webp" href={LINKEDIN_HREF} />
        <MiniDockItem label="Email" icon="/nav/icon-email.webp" href={CONTACT_HREF} />
        <MiniDockItem label="Profile" icon="/nav/icon-profile.webp" onClick={() => navigate("/", { state: { view: "profile" } })} />
      </motion.nav>
    </div>
  );
}
