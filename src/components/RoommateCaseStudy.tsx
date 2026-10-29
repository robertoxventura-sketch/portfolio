import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { cases, type CaseStudy } from "../data/cases";
import { CoverMedia } from "./CoverMedia";

const leadSections = [
  { id: "overview", label: "Overview" },
  { id: "background", label: "Background" },
  { id: "problem", label: "Problem" },
];

const tailSections = [
  { id: "final-product", label: "Final product" },
  { id: "impact", label: "Impact" },
];

type StudyLayout = {
  overview?: string;
  tags: string[];
  meta: { label: string; value: string }[];
  backgroundTitle?: string;
  backgroundCards?: { title: string; body: string }[];
  backgroundNote?: string;
  problemTitle: string;
  problemBody: ReactNode;
  northStarLabel?: string;
  northStar: string;
  solutions?: { title: string; body: string; image?: string; sound?: boolean }[];
  research?: {
    groups: {
      id: string;
      label: string;
      title?: string;
      body?: string;
      intro?: string;
      image?: string;
      observations?: { name: string; body: string; avatar: string; side: "left" | "right" }[];
      insights?: { title: string; body: string; visual: "contrast" | "hud" | "color" | "audio" }[];
      competitors?: { name: string; logo: "switch" | "mario" | "smash" | "botw"; body: string; features: string[]; limitations: string[] }[];
    }[];
  };
  finalTitle: string;
  impactTitle: string;
  impactBody: string;
};

