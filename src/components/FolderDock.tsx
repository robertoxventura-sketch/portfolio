import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

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
          <img src="/nav/icon-work.png" alt="" className={iconClass} />
        </DockItem>
        <DockItem label="Resume" href={RESUME_HREF}>
          <img src="/nav/icon-resume.png" alt="" className={iconClass} />
        </DockItem>
        <DockItem label="LinkedIn" href={LINKEDIN_HREF}>
          <img src="/nav/icon-linkedin.png" alt="" className={iconClass} />
        </DockItem>
        <DockItem label="Email" href={CONTACT_HREF}>
          <img src="/nav/icon-email.png" alt="" className={iconClass} />
        </DockItem>
        <DockItem label="Profile" active={active === "profile"} onClick={onProfile}>
          <img src="/nav/icon-profile.png" alt="" className={iconClass} />
        </DockItem>
      </div>
    </nav>
  );
}
