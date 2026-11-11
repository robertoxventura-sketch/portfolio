import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { cases, type CaseStudy } from "../data/cases";
import { posterSrc, useNearViewport, usePrefersReducedMotion } from "../lib/media";
import { CoverMedia } from "./CoverMedia";
import { CaseStudyDock } from "./FolderDock";
import { InterviewExplorer } from "./InterviewExplorer";

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
  editorial?: boolean;
  placeholderMedia?: boolean;
  openTitle?: string;
  railNote?: string;
  facts?: { label: string; value: string }[];
  prototype?: string;
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
      lead?: boolean;
      board?: boolean;
      slot?: boolean;
      featureLabel?: string;
      limitationLabel?: string;
      title?: string;
      body?: string;
      intro?: string;
      videos?: { title: string; href?: string }[];
      notes?: { index: string; title: string; body: string }[];
      image?: string;
      insights?: { title: string; body: string; visual?: "contrast" | "hud" | "color" | "audio" }[];
      competitors?: { name: string; cover?: string; logo?: boolean; logoSurface?: "dark"; logoFit?: "word"; body: string; features: string[]; limitations: string[] }[];
    }[];
  };
  finalTitle: string;
  finalBody?: ReactNode;
  impactLabel?: string;
  impactTitle: string;
  impactBody: string;
  aheadTitle?: string;
  aheadBody?: string[];
};