const layouts: Record<string, StudyLayout> = {
  "table-redesign": {
    tags: ["Responsive Web App"],
    meta: [
      { label: "My Role", value: "Product Designer" },
      { label: "Timeline", value: "Oct 2025 – Dec 2025" },
      { label: "Roles", value: "Product Designer\nSoftware Engineer" },
      { label: "Team", value: "Roberto Ventura\nHiyab Woldegebriel" },
    ],
    backgroundTitle: "Why Roommate Search Falls Short",
    backgroundCards: [
      {
        title: "Platforms Verify Accounts, Not Identities",
        body: "Common verification methods, such as email and phone verification, leave room for inauthentic accounts like bots, spam, and impersonators, weakening user trust in the platform.",
      },
      {
        title: "Users Rely on Platforms Not Built for Roommate Search",
        body: "Without roommate-specific search and matching tools, users must manually find, compare, and evaluate potential roommates, making the process time-consuming and inefficient.",
      },
      {
        title: "Dedicated Roommate Platforms Feel Outdated and Inactive",
        body: "Outdated interfaces can make platforms feel less trustworthy, discouraging users from engaging with potential roommates.",
      },
    ],
    backgroundNote: "User interviews, competitive analysis, and secondary research uncovered these critical gaps.",
    problemTitle: "Finding roommates is easy. Finding the right one isn’t.",
    problemBody:
      "Existing solutions create gaps in trust, efficiency, and compatibility, making it difficult to confidently choose the right roommate.",
    northStar: "How might we make roommate search safer, more efficient, and compatibility-driven?",
    finalTitle: "PadPal",
    impactTitle: "11→1 tables unified",
    impactBody: "The recorded outcome for this project is 11→1 tables unified.",
  },
  "tokyo-afterfall": {
    overview:
      "Tokyo Afterfall is a handheld game menu concept designed to improve gameplay accessibility for players with visual impairments, including low vision, color vision deficiencies, and astigmatism. The project explores customizable accessibility settings that make essential gameplay information easier to perceive and interpret.",
    tags: ["Accessibility", "2D-Game Concept", "Game Menu"],
    meta: [
      { label: "My Role", value: "Product Designer" },
      { label: "Timeline", value: "2 Weeks" },
      { label: "My Contributions", value: "UI Design · UX Research · Prototyping" },
      { label: "Team", value: "Roberto Ventura" },
    ],
    problemTitle: "Designed for Everyone, Accessible to Some",
    problemBody: (
      <>
        Limited visual accessibility options across Nintendo Switch hardware and games create barriers for players
        with visual impairments. <strong className="font-semibold text-[#1e1a15]">Excessive visual information</strong>,{" "}
        <strong className="font-semibold text-[#1e1a15]">non-scalable interfaces</strong>, and an{" "}
        <strong className="font-semibold text-[#1e1a15]">overreliance on visual cues</strong> make essential gameplay
        information difficult to perceive and interpret.
      </>
    ),
    northStarLabel: "Design challenge",
    northStar:
      "How might we make essential gameplay information easier to perceive for players with low vision, astigmatism, and color vision deficiencies during handheld gaming?",
    solutions: [
      {
        title: "High Contrast Mode Reduces Visual Noise",
        body: "Players can enable High Contrast Mode to reduce visual noise and make gameplay elements easier to distinguish. The feature uses grayscale to mute complex game environments while highlighting characters and enemies with contrasting colors, helping players identify threats and navigate combat encounters.",
        image: "/tokyo-high-contrast.mp4?v=2",
      },
      {
        title: "Scalable HUD Improves Gameplay Readability",
        body: "Players can enlarge their Heads-Up Display (HUD) to make gameplay information easier to read. By increasing the size of health bars, equipped weapon indicators, and collected currency displays, the feature aims to improve legibility for players with low vision and conditions such as presbyopia and astigmatism, helping them monitor their status during gameplay.",
        image: "/tokyo-scalable-hud.mp4",
      },
      {
        title: "Audio Cues Support Faster Reactions",
        body: "Players can enable audio cues to support faster response times during time-sensitive gameplay events. Paired with a high-visibility visual indicator, these sound-based alerts reduce reliance on visual processing and help players recognize and respond to threats, such as incoming enemy attacks.",
        image: "/tokyo-audio-cues.mp4?v=2",
        sound: true,
      },
    ],
    research: {
      groups: [
        {
          id: "accessibility-audit",
          label: "Accessibility Audit",
          body: "I conducted an accessibility audit of the Nintendo Switch console and 3 of its top 5 best-selling games to assess the availability and effectiveness of visual accessibility features for players with low vision and color vision deficiencies.",
          competitors: [
            {
              name: "Nintendo Switch",
              logo: "switch",
              body: "The Nintendo Switch offers limited system-level accessibility settings that can be used during gameplay.",
              features: ["Display Color Customization", "Screen Zoom"],
              limitations: [
                "Display colors are limited to inverted colors and grayscale, without dedicated colorblind filters.",
                "Screen Zoom requires manual activation, potentially disrupting gameplay.",
                "No system-wide text scaling or HUD customization.",
              ],
            },
            {
              name: "Super Mario Odyssey",
              logo: "mario",
              body: "Super Mario Odyssey offers Assist Mode to reduce gameplay difficulty through additional guidance and support.",
              features: ["Assist Mode"],
              limitations: [
                "Assist Mode provides navigational guidance and reduces gameplay difficulty but does not offer visual interface customization.",
                "No dedicated settings for text scaling, HUD resizing, or color vision deficiencies.",
              ],
            },
            {
              name: "Super Smash Bros. Ultimate",
              logo: "smash",
              body: "Super Smash Bros. Ultimate offers visual indicators to help players identify characters during combat.",
              features: ["Team Highlight"],
              limitations: [
                "Team Highlight is limited to team-based matches and does not provide consistent character highlighting across all game modes.",
                "No additional visual accessibility features are available.",
              ],
            },
            {
              name: "The Legend of Zelda: Breath of the Wild",
              logo: "botw",
              body: "Breath of the Wild offers HUD customization and audio cues to help players perceive gameplay information.",
              features: ["Normal / Pro HUD Modes", "Audio Cues"],
              limitations: [
                "Pro HUD reduces visual clutter by hiding nonessential HUD elements, but does not allow players to resize individual interface elements.",
                "Audio cues support navigation and provide some combat feedback, but are not consistently available.",
                "No additional settings are available to customize visual accessibility.",
              ],
            },
          ],
        },
        {
          id: "secondary-research",
          label: "Secondary research",
          intro:
            "Seren and James are two video game players that are visually impaired. Their stories and experiences serve as a direct inspiration to create Tokyo Afterfall.",
          observations: [
            {
              name: "Seren Jaye",
              avatar: "/seren-avatar.png",
              side: "left",
              body: "Seren lost her vision at seventeen and still plays games like Mario Kart. Menus and obstacles on the Nintendo Switch are difficult to navigate, and simple accessibility features would dramatically improve her experience.",
            },
            {
              name: "James Rath",
              avatar: "/james-rath.jpg",
              side: "right",
              body: "James consults with game studios on accessibility. He points to a high-contrast mode, like the one in Insomniac’s Spider-Man, as essential for seeing the game.",
            },
          ],
        },
        {
          id: "user-interviews",
          label: "User interviews",
          title: "Listening to players with different visual needs.",
          body: "I conducted semi-structured interviews with 4 active gamers with visual impairments to understand how their visual needs shape handheld gameplay and where existing accessibility features fall short. I synthesized responses through affinity mapping to identify recurring patterns.",
          image: "/user-interviews-affinity.png?v=3",
        },
        {
          id: "findings",
          label: "Findings",
          insights: [
            {
              title: "Contrast stays locked",
              body: "Menus and status sit at one contrast level, so details blend into the scene.",
              visual: "contrast",
            },
            {
              title: "The HUD does not scale",
              body: "Health, objectives, and prompts stay small on a handheld screen.",
              visual: "hud",
            },
            {
              title: "Color carries the signal",
              body: "Status and feedback often depend on hue alone, with no second cue.",
              visual: "color",
            },
            {
              title: "Menus stay silent",
              body: "Choosing an action has no audio confirmation, so navigation depends on sight.",
              visual: "audio",
            },
          ],
        },
      ],
    },
    finalTitle: "Tokyo Afterfall",
    impactTitle: "A menu players can hear and see",
    impactBody:
      "Tokyo Afterfall shows how a high-contrast mode, a larger heads-up display, and audio cues can guide visually impaired players through an interactive menu.",
  },
};

