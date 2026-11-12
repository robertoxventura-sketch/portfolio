import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export type DockSection = "home" | "works";

const RESUMES = [
  { label: "Product Design", href: "/resumes/Roberto_Ventura_Product_Designer_Resume.pdf" },
  { label: "Product Management", href: "/resumes/Roberto_Ventura_Product_Manager_Resume.pdf" },
];
const LINKEDIN_HREF = "https://www.linkedin.com/in/roberto-ventura-745b18207/";
const CONTACT_HREF = "mailto:robertoxventura@gmail.com";

const labelClass =
  "font-sans text-[13px] font-medium tracking-[-0.18px] text-[#1e1a15]";

const iconClass = "block h-12 w-auto max-w-[52px] object-contain drop-shadow-[2px_3px_4px_#DEDEDE]";

const emojiClass =
  "flex select-none items-center justify-center leading-none [font-family:'Apple_Color_Emoji','Segoe_UI_Emoji','Noto_Color_Emoji',emoji,sans-serif]";

const iconSpring = { type: "spring" as const, duration: 0.45, bounce: 0.25 };

function DockItem({
  label,
  active,
  onClick,
  href,
  expanded,
  children,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
  href?: string;
  expanded?: boolean;
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
      aria-expanded={expanded}
      aria-haspopup={expanded === undefined ? undefined : "menu"}
      onClick={onClick}
      className={className}
    >
      {body}
    </button>
  );
}

function ResumeMenu({ compact = false, children }: { compact?: boolean; children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      {open ? (
        <motion.div
          role="menu"
          aria-label="Resumes"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.86, y: 8, x: "-50%" }}
          animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
          transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 560, damping: 34, mass: 0.6 }}
          style={{ transformOrigin: "bottom center" }}
          className="absolute bottom-[calc(100%+8px)] left-1/2 z-20 min-w-[220px] overflow-hidden rounded-[14px] border border-black/[0.08] bg-white shadow-[0_0_0_0.5px_rgba(30,26,21,0.06),0_12px_32px_rgba(30,26,21,0.16)] [font-family:Geist,Inter,system-ui,sans-serif]"
        >
          {RESUMES.map((resume, index) => (
            <a
              key={resume.href}
              role="menuitem"
              href={resume.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className={`flex h-11 items-center px-4 text-[15px] font-medium tracking-[-0.011em] text-[#1e1a15] no-underline hover:bg-[#1e1a15]/[0.04] active:bg-[#1e1a15]/[0.08] ${
                index > 0 ? "border-t border-[#1e1a15]/10" : ""
              }`}
            >
              {resume.label}
            </a>
          ))}
        </motion.div>
      ) : null}
      {compact ? (
        <MiniDockItem
          label="Resume"
          icon="/nav/icon-resume.webp"
          expanded={open}
          onClick={() => setOpen((current) => !current)}
        />
      ) : (
        <DockItem label="Resume" expanded={open} onClick={() => setOpen((current) => !current)}>
          {children}
        </DockItem>
      )}
    </div>
  );
}

export function FolderDock({
  active,
  onHome,
  onWorks,
}: {
  active: DockSection | null;
  onHome: () => void;
  onWorks: () => void;
}) {
  return (
    <nav
      aria-label="Sections"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(18px,env(safe-area-inset-bottom))]"
    >
      <div className="pointer-events-auto flex items-end gap-2 rounded-[26px] border border-white/55 bg-white/45 px-3 pb-[7px] pt-[9px] shadow-[0_0_0_0.5px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05),0_10px_36px_rgba(0,0,0,0.08),inset_0_1.5px_1px_rgba(255,255,255,0.9)] backdrop-blur-[24px] backdrop-saturate-150 sm:gap-3.5 sm:px-4">
        <DockItem label="Home" active={active === "home"} onClick={onHome}>
          <span aria-hidden="true" className={`${emojiClass} h-12 w-12 text-[42px]`}>
            🏠
          </span>
        </DockItem>
        <DockItem label="Work" active={active === "works"} onClick={onWorks}>
          <img src="/nav/icon-work.webp" alt="" width={256} height={256} decoding="async" className={iconClass} />
        </DockItem>
        <ResumeMenu>
          <img src="/nav/icon-resume.webp" alt="" width={256} height={256} decoding="async" className={iconClass} />
        </ResumeMenu>
        <DockItem label="LinkedIn" href={LINKEDIN_HREF}>
          <img src="/nav/icon-linkedin.webp" alt="" width={256} height={256} decoding="async" className={iconClass} />
        </DockItem>
        <DockItem label="Email" href={CONTACT_HREF}>
          <img src="/nav/icon-email.webp" alt="" width={256} height={256} decoding="async" className={iconClass} />
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
  glyph,
  href,
  onClick,
  expanded,
}: {
  label: string;
  icon?: string;
  glyph?: string;
  href?: string;
  onClick?: () => void;
  expanded?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const className =
    "group relative grid size-11 place-items-center rounded-[12px] text-inherit no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e1a15]";
  const hover = reduceMotion ? undefined : { y: -4, scale: 1.12 };
  const body = (
    <>
      {glyph ? (
        <motion.span
          aria-hidden="true"
          className={`${emojiClass} size-10 text-[40px]`}
          whileHover={hover}
          transition={iconSpring}
        >
          {glyph}
        </motion.span>
      ) : (
        <motion.img
          src={icon}
          alt=""
          width={256}
          height={256}
          decoding="async"
          className={miniIconClass}
          whileHover={hover}
          transition={iconSpring}
        />
      )}
      <span
        className={`pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#1e1a15] px-2 py-1 font-sans text-[11px] font-medium leading-none text-white opacity-0 transition-opacity duration-150 ${
          expanded ? "" : "group-hover:opacity-100 group-focus-visible:opacity-100"
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
        aria-label={label}
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
      aria-expanded={expanded}
      aria-haspopup={expanded === undefined ? undefined : "menu"}
      onClick={onClick}
      className={className}
    >
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
        <MiniDockItem label="Home" glyph="🏠" onClick={() => navigate("/")} />
        <MiniDockItem label="Work" icon="/nav/icon-work.webp" onClick={() => navigate("/", { state: { view: "works" } })} />
        <ResumeMenu compact />
        <MiniDockItem label="LinkedIn" icon="/nav/icon-linkedin.webp" href={LINKEDIN_HREF} />
        <MiniDockItem label="Email" icon="/nav/icon-email.webp" href={CONTACT_HREF} />
      </motion.nav>
    </div>
  );
}