const layouts: Record<string, StudyLayout> = {
  "table-redesign": {
    editorial: true,
    placeholderMedia: true,
    openTitle: "Redesigning the Roommate Matching Experience",
    railNote: "Redesigning the roommate matching experience.",
    facts: [
      { label: "Timeline", value: "Oct 2025 – Dec 2025" },
      { label: "Role", value: "Product Designer" },
      { label: "Type", value: "Web Application" },
      { label: "Team", value: "Roberto Ventura\nHiyab Woldegebriel" },
    ],
    overview:
      "PadPal is a 0→1 roommate-matching platform designed to make finding compatible roommates safer and more efficient. A preference survey filters candidates based on essential criteria and ranks potential matches using weighted compatibility scores. Mandatory identity verification compares a live selfie against a submitted ID before users can access the matching experience. PadPal is currently live and publicly accessible.",
    tags: ["Responsive Web App"],
    meta: [
      { label: "My Role", value: "Product Designer" },
      { label: "Timeline", value: "Oct 2025 – Dec 2025" },
      { label: "Roles", value: "Product Designer\nSoftware Engineer" },
      { label: "Team", value: "Roberto Ventura\nHiyab Woldegebriel" },
    ],
    problemTitle: "Finding a compatible roommate can be time-consuming and uncertain.",
    problemBody:
      "People commonly turn to social media and dedicated roommate-matching platforms to find potential roommates. However, social media often lacks effective ways to identify candidates who meet essential living requirements and personal preferences, while inconsistent identity verification across both types of platforms creates uncertainty about who users are interacting with. These limitations can prolong the roommate search process and make it difficult for users to confidently evaluate potential roommates.",
    northStarLabel: "Design challenge",
    northStar:
      "How might we help people efficiently identify compatible roommates while increasing confidence in who they are interacting with?",
    solutions: [
      {
        title: "Compatibility-Based Matching",
        body: "Users complete a preference survey that establishes essential living requirements and lifestyle preferences. Essential criteria filter out incompatible candidates, while weighted compatibility scores rank the remaining potential roommates based on how closely their preferences align.",
      },
      {
        title: "Mandatory Identity Verification",
        body: "Before accessing roommate discovery, users complete an identity verification process that compares a live selfie with a submitted government-issued ID. This requirement helps establish that users are representing their identities accurately before interacting with potential roommates.",
      },
      {
        title: "Streamlined Roommate Evaluation",
        body: "Users browse compatible candidates through a swipe-based discovery feed featuring profiles that highlight personal interests and living preferences. Visual feedback and onboarding guidance help users navigate profiles and evaluate potential roommates more efficiently.",
      },
    ],
    research: {
      groups: [
        {
          id: "competitive-analysis",
          label: "Competitive analysis",
          lead: true,
          body: "I selected two social platforms, Facebook Groups and Reddit, and two dedicated roommate-search platforms, Roommates.com and SpareRoom, to evaluate how existing services support compatibility assessment and identity verification. These platforms were chosen for their distinct approaches to roommate discovery, ranging from community-based listings to specialized search and matching tools, allowing me to compare how users identify, evaluate, and connect with potential roommates.",
          featureLabel: "Pros",
          limitationLabel: "Cons",
          competitors: [
            {
              name: "Facebook Groups",
              cover: "/competitors/facebook.svg",
              logo: true,
              body: "",
              features: [
                "Community-based discovery: Users can find roommate listings within location-specific housing groups.",
                "Direct communication: Users can contact potential roommates through comments or Messenger.",
              ],
              limitations: [
                "Limited Listing Filters: Facebook Groups often combine property listings and roommate requests within the same feed, requiring users seeking roommates to manually review irrelevant posts to identify suitable candidates.",
                "Limited Identity Assurance: Facebook's account registration relies on email or phone number confirmation, which verifies access to contact information but does not establish whether users are accurately representing their real-world identities.",
              ],
            },
            {
              name: "Roommates.com",
              cover: "/competitors/roommates.png",
              logo: true,
              logoSurface: "dark",
              body: "",
              features: [
                "Roommate-Specific Filtering: Users can narrow their search based on criteria such as location, budget, and living preferences, helping identify potentially compatible roommates.",
                "Compatibility Matching: The platform uses profile information and user preferences to suggest potential roommate matches.",
              ],
              limitations: [
                "Optional Identity Verification: Users can access roommate-matching features without completing identity verification, leaving uncertainty about the identities of potential roommates.",
                "Inconsistent Preference Matching: Users have reported receiving matches that conflict with their stated preferences, requiring additional effort to identify suitable roommates.",
              ],
            },
            {
              name: "SpareRoom",
              cover: "/competitors/spareroom.svg",
              logo: true,
              logoFit: "word",
              body: "",
              features: [
                "Advanced Search Filters: Users can narrow results by location, budget, and lifestyle preferences to identify suitable living arrangements.",
                "Separate Search Categories: Users can browse available rooms and roommate-seeker listings separately, reducing irrelevant results and making searches more focused.",
              ],
              limitations: [
                "Optional Paid Verification: Users can search for roommates and post listings without verifying their identity through government-issued identification, leaving uncertainty about who they are interacting with.",
                "Restricted Communication: Free users face limitations when contacting newly posted listings, potentially delaying communication with prospective roommates.",
              ],
            },
            {
              name: "Reddit",
              cover: "/competitors/reddit.svg",
              logo: true,
              body: "",
              features: [
                "Topic-Based Discovery: Users can find roommate requests and housing listings within subreddits focused on specific locations or topics.",
                "Search & Post Filtering: Users can search by keywords and sort posts to locate relevant housing discussions.",
              ],
              limitations: [
                "Limited Compatibility Filtering: Users cannot systematically filter roommate requests by essential living preferences, requiring them to manually evaluate potential candidates.",
                "Limited Identity Assurance: Reddit's pseudonymous account system allows users to interact without publicly establishing their real-world identities, creating uncertainty when evaluating potential roommates.",
              ],
            },
          ],
        },
        {
          id: "secondary-research",
          label: "Secondary research",
          title: "Placeholder",
          body: "Placeholder",
          videos: [{ title: "Placeholder" }, { title: "Placeholder" }],
          notes: [
            { index: "01", title: "Placeholder", body: "Placeholder" },
            { index: "02", title: "Placeholder", body: "Placeholder" },
            { index: "03", title: "Placeholder", body: "Placeholder" },
          ],
        },
        {
          id: "user-interviews",
          label: "User interviews",
          title: "Placeholder",
          body: "Placeholder",
          slot: true,
        },
        {
          id: "findings",
          label: "Findings",
          insights: [
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
        },
      ],
    },
    finalTitle: "PadPal",
    finalBody: (
      <>
        The live PadPal product brings together a{" "}
        <strong className="font-semibold text-[#1e1a15]">preference survey</strong> that filters candidates and ranks
        compatible matches, and <strong className="font-semibold text-[#1e1a15]">identity verification</strong> that
        confirms a user before they can connect.
      </>
    ),
    impactLabel: "Reflection",
    impactTitle: "What I Learned",
    impactBody: "Placeholder",
    aheadTitle: "Looking Ahead",
    aheadBody: ["Placeholder"],
  },
  "tokyo-afterfall": {
    editorial: true,
    openTitle: "Accessibility Features for Visually Impaired Players",
    facts: [
      { label: "Timeline", value: "2 Weeks" },
      { label: "Role", value: "Product Designer" },
      { label: "Type", value: "Personal Project" },
      { label: "Team", value: "Solo" },
    ],
    prototype: "/tokyo-prototype.mp4?v=2",
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
        image: "/tokyo-high-contrast.mp4?v=3",
      },
      {
        title: "Scalable HUD Improves Gameplay Readability",
        body: "Players can enlarge their Heads-Up Display (HUD) to make gameplay information easier to read. By increasing the size of health bars, equipped weapon indicators, and collected currency displays, the feature aims to improve legibility for players with low vision and conditions such as presbyopia and astigmatism, helping them monitor their status during gameplay.",
        image: "/tokyo-scalable-hud.mp4?v=3",
      },
      {
        title: "Audio Cues Support Faster Reactions",
        body: "Players can enable audio cues to support faster response times during time-sensitive gameplay events. Paired with a high-visibility visual indicator, these sound-based alerts reduce reliance on visual processing and help players recognize and respond to threats, such as incoming enemy attacks.",
        image: "/tokyo-audio-cues.mp4?v=3",
        sound: true,
      },
    ],
    research: {
      groups: [
        {
          id: "accessibility-audit",
          label: "Accessibility Audit",
          lead: true,
          body: "I conducted an accessibility audit of the Nintendo Switch console and 3 of its top 5 best-selling games to assess the availability and effectiveness of visual accessibility features for players with low vision and color vision deficiencies.",
          competitors: [
            {
              name: "Nintendo Switch",
              cover: "/competitors/switch-cover.png",
              body: "",
              features: ["Display Color Customization", "Screen Zoom"],
              limitations: [
                "Display colors are limited to inverted colors and grayscale, without dedicated colorblind filters.",
                "Screen Zoom requires manual activation, potentially disrupting gameplay.",
                "No system-wide text scaling or HUD customization.",
              ],
            },
            {
              name: "The Legend of Zelda: Breath of the Wild",
              cover: "/competitors/breath-of-the-wild-cover.png",
              body: "",
              features: ["Normal / Pro HUD Modes", "Audio Cues"],
              limitations: [
                "Pro HUD reduces visual clutter by hiding nonessential HUD elements, but does not allow players to resize individual interface elements.",
                "Audio cues support navigation and provide some combat feedback, but are not consistently available.",
                "No additional settings are available to customize visual accessibility.",
              ],
            },
            {
              name: "Super Mario Odyssey",
              cover: "/competitors/mario-odyssey-cover.jpg",
              body: "",
              features: ["Assist Mode"],
              limitations: [
                "Assist Mode provides navigational guidance and reduces gameplay difficulty but does not offer visual interface customization.",
                "No dedicated settings for text scaling, HUD resizing, or color vision deficiencies.",
              ],
            },
            {
              name: "Super Smash Bros. Ultimate",
              cover: "/competitors/smash-bros-cover.jpg",
              body: "",
              features: ["Team Highlight"],
              limitations: [
                "Team Highlight is limited to team-based matches and does not provide consistent character highlighting across all game modes.",
                "No additional visual accessibility features are available.",
              ],
            },
          ],
        },
        {
          id: "secondary-research",
          label: "Secondary research",
          title: "Learning from James Rath's Experience with Visual Accessibility",
          body: "James Rath is a legally blind gamer and accessibility advocate with ocular albinism and nystagmus, affecting his visual clarity and stability. Drawing from his lived experience, he evaluates video game accessibility and has contributed accessibility feedback for The Last of Us Part II and Nintendo Switch hardware. His insights informed Tokyo Afterfall's approach to improving visual accessibility during gameplay.",
          videos: [
            {
              title: "Blind Gamer - What I Can and Can't See",
              href: "https://www.youtube.com/watch?v=Twr9S1KAMuQ",
            },
            {
              title: "How Blind People Play Videos Games",
              href: "https://www.youtube.com/watch?v=PJ1yiHkEL5c&t=908s",
            },
          ],
          notes: [
            {
              index: "01",
              title: "Magnification Requires Gameplay Interruptions",
              body: "James uses the Nintendo Switch's zoom feature to read dialogue in Pokémon, but notes that activating it can require stopping gameplay or opening a menu.",
            },
            {
              index: "02",
              title: "High Contrast Improves Visibility",
              body: "James highlights how Spider-Man Remastered and The Last of Us Part II use high-contrast settings to distinguish characters and essential gameplay elements from their surroundings.",
            },
            {
              index: "03",
              title: "Audio Feedback Supports Navigation",
              body: "James relies on sound to navigate Splatoon 2 and highlights how distinct audio cues in The Last of Us Part II help players locate nearby enemies and items.",
            },
          ],
        },
        {
          id: "user-interviews",
          label: "User interviews",
          board: true,
          title: "Listening to players with different visual needs.",
          body: "I conducted semi-structured interviews with 4 active gamers with visual impairments to understand how their visual needs shape handheld gameplay and where existing accessibility features fall short. I synthesized responses through affinity mapping to identify recurring patterns.",
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
    finalTitle: "Final Prototype",
    finalBody: (
      <>
        The final Tokyo Afterfall prototype brings together{" "}
        <strong className="font-semibold text-[#1e1a15]">three accessibility features</strong> to address visual
        barriers in handheld gameplay. <strong className="font-semibold text-[#1e1a15]">High Contrast Mode</strong>{" "}
        improves the visibility of key gameplay elements,{" "}
        <strong className="font-semibold text-[#1e1a15]">Scalable HUD</strong> lets players resize essential
        information, and <strong className="font-semibold text-[#1e1a15]">Audio Cues</strong> provide feedback beyond
        visual indicators. Together, these features give players{" "}
        <strong className="font-semibold text-[#1e1a15]">greater control over how they perceive and interact with gameplay</strong>{", "}
        while preserving the core experience.
      </>
    ),
    impactLabel: "Reflection",
    impactTitle: "What I Learned",
    impactBody:
      "My own experience with astigmatism inspired Tokyo Afterfall, but hearing about other players' experiences helped me realize that visual accessibility exists on a spectrum. What works for one player may not work for another, and this project reminded me that being a designer starts with understanding people. It's my responsibility to look beyond my own experiences, listen to those I'm designing for, and create solutions that make experiences more accessible to everyone.",
    aheadTitle: "Looking Ahead",
    aheadBody: [
      "I want to expand Tokyo Afterfall beyond visual accessibility by exploring visual auras that communicate audio cues for deaf and hard-of-hearing players, alongside haptic feedback, additional audio cues, and customizable instructions.",
      "I also plan to leverage AI to develop a more interactive, playable prototype that allows participants to experience a complete game level. This would enable more realistic usability testing, helping me evaluate how accessibility features perform during actual gameplay and refine them based on player feedback.",
    ],
  },
};

const solutionVideo = /\.(mov|mp4|webm|m4v)(\?.*)?$/i;

export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const impact = document.getElementById("impact");
      const end = impact
        ? Math.max(0, window.scrollY + impact.getBoundingClientRect().top - 32)
        : document.documentElement.scrollHeight - window.innerHeight;
      const progress = end > 0 ? Math.min(1, Math.max(0, window.scrollY / end)) : 1;
      bar.style.transform = `scaleX(${progress})`;
      bar.parentElement?.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-[3px]"
      role="progressbar"
      aria-label="Case study progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    >
      <div ref={barRef} className="h-full w-full origin-left bg-[var(--brand)]" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}

function LoopingClip({
  src,
  alt,
  sound = false,
  active = true,
  playback = false,
}: {
  src: string;
  alt: string;
  sound?: boolean;
  active?: boolean;
  playback?: boolean;
}) {
  const [videoRef, near] = useNearViewport<HTMLVideoElement>("480px");
  const reduce = usePrefersReducedMotion();
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const [requested, setRequested] = useState(false);
  const loadVideo = near && (!reduce || requested);
  const activeRef = useRef(active);
  const progressRef = useRef<HTMLSpanElement>(null);
  activeRef.current = active;

  useEffect(() => {
    if (reduce) setPaused(true);
  }, [reduce]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onPlay = () => setPaused(false);
    const onPause = () => setPaused(true);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    if (!loadVideo) {
      if (video.dataset.src) {
        delete video.dataset.src;
        video.removeAttribute("src");
        video.load();
      }
      return () => {
        video.removeEventListener("play", onPlay);
        video.removeEventListener("pause", onPause);
      };
    }
    video.preload = "auto";
    video.muted = true;
    setMuted(true);
    if (video.dataset.src !== src) {
      video.dataset.src = src;
      video.src = src;
    }
    const play = () => {
      if (!activeRef.current) return;
      void video.play().catch(() => setPaused(true));
    };
    if (!reduce || requested) {
      if (video.readyState >= 2) play();
      else video.addEventListener("loadeddata", play, { once: true });
    }
    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("loadeddata", play);
    };
  }, [src, loadVideo, reduce, requested, videoRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !loadVideo) return;
    if (!active) {
      video.pause();
      return;
    }
    if (reduce && !requested) return;
    void video.play().catch(() => setPaused(true));
  }, [active, loadVideo, reduce, requested, videoRef]);

  useEffect(() => {
    if (!playback) return;
    const video = videoRef.current;
    const bar = progressRef.current;
    if (!video || !bar) return;
    let frame = 0;
    let running = false;
    const paint = () => {
      const duration = video.duration;
      const progress = duration && Number.isFinite(duration) ? Math.min(1, Math.max(0, video.currentTime / duration)) : 0;
      bar.style.transform = `scaleX(${progress})`;
      bar.parentElement?.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
    };
    const loop = () => {
      paint();
      if (running) frame = requestAnimationFrame(loop);
    };
    const onPlay = () => {
      running = true;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(loop);
    };
    const onPause = () => {
      running = false;
      cancelAnimationFrame(frame);
      paint();
    };
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onPause);
    video.addEventListener("loadedmetadata", paint);
    video.addEventListener("seeked", paint);
    if (video.paused) paint();
    else onPlay();
    return () => {
      running = false;
      cancelAnimationFrame(frame);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onPause);
      video.removeEventListener("loadedmetadata", paint);
      video.removeEventListener("seeked", paint);
    };
  }, [playback, loadVideo, src, videoRef]);

  const togglePlayback = () => {
    if (!loadVideo) {
      setRequested(true);
      setPaused(false);
      return;
    }
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

  const replay = () => {
    if (!loadVideo) {
      setRequested(true);
      setPaused(false);
      return;
    }
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    void video.play().catch(() => setPaused(true));
  };

  return (
    <figure className="cs-clip relative m-0 overflow-hidden rounded-lg">
      <video
        ref={videoRef}
        poster={posterSrc(src)}
        className="aspect-video w-full object-cover"
        autoPlay={!reduce}
        loop
        muted={muted}
        playsInline
        preload="none"
        aria-label={alt}
      />
      {playback ? (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[8] h-[5px]"
          role="progressbar"
          aria-label="Prototype progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={0}
        >
          <span ref={progressRef} className="block h-full w-full origin-left bg-[#b5b3b1]" style={{ transform: "scaleX(0)" }} />
        </div>
      ) : null}
      <div className="cs-clip-controls" data-open={paused || (sound && !muted) ? "true" : undefined}>
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
        {playback ? (
          <button type="button" className="cs-clip-btn" aria-label="Replay video" onClick={replay}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4.5 12a7.5 7.5 0 1 0 2.05-5.15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 4.75V9.2h4.45" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : null}
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
      </div>
    </figure>
  );
}

function AuditPoint({ text }: { text: string }) {
  const split = text.indexOf(": ");
  if (split === -1) return text;
  return (
    <>
      <span className="cs-audit-point">{text.slice(0, split)}</span>
      {text.slice(split)}
    </>
  );
}

function MediaSlot({ label = "Image", className = "" }: { label?: string; className?: string }) {
  return (
    <div className={`cs-media-slot${className ? ` ${className}` : ""}`} role="img" aria-label={`${label} placeholder`}>
      <span>{label}</span>
    </div>
  );
}

function SolutionArrow({
  direction,
  label,
  onClick,
}: {
  direction: "previous" | "next";
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`absolute top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-white p-0 text-[#151515] shadow-[0_4px_18px_rgba(21,21,21,0.12)] transition-transform duration-150 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e1a15] ${direction === "previous" ? "-left-[52px]" : "-right-[52px]"}`}
      aria-label={label}
      onClick={onClick}
    >
      <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d={direction === "previous" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </button>
  );
}

function SolutionCarousel({ items }: { items: NonNullable<StudyLayout["solutions"]> }) {
  const [index, setIndex] = useState(0);
  const reduce = usePrefersReducedMotion();
  const count = items.length;
  const item = items[index] ?? items[0];

  const go = (nextIndex: number) => {
    setIndex(Math.min(count - 1, Math.max(0, nextIndex)));
  };

  if (!item) return null;

  return (
    <div
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          go(index + 1);
        } else if (event.key === "ArrowLeft") {
          event.preventDefault();
          go(index - 1);
        }
      }}
    >
      <div aria-live="polite" aria-atomic="true">
        <div key={item.title} className="solution-copy">
          <h2 className="mb-6 font-sans text-[clamp(28px,3.5vw,36px)] font-medium leading-[1.15] tracking-[-0.035em]">
            {item.title}
          </h2>
          <p className="mb-10 font-sans text-[17px] leading-[1.65] text-[#404040]">{item.body}</p>
        </div>
      </div>
      <div className="relative">
        <div className="overflow-hidden rounded-xl">
          <div
            className="flex w-full"
            style={{
              transform: `translateX(-${index * 100}%)`,
              transition: reduce ? undefined : "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {items.map((slide, slideIndex) => (
              <div
                key={slide.title}
                className="w-full shrink-0"
                aria-hidden={slideIndex !== index}
                inert={slideIndex !== index}
              >
                {slide.image ? (
                  solutionVideo.test(slide.image) ? (
                    <LoopingClip
                      src={slide.image}
                      alt={slide.title}
                      sound={slide.sound}
                      active={slideIndex === index}
                    />
                  ) : (
                    <figure className="m-0 overflow-hidden">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="aspect-video w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </figure>
                  )
                ) : (
                  <MediaSlot label="Image" />
                )}
              </div>
            ))}
          </div>
        </div>
        {count > 1 && index > 0 ? (
          <SolutionArrow direction="previous" label="Previous solution" onClick={() => go(index - 1)} />
        ) : null}
        {count > 1 && index < count - 1 ? (
          <SolutionArrow direction="next" label="Next solution" onClick={() => go(index + 1)} />
        ) : null}
      </div>
      {count > 1 ? (
        <div className="mt-3 flex items-center justify-center" role="group" aria-label="Choose solution">
          {items.map((slide, slideIndex) => (
            <button
              key={slide.title}
              type="button"
              className="grid h-6 w-4 cursor-pointer place-items-center rounded-full border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e1a15]"
              aria-label={`Show solution ${slideIndex + 1}: ${slide.title}`}
              aria-current={slideIndex === index ? "true" : undefined}
              onClick={() => go(slideIndex)}
            >
              <span
                aria-hidden="true"
                className={`size-1.5 rounded-full transition-colors duration-150 ${slideIndex === index ? "bg-[#151515]" : "bg-[#878787]"}`}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
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

function ExpandableImage({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      triggerRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="cs-zoom"
        aria-label={`View larger: ${alt}`}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <img src={src} alt="" width={1024} height={626} decoding="async" />
        <span className="cs-zoom-cue" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
            <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      {open
        ? createPortal(
            <div className="cs-lightbox-backdrop" onClick={() => setOpen(false)}>
              <div
                role="dialog"
                aria-modal="true"
                aria-label={alt}
                className="cs-lightbox"
                onClick={(event) => event.stopPropagation()}
              >
                <p className="sr-only">Expanded image. Press Escape to close.</p>
                <img src={src} alt={alt} width={1024} height={626} />
                <button ref={closeRef} type="button" className="cs-lightbox-close" aria-label="Close" onClick={() => setOpen(false)}>
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

function statusDot(tone: NonNullable<CaseStudy["status"]>["tone"]) {
  if (tone === "concept") return "concept-dot";
  if (tone === "delivered") return "delivered-dot";
  return "live-dot";
}

function FactValue({ value }: { value: string }) {
  return (
    <>
      {value.split("\n").map((line, index) => (
        <span key={line}>
          {index > 0 ? <br /> : null}
          {line}
        </span>
      ))}
    </>
  );
}

export function RoommateCaseStudy({ study }: { study: CaseStudy }) {
  const layout = layouts[study.id];
  const editorial = Boolean(layout?.editorial);
  const pageSections = [
    ...leadSections.filter((section) => section.id !== "background" || layout?.backgroundTitle),
    ...(layout?.solutions?.length ? [{ id: "solution", label: "Solution" }] : []),
    ...(layout?.research ? [{ id: "research", label: "Research" }] : []),
    ...tailSections.map((section) =>
      section.id === "impact" && layout?.impactLabel ? { ...section, label: layout.impactLabel } : section,
    ),
  ];
  const [active, setActive] = useState(pageSections[0].id);
  const next = cases.filter((item) => item.id !== study.id);
  const visual = layout?.placeholderMedia
    ? ""
    : study.hero ?? (editorial && study.cover ? study.cover : study.image);
  const heroSrc = layout?.placeholderMedia ? study.cover ?? "" : visual;

  useEffect(() => {
    if (!editorial) return;
    const previous = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#ffffff";
    return () => {
      document.body.style.backgroundColor = previous;
    };
  }, [editorial]);

  const sectionKey = pageSections.map((section) => section.id).join(" ");

  useEffect(() => {
    const ids = sectionKey.split(" ");
    let frame = 0;

    const update = () => {
      frame = 0;
      const marker = Math.min(160, window.innerHeight * 0.28);
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const atBottom = scrollable > 0 && window.scrollY >= scrollable - 2;
      let current = ids[0];
      if (atBottom) {
        current = ids[ids.length - 1];
      } else {
        for (const id of ids) {
          const node = document.getElementById(id);
          if (node && node.getBoundingClientRect().top <= marker) current = id;
        }
      }
      setActive((previous) => (previous === current ? previous : current));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("hashchange", onScroll);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("hashchange", onScroll);
    };
  }, [sectionKey]);

  if (!layout) return null;

  return (
    <div className={`min-h-screen ${editorial ? "cs-tokyo bg-white text-[#1e1a15]" : "bg-[#f7f7f5] text-[#1e1a15]"} ${study.id === "table-redesign" ? "cs-padpal" : ""}`}>
      <ReadingProgress />

      <aside className={`${editorial ? "cs-tokyo-rail " : ""}fixed left-10 top-8 z-40 hidden w-[180px] min-[1280px]:block`}>
        <Link
          to="/"
          state={{ view: "works" }}
          className={
            editorial
              ? "cs-tokyo-back"
              : "mb-8 inline-flex items-center gap-1 rounded-full border border-[#e4e4e4] bg-white px-3 py-1.5 font-sans text-[13px] text-[#1e1a15] shadow-sm"
          }
        >
          {editorial ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          )}
          Back
        </Link>
        {editorial ? (
          <>
            <p className="cs-tokyo-rail-title">{study.client}</p>
            <p className="cs-tokyo-rail-note">{layout.railNote ?? study.title}</p>
          </>
        ) : null}
        <nav className={editorial ? "cs-tokyo-toc" : "flex flex-col"} aria-label="Case study sections">
          {editorial ? <span className="cs-tokyo-toc-track" aria-hidden="true" /> : null}
          <div className={editorial ? "cs-tokyo-toc-links" : "contents"}>
          {pageSections.map((section) => {
            const researchOpen =
              section.id === "research" &&
              (active === "research" || layout?.research?.groups.some((group) => group.id === active));
            const isActive = section.id === "research" ? researchOpen : active === section.id;
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                aria-current={isActive ? "location" : undefined}
                className={
                  editorial
                    ? "cs-tokyo-toc-link"
                    : `py-1.5 font-sans text-[15px] tracking-normal no-underline transition-colors ${
                        isActive ? "font-medium text-[#1e1a15]" : "text-[#b0b0b0] hover:text-[#1e1a15]"
                      }`
                }
              >
                {section.label}
              </a>
            );
          })}
          </div>
        </nav>
      </aside>

      <div className={editorial ? "cs-tokyo-main" : "contents"}>
      <div className="cs-hero-visual" aria-hidden={heroSrc ? true : undefined}>
        {heroSrc ? <CoverMedia src={heroSrc} className="aspect-video w-full object-cover" /> : <MediaSlot label="Image" />}
      </div>
      {editorial && layout.openTitle ? (
        <header className="cs-tokyo-open">
          <p className="cs-tokyo-kicker">{study.client}</p>
          <h1 className="cs-tokyo-open-title">{layout.openTitle}</h1>
          {layout.facts?.length ? (
            <dl className="cs-tokyo-facts">
              {layout.facts.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>
                    <FactValue value={item.value} />
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </header>
      ) : null}
      <main className="cs-scroll-body mx-auto pb-28">
        {editorial ? null : (
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

        <section id="overview" className="mb-20 scroll-mt-8">
          {editorial ? (
            <div className="cs-tokyo-overview">
              <p className={`mb-5 font-mono text-[14px] font-medium tracking-normal ${active === "overview" ? "text-[var(--brand)]" : "text-[#8a8a8a]"}`}>
                Overview
              </p>
              <h2 className="mb-6 font-sans text-[clamp(28px,3.5vw,36px)] font-medium leading-[1.15] tracking-[-0.035em]">
                {study.client}
              </h2>
              <p className="cs-tokyo-overview-body">{layout.overview ?? study.desc}</p>
            </div>
          ) : (
            <>
          <p className={`mb-5 font-mono text-[14px] font-medium tracking-normal ${active === "overview" ? "text-[var(--brand)]" : "text-[#8a8a8a]"}`}>
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
        <section id="background" className="mb-20 scroll-mt-8">
          <p className={`mb-5 font-mono text-[14px] font-medium tracking-normal ${active === "background" ? "text-[var(--brand)]" : "text-[#8a8a8a]"}`}>
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

        <section id="problem" className="mb-20 scroll-mt-8">
          <p className={`mb-5 font-mono text-[14px] font-medium tracking-normal ${active === "problem" ? "text-[var(--brand)]" : "text-[#8a8a8a]"}`}>
            Problem
          </p>
          <h2 className="mb-6 font-sans text-[clamp(28px,3.5vw,36px)] font-medium leading-[1.15] tracking-[-0.035em]">
            {layout.problemTitle}
          </h2>
          <p className="mb-5 font-sans text-[17px] leading-[1.65] text-[#404040]">{layout.problemBody}</p>
          <div className={`rounded-xl border p-8${editorial ? " cs-spotlight border-[#1e1a15]/[0.08] bg-white" : " border-[#0066cc]/10 bg-[#0066cc]/[0.04]"}`}>
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
          <section id="solution" className="mb-20 scroll-mt-8">
            <p className={`mb-5 font-mono text-[14px] font-medium tracking-normal ${active === "solution" ? "text-[var(--brand)]" : "text-[#8a8a8a]"}`}>
              Solution
            </p>
            <SolutionCarousel items={layout.solutions} />
          </section>
        ) : null}

        {layout.research ? (
          <section id="research" className="mb-20 scroll-mt-8">
            <p className={`mb-5 font-mono text-[14px] font-medium tracking-normal ${active === "research" || layout.research.groups.some((group) => group.id === active) ? "text-[var(--brand)]" : "text-[#8a8a8a]"}`}>
              Research
            </p>
            {layout.research.groups.map((group, index) => (
              <div key={group.id} id={group.id} className={`scroll-mt-8 ${index > 0 ? "mt-14" : ""}`}>
                {group.lead ? (
                  <h3 className="mb-6 font-sans text-[clamp(28px,3.5vw,36px)] font-medium leading-[1.15] tracking-[-0.035em]">
                    {group.label}
                  </h3>
                ) : (
                  <h2 className="mb-4 font-mono text-[12px] font-medium tracking-normal text-[#5a5248]">
                    {group.label}
                  </h2>
                )}
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
                {group.videos ? (
                  <div className="cs-watch">
                    {group.videos.map((video, videoIndex) => {
                      const icon = (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M7 17 17 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                          <path d="M9 7h8v8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      );
                      return video.href ? (
                        <a
                          key={video.href}
                          className="cs-watch-link"
                          href={video.href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {video.title}
                          {icon}
                        </a>
                      ) : (
                        <div key={`${video.title}-${videoIndex}`} className="cs-watch-link is-placeholder">
                          {video.title}
                          {icon}
                        </div>
                      );
                    })}
                  </div>
                ) : null}
                {group.notes ? (
                  <ul className="cs-note-grid">
                    {group.notes.map((note) => (
                      <li key={note.index} className="cs-note-card cs-spotlight">
                        <p className="cs-note-index">{note.index}</p>
                        <h3>{note.title}</h3>
                        <p>{note.body}</p>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {group.board ? <InterviewExplorer /> : null}
                {group.slot ? <MediaSlot label="Image" className="cs-media-slot-board" /> : null}
                {group.image ? (
                  <ExpandableImage
                    src={group.image}
                    alt="Interview findings grouped by visual impairment, preferred method of gaming, pain points, and helpful accessibility features."
                  />
                ) : null}
                {group.competitors ? (
                  <ul className="cs-audit-grid">
                    {group.competitors.map((competitor, competitorIndex) => (
                      <li key={`${group.id}-${competitorIndex}`} className="cs-audit-card cs-spotlight">
                        <div>
                          <h3>{competitor.name}</h3>
                          {competitor.body ? <p>{competitor.body}</p> : null}
                        </div>
                        {competitor.cover ? (
                          competitor.logo ? (
                            <div className={`cs-audit-logo${competitor.logoSurface === "dark" ? " is-dark" : ""}${competitor.logoFit === "word" ? " is-word" : ""}`}>
                              <img src={competitor.cover} alt="" />
                            </div>
                          ) : (
                            <img
                              src={competitor.cover}
                              alt=""
                              loading="lazy"
                              decoding="async"
                              className="cs-audit-cover"
                            />
                          )
                        ) : (
                          <MediaSlot label="Image" className="cs-audit-cover" />
                        )}
                        <div className="cs-audit-foot">
                          <h3>{group.featureLabel ?? "Relevant Accessibility Features"}</h3>
                          <ul>
                            {competitor.features.map((feature) => (
                              <li key={feature}>
                                <AuditPoint text={feature} />
                              </li>
                            ))}
                          </ul>
                          <h3>{group.limitationLabel ?? "Limitations"}</h3>
                          <ul>
                            {competitor.limitations.map((limitation) => (
                              <li key={limitation}>
                                <AuditPoint text={limitation} />
                              </li>
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
                        className="cs-spotlight flex flex-col gap-3.5 rounded-xl border border-[#1e1a15]/[0.08] bg-white px-3 pb-4 pt-3"
                      >
                        <div className="flex h-[120px] items-center justify-center overflow-hidden rounded-lg bg-[#f7f7f5] px-4 py-[18px]">
                          {insight.visual ? <InsightSnap kind={insight.visual} /> : <MediaSlot label="Image" className="cs-media-slot-fill" />}
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

        <section id="final-product" className="mb-20 scroll-mt-8">
          <p className={`mb-5 font-mono text-[14px] font-medium tracking-normal ${active === "final-product" ? "text-[var(--brand)]" : "text-[#8a8a8a]"}`}>
            Final product
          </p>
          <h2 className="mb-6 font-sans text-[clamp(28px,3.5vw,36px)] font-medium leading-[1.15] tracking-[-0.035em]">
            {layout.finalTitle}
          </h2>
          <p className="mb-6 font-sans text-[17px] leading-[1.65] text-[#404040]">{layout.finalBody ?? study.desc}</p>
          {layout.prototype ? (
            <LoopingClip src={layout.prototype} alt={study.title} playback />
          ) : visual ? (
            <figure className="m-0">
              <CoverMedia src={visual} alt={study.title} className="w-full rounded-2xl" />
            </figure>
          ) : (
            <MediaSlot label="Image" />
          )}
        </section>

        <section id="impact" className="mb-20 scroll-mt-8">
          <p className={`mb-5 font-mono text-[14px] font-medium tracking-normal ${active === "impact" ? "text-[var(--brand)]" : "text-[#8a8a8a]"}`}>
            {layout.impactLabel ?? "Impact"}
          </p>
          {layout.impactTitle ? (
            layout.aheadTitle ? (
              <h3 className="cs-ahead mb-3 font-sans text-[#1e1a15]">{layout.impactTitle}</h3>
            ) : (
              <h2 className="mb-6 font-sans text-[clamp(28px,3.5vw,36px)] font-medium leading-[1.15] tracking-[-0.035em]">
                {layout.impactTitle}
              </h2>
            )
          ) : null}
          <p className="font-sans text-[17px] leading-[1.65] text-[#404040]">{layout.impactBody}</p>
          {layout.aheadTitle && layout.aheadBody ? (
            <>
              <h3 className="cs-ahead mb-3 mt-10 font-sans text-[#1e1a15]">{layout.aheadTitle}</h3>
              <div className="flex flex-col gap-4">
                {layout.aheadBody.map((paragraph) => (
                  <p key={paragraph} className="m-0 font-sans text-[17px] leading-[1.65] text-[#404040]">
                    {paragraph}
                  </p>
                ))}
              </div>
            </>
          ) : null}
        </section>

        {editorial ? (
          <p className="cs-conclusion">conclusion</p>
        ) : (
          <p className="mt-16 text-center font-sans text-2xl font-medium tracking-[-0.03em] text-[#1e1a15]/25">thanks for reading</p>
        )}

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
                <div className="aspect-video w-full overflow-hidden rounded-lg">
                  <img
                    src={item.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
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
      <CaseStudyDock />
    </div>
  );
}