const solutionVideo = /\.(mov|mp4|webm|m4v)(\?.*)?$/i;

function LoopingClip({ src, alt, sound = false }: { src: string; alt: string; sound?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    setMuted(true);
    const onPlay = () => setPaused(false);
    const onPause = () => setPaused(true);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    void video.play().catch(() => setPaused(true));
    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, [src]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  };

  const toggleMuted = () => {
    const video = videoRef.current;
    if (!video) return;
    const next = !video.muted;
    video.muted = next;
    setMuted(next);
  };

  return (
    <figure className="cs-clip relative m-0 overflow-hidden rounded-lg">
      <video
        ref={videoRef}
        src={src}
        className="aspect-video w-full object-cover"
        autoPlay
        loop
        muted={muted}
        playsInline
        preload="auto"
        aria-label={alt}
      />
      <div className="cs-clip-controls" data-open={paused || (sound && !muted) ? "true" : undefined}>
        {sound ? (
          <button type="button" className="cs-clip-btn" aria-label={muted ? "Unmute video" : "Mute video"} aria-pressed={!muted} onClick={toggleMuted}>
            {muted ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M3 9.5v5h3.5L12 19.2V4.8L6.5 9.5H3z" />
                <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M16 10l5 5M21 10l-5 5" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M3 9.5v5h3.5L12 19.2V4.8L6.5 9.5H3z" />
                <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M16 9.2a4 4 0 0 1 0 5.6M18.6 7a7 7 0 0 1 0 10" />
              </svg>
            )}
          </button>
        ) : null}
        <button type="button" className="cs-clip-btn" aria-label={paused ? "Play video" : "Pause video"} aria-pressed={paused} onClick={togglePlayback}>
          {paused ? (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          )}
        </button>
      </div>
    </figure>
  );
}

const competitorLogos = {
  mario: "/competitors/mario-odyssey.webp",
  smash: "/competitors/smash-bros.jpg",
  botw: "/competitors/breath-of-the-wild.webp",
} as const;

function CompetitorLogo({ logo }: { logo: "switch" | "mario" | "smash" | "botw" }) {
  if (logo === "switch") {
    return (
      <svg className="cs-competitor-logo cs-competitor-logo-switch" viewBox="0 0 42 45" aria-hidden="true">
        <path
          fill="currentColor"
          d="M24.808 45H31.237C37.145 45 42 39.799 42 33.469V11.531C42 5.203 37.145 0 31.237 0H24.675C24.545 0 24.412.139 24.412.281v44.438C24.411 44.861 24.544 45 24.808 45ZM32.813 20.252c2.364 0 4.198 2.109 4.198 4.496 0 2.535-1.969 4.5-4.198 4.5-2.363 0-4.2-1.967-4.2-4.5-.132-2.529 1.837-4.496 4.2-4.496ZM19.95 0H10.762C4.856 0 0 5.203 0 11.531v21.938C0 39.799 4.856 45 10.762 45h9.188c.129 0 .263-.139.263-.279V.281C20.214.139 20.081 0 19.95 0Zm-3.017 41.346H10.763c-1.951.003-3.823-.826-5.203-2.304C4.181 37.564 3.407 35.559 3.411 33.469V11.531c-.004-2.09.77-4.095 2.149-5.573C6.94 4.48 8.812 3.651 10.763 3.654H16.8v37.692ZM6.563 13.498c0 2.391 1.706 4.219 3.937 4.219s3.938-1.828 3.938-4.219-1.707-4.219-3.938-4.219-3.937 1.828-3.937 4.219Z"
        />
      </svg>
    );
  }
  return <img src={competitorLogos[logo]} alt="" className={`cs-competitor-logo cs-competitor-logo-${logo}`} />;
}

function InsightSnap({ kind }: { kind: "contrast" | "hud" | "color" | "audio" }) {
  if (kind === "contrast") {
    return (
      <div className="flex h-[72px] w-[148px] items-center justify-center rounded-md bg-[#8d8983]">
        <span className="font-sans text-[13px] tracking-wide text-[#9c9892]">HP 42</span>
      </div>
    );
  }
  if (kind === "hud") {
    return (
      <div className="relative h-[72px] w-[148px] rounded-md border border-[#1e1a15]/10 bg-white">
        <span className="absolute right-2 top-2 h-1.5 w-8 rounded-full bg-[#1e1a15]/25" />
        <span className="absolute right-2 top-5 font-sans text-[8px] text-[#1e1a15]/30">OBJ</span>
      </div>
    );
  }
  if (kind === "color") {
    return (
      <div className="flex items-center gap-3">
        <span className="h-3.5 w-3.5 rounded-full bg-[#e23b2f]" />
        <span className="h-3.5 w-3.5 rounded-full bg-[#2f9e44]" />
        <span className="h-3.5 w-3.5 rounded-full bg-[#e23b2f]" />
      </div>
    );
  }
  return (
    <div className="flex h-[72px] w-[148px] items-center rounded-md border border-[#1e1a15]/10 bg-white px-3">
      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-[#1e1a15]" />
      <span className="font-sans text-[13px] text-[#1e1a15]">Continue</span>
    </div>
  );
}

function statusDot(tone: NonNullable<CaseStudy["status"]>["tone"]) {
  if (tone === "concept") return "concept-dot";
  if (tone === "delivered") return "delivered-dot";
  return "live-dot";
}

export function RoommateCaseStudy({ study }: { study: CaseStudy }) {
  const layout = layouts[study.id];
  const pageSections = [
    ...leadSections.filter((section) => section.id !== "background" || layout?.backgroundTitle),
    ...(layout?.solutions?.length ? [{ id: "solution", label: "Solution" }] : []),
    ...(layout?.research ? [{ id: "research", label: "Research" }] : []),
    ...tailSections,
  ];
  const [active, setActive] = useState(pageSections[0].id);
  const next = cases.filter((item) => item.id !== study.id);
  const visual = study.id === "tokyo-afterfall" && study.cover ? study.cover : study.image;

  useEffect(() => {
    const observedIds = [
      ...pageSections.map((section) => section.id),
      ...(layout?.research?.groups.map((group) => group.id) ?? []),
    ];
    const nodes = observedIds
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.15, 0.4, 0.7] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [study.id]);

  if (!layout) return null;

  return (
    <div className={`min-h-screen bg-[#f7f7f5] text-[#1e1a15] ${study.id === "tokyo-afterfall" ? "cs-tokyo" : ""}`}>
      <Link
        to="/"
        className="fixed left-0 right-0 top-0 z-50 px-7 py-[18px] font-display text-[17px] tracking-tight text-[#1e1a15] sm:px-12"
      >
        Roberto Ventura
      </Link>

      <aside className="fixed left-10 top-[112px] z-40 hidden w-[180px] min-[1280px]:block">
        <Link
          to="/"
          state={{ view: "works" }}
          className="mb-8 inline-flex items-center gap-1 rounded-full border border-[#e4e4e4] bg-white px-3 py-1.5 font-sans text-[13px] text-[#1e1a15] shadow-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </Link>
        <nav className="flex flex-col" aria-label="Case study sections">
          {pageSections.map((section) => {
            const researchOpen =
              section.id === "research" &&
              (active === "research" || layout?.research?.groups.some((group) => group.id === active));
            const isActive = section.id === "research" ? researchOpen : active === section.id;
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={`py-1.5 font-sans text-[15px] tracking-normal no-underline transition-colors ${
                  isActive ? "font-medium text-[#1e1a15]" : "text-[#b0b0b0] hover:text-[#1e1a15]"
                }`}
              >
                {section.label}
              </a>
            );
          })}
        </nav>
      </aside>

      <div className={study.id === "tokyo-afterfall" ? "cs-tokyo-main" : "contents"}>
      <div className="cs-hero-visual" aria-hidden="true">
        <CoverMedia src={visual} className="aspect-video w-full object-cover" />
      </div>
      {study.id === "tokyo-afterfall" ? (
        <h1 className="cs-tokyo-open-title">Accessibility Features for Visually Impaired Players</h1>
      ) : null}
      <main className="cs-scroll-body mx-auto pb-28">
        {study.id === "tokyo-afterfall" ? (
          <header className="cs-tokyo-open">
            <dl className="cs-tokyo-facts">
              <div>
                <dt>Type</dt>
                <dd>Personal Project</dd>
              </div>
              <div>
                <dt>Role</dt>
                <dd>Product Designer</dd>
              </div>
              <div>
                <dt>Timeline</dt>
                <dd>2 Weeks</dd>
              </div>
              <div>
                <dt>Team</dt>
                <dd>Solo</dd>
              </div>
            </dl>
          </header>
        ) : null}
        {study.id === "tokyo-afterfall" ? null : (
        <header className="mb-[72px]">
          <p className="mb-5 font-sans text-[17px] font-semibold tracking-[-0.01em] text-[#1e1a15]">
            {study.client}
          </p>
          <h1 className="mb-3 font-sans text-[clamp(40px,6vw,64px)] font-medium leading-[1.05] tracking-[-0.04em] text-[#1e1a15]">
            {study.title}
          </h1>
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {study.status ? (
              <li className="inline-flex items-center gap-[7px] whitespace-nowrap rounded-full border border-[#E9E9E9] bg-white px-3.5 py-1.5 font-mono text-[14px] uppercase tracking-[0.04em] text-[#1e1a15]">
                <span className={statusDot(study.status.tone)} aria-hidden="true" />
                {study.status.label}
              </li>
            ) : null}
            {layout.tags.map((tag) => (
              <li
                key={tag}
                className="inline-flex items-center whitespace-nowrap rounded-full border border-[#E9E9E9] bg-white px-3.5 py-1.5 font-mono text-[14px] tracking-[-0.2px] text-[#1e1a15]"
              >
                {tag}
              </li>
            ))}
          </ul>
        </header>
        )}

        <section id="overview" className="mb-20 scroll-mt-24">
          {study.id === "tokyo-afterfall" ? (
            <div className="cs-tokyo-overview">
              <p className={`mb-5 font-mono text-[14px] font-medium tracking-normal ${active === "overview" ? "text-[#0066cc]" : "text-[#8a8a8a]"}`}>
                Overview
              </p>
              <h2 className="mb-6 font-sans text-[clamp(28px,3.5vw,36px)] font-medium leading-[1.15] tracking-[-0.035em]">
                Tokyo Afterfall
              </h2>
              <p className="cs-tokyo-overview-body">{layout.overview ?? study.desc}</p>
            </div>
          ) : (
            <>
          <p className={`mb-5 font-mono text-[14px] font-medium tracking-normal ${active === "overview" ? "text-[#0066cc]" : "text-[#8a8a8a]"}`}>
            Overview
          </p>
            <p className="mb-5 font-sans text-[17px] leading-[1.65] text-[#404040]">{layout.overview ?? study.desc}</p>
          <dl className="mt-9 grid grid-cols-1 gap-8 rounded-xl bg-[#1e1a15]/[0.02] p-6 sm:grid-cols-2 sm:gap-x-[72px]">
            {layout.meta.map((item) => (
              <div key={item.label} className="flex flex-col gap-1.5">
                <dt className="font-sans text-[15px] font-medium text-[#5a5248]">{item.label}</dt>
                <dd className="font-sans text-[17px] leading-[1.55] text-[#404040]">
                  {item.value.split("\n").map((line, index) => (
                    <span key={line}>
                      {index > 0 ? <br /> : null}
                      {line}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
            </>
          )}
        </section>

        {layout.backgroundTitle ? (
        <section id="background" className="mb-20 scroll-mt-24">
          <p className={`mb-5 font-mono text-[14px] font-medium tracking-normal ${active === "background" ? "text-[#0066cc]" : "text-[#8a8a8a]"}`}>
            Background
          </p>
          <h2 className="mb-6 font-sans text-[clamp(28px,3.5vw,36px)] font-medium leading-[1.15] tracking-[-0.035em]">
            {layout.backgroundTitle}
          </h2>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {layout.backgroundCards?.map((concept) => (
              <li
                key={concept.title}
                className="rounded-[20px] border border-white/80 bg-white/70 p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(30,26,21,0.04),0_12px_32px_-18px_rgba(30,26,21,0.22)] backdrop-blur-xl"
              >
                <h3 className="m-0 font-sans text-[17px] font-medium leading-[1.35] tracking-[-0.015em] text-[#1e1a15]">
                  {concept.title}
                </h3>
                <p className="mb-0 mt-2 font-sans text-[15px] leading-[1.55] text-[#5c564e]">{concept.body}</p>
              </li>
            ))}
          </ul>
          {layout.backgroundNote ? (
            <p className="mb-0 mt-4 text-center font-sans text-[15px] italic leading-[1.55] text-[#626262]">
              {layout.backgroundNote}
            </p>
          ) : null}
        </section>
        ) : null}

        <section id="problem" className="mb-20 scroll-mt-24">
          <p className={`mb-5 font-mono text-[14px] font-medium tracking-normal ${active === "problem" ? "text-[#0066cc]" : "text-[#8a8a8a]"}`}>
            Problem
          </p>
          <h2 className="mb-6 font-sans text-[clamp(28px,3.5vw,36px)] font-medium leading-[1.15] tracking-[-0.035em]">
            {layout.problemTitle}
          </h2>
          <p className="mb-5 font-sans text-[17px] leading-[1.65] text-[#404040]">{layout.problemBody}</p>
          <div className="rounded-xl border border-[#0066cc]/10 bg-[#0066cc]/[0.04] p-8">
            <p className="mb-3 flex items-center gap-2.5 font-mono text-[12px] font-medium tracking-normal text-[#5a5248]">
              {layout.northStarLabel ? null : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              )}
              {layout.northStarLabel ?? "Our North Star"}
            </p>
            <p className="m-0 font-sans text-[17px] font-medium leading-[1.65] text-[#404040]">
              {layout.northStar}
            </p>
          </div>
        </section>

        {layout.solutions?.length ? (
          <section id="solution" className="mb-20 scroll-mt-24">
            <p className={`mb-5 font-mono text-[14px] font-medium tracking-normal ${active === "solution" ? "text-[#0066cc]" : "text-[#8a8a8a]"}`}>
              Solution
            </p>
            {layout.solutions.map((item, index) => (
              <div key={`${item.title}-${index}`} className={index > 0 ? "mt-28" : undefined}>
                <h2 className="mb-6 font-sans text-[clamp(28px,3.5vw,36px)] font-medium leading-[1.15] tracking-[-0.035em]">
                  {item.title}
                </h2>
                <p className="mb-10 font-sans text-[17px] leading-[1.65] text-[#404040]">{item.body}</p>
                {item.image ? (
                  solutionVideo.test(item.image) ? (
                    <LoopingClip src={item.image} alt={`${item.title} in Tokyo Afterfall`} sound={item.sound} />
                  ) : (
                    <figure className="m-0 overflow-hidden rounded-lg">
                      <img
                        src={item.image}
                        alt="Tokyo Afterfall title screen on a handheld console"
                        className="aspect-video w-full object-cover"
                      />
                    </figure>
                  )
                ) : null}
              </div>
            ))}
          </section>
        ) : null}

        {layout.research ? (
          <section id="research" className="mb-20 scroll-mt-24">
            <p className={`mb-5 font-mono text-[14px] font-medium tracking-normal ${active === "research" || layout.research.groups.some((group) => group.id === active) ? "text-[#0066cc]" : "text-[#8a8a8a]"}`}>
              Research
            </p>
            {layout.research.groups.map((group, index) => (
              <div key={group.id} id={group.id} className={`scroll-mt-24 ${index > 0 ? "mt-14" : ""}`}>
                <h2 className="mb-4 font-mono text-[12px] font-medium tracking-normal text-[#5a5248]">
                  {group.label}
                </h2>
                {group.title ? (
                  <h3 className="mb-6 font-sans text-[clamp(28px,3.5vw,36px)] font-medium leading-[1.15] tracking-[-0.035em]">
                    {group.title}
                  </h3>
                ) : null}
                {group.intro ? (
                  <p className="m-0 font-sans text-[17px] leading-[1.65] text-[#6b6560]">{group.intro}</p>
                ) : null}
                {group.body ? (
                  <p className="m-0 font-sans text-[17px] leading-[1.65] text-[#404040]">{group.body}</p>
                ) : null}
                {group.image ? (
                  <img
                    src={group.image}
                    alt="Affinity map of interview notes grouped by visual impairment, preferred gaming method, pain points, and solutions."
                    className="mt-8 w-full"
                  />
                ) : null}
                {group.observations ? (
                  <ul className="m-0 mt-8 flex list-none flex-col gap-8 p-0">
                    {group.observations.map((observation) => {
                      const right = observation.side === "right";
                      return (
                        <li key={observation.name} className={`flex flex-col gap-2 ${right ? "items-end" : "items-start"}`}>
                          <p className={`m-0 font-sans text-[14px] text-[#8a847c] ${right ? "pr-[52px]" : "pl-[52px]"}`}>
                            {observation.name}
                          </p>
                          <div className={`flex items-center gap-3 ${right ? "flex-row-reverse" : ""}`}>
                            <img
                              src={observation.avatar}
                              alt=""
                              className="h-10 w-10 shrink-0 rounded-full object-cover"
                            />
                            <p className="m-0 max-w-[560px] rounded-2xl bg-[#eceae6] px-5 py-4 font-sans text-[16px] leading-[1.55] text-[#3f3a34]">
                              {observation.body}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
                {group.competitors ? (
                  <ul className="m-0 mt-8 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
                    {group.competitors.map((competitor) => (
                      <li
                        key={competitor.name}
                        className="flex flex-col gap-3.5 rounded-xl border border-[#1e1a15]/[0.08] bg-white px-3 pb-4 pt-3"
                      >
                        <div className="flex h-[120px] items-center justify-center overflow-hidden rounded-lg bg-[#f7f7f5] px-4 py-[18px]">
                          <CompetitorLogo logo={competitor.logo} />
                        </div>
                        <div className="px-3 pb-2">
                          <p className="mb-2 font-sans text-[16px] font-semibold leading-[1.3] text-[#1e1a15]">{competitor.name}</p>
                          <p className="m-0 font-sans text-[16px] leading-[1.55] text-[#404040]">{competitor.body}</p>
                          <p className="mb-1 mt-4 font-sans text-[16px] font-semibold leading-[1.3] text-[#1e1a15]">✅ Relevant Accessibility Features</p>
                          <ul className="m-0 list-disc pl-5 font-sans text-[16px] leading-[1.55] text-[#404040]">
                            {competitor.features.map((feature) => (
                              <li key={feature}>{feature}</li>
                            ))}
                          </ul>
                          <p className="mb-1 mt-4 font-sans text-[16px] font-semibold leading-[1.3] text-[#1e1a15]">❌ Limitations</p>
                          <ul className="m-0 list-disc pl-5 font-sans text-[16px] leading-[1.55] text-[#404040]">
                            {competitor.limitations.map((limitation) => (
                              <li key={limitation}>{limitation}</li>
                            ))}
                          </ul>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {group.insights ? (
                  <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
                    {group.insights.map((insight) => (
                      <li
                        key={insight.title}
                        className="flex flex-col gap-3.5 rounded-xl border border-[#1e1a15]/[0.08] bg-white px-3 pb-4 pt-3"
                      >
                        <div className="flex h-[120px] items-center justify-center overflow-hidden rounded-lg bg-[#f7f7f5] px-4 py-[18px]">
                          <InsightSnap kind={insight.visual} />
                        </div>
                        <div className="px-3 pb-2">
                          <p className="mb-2 font-sans text-[16px] font-semibold leading-[1.3] text-[#1e1a15]">{insight.title}</p>
                          <p className="m-0 font-sans text-[16px] leading-[1.55] text-[#404040]">{insight.body}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </section>
        ) : null}

        <section id="final-product" className="mb-20 scroll-mt-24">
          <p className={`mb-5 font-mono text-[14px] font-medium tracking-normal ${active === "final-product" ? "text-[#0066cc]" : "text-[#8a8a8a]"}`}>
            Final product
          </p>
          <h2 className="mb-6 font-sans text-[clamp(28px,3.5vw,36px)] font-medium leading-[1.15] tracking-[-0.035em]">
            {layout.finalTitle}
          </h2>
          <p className="mb-6 font-sans text-[17px] leading-[1.65] text-[#404040]">{study.desc}</p>
          {study.id === "tokyo-afterfall" ? (
            <LoopingClip src="/tokyo-prototype.mp4" alt={study.title} />
          ) : (
            <figure className="m-0">
              <CoverMedia src={visual} alt={study.title} className="w-full rounded-2xl" />
            </figure>
          )}
        </section>

        <section id="impact" className="mb-20 scroll-mt-24">
          <p className={`mb-5 font-mono text-[14px] font-medium tracking-normal ${active === "impact" ? "text-[#0066cc]" : "text-[#8a8a8a]"}`}>
            Impact
          </p>
          <h2 className="mb-6 font-sans text-[clamp(28px,3.5vw,36px)] font-medium leading-[1.15] tracking-[-0.035em]">
            {layout.impactTitle}
          </h2>
          <p className="font-sans text-[17px] leading-[1.65] text-[#404040]">{layout.impactBody}</p>
        </section>

        <p className="mt-16 text-center font-sans text-2xl font-medium tracking-[-0.03em] text-[#1e1a15]/25">thanks for reading</p>

        <div className="mt-14 border-t border-[#e7e2da] pt-14">
          <p className="font-mono text-[14px] font-medium tracking-normal text-[#b5b5b5]">
            Up next
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {next.map((item) => (
              <Link
                key={item.id}
                to={`/case/${item.id}`}
                className="flex flex-col rounded-[16px] bg-white/55 p-2 text-inherit no-underline shadow-[0_1px_8px_rgba(0,0,0,0.05)] backdrop-blur-md transition hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(0,0,0,0.09)]"
              >
                <div
                  className="aspect-video w-full rounded-lg bg-cover bg-center"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                <div className="flex flex-col gap-3 px-3.5 pb-3 pt-4">
                  <span className="font-sans text-[15px] font-medium">{item.client}</span>
                  <span className="font-sans text-[26px] font-medium leading-[1.1] tracking-[-0.03em]">{item.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
