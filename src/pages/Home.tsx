import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { CaseGrid } from "../components/CaseGrid";
import { FolderDock } from "../components/FolderDock";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { ProfilePanel } from "../components/ProfilePanel";
import { cases } from "../data/cases";
import { isVideoSrc, posterSrc, usePrefersReducedMotion } from "../lib/media";

type HomeView = "hero" | "hero-leaving" | "works" | "works-leaving" | "profile";

function CoverPreload() {
  const reduce = usePrefersReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const win = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (win.requestIdleCallback) {
      const id = win.requestIdleCallback(() => setReady(true), { timeout: 900 });
      return () => win.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(() => setReady(true), 500);
    return () => window.clearTimeout(id);
  }, []);

  if (!ready) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute left-0 top-0 -z-10 h-px w-px overflow-hidden opacity-0">
      {cases.map((item) => {
        const src = item.cover ?? item.image;
        if (!isVideoSrc(src)) {
          return <img key={item.id} src={src} alt="" decoding="async" />;
        }
        return (
          <span key={item.id}>
            <img src={posterSrc(src)} alt="" decoding="async" />
            {reduce ? null : <video src={src} poster={posterSrc(src)} preload="auto" muted playsInline />}
          </span>
        );
      })}
    </div>
  );
}

function viewFromLocation(state: unknown): HomeView {
  const requested = (state as { view?: string } | null)?.view;
  if (requested === "works") return "works";
  if (requested === "profile") return "profile";
  return "hero";
}

export function Home() {
  const location = useLocation();
  const [view, setView] = useState<HomeView>(() => viewFromLocation(location.state));
  const [worksSettled, setWorksSettled] = useState(false);
  const viewRef = useRef(view);
  const settledRef = useRef(worksSettled);
  viewRef.current = view;
  settledRef.current = worksSettled;

  const onWorksSettled = useCallback(() => setWorksSettled(true), []);

  const leaveTimer = useRef(0);

  const goToWorks = useCallback(() => {
    const current = viewRef.current;
    if (current === "works" || current === "hero-leaving" || current === "works-leaving") return;
    setWorksSettled(false);
    window.scrollTo({ top: 0 });
    if (current === "hero") {
      setView("hero-leaving");
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = window.setTimeout(() => setView("works"), 310);
      return;
    }
    setView("works");
  }, []);

  const goToProfile = useCallback(() => {
    const current = viewRef.current;
    if (current === "profile" || current === "hero-leaving" || current === "works-leaving") return;
    window.scrollTo({ top: 0 });
    if (current === "hero") {
      setView("hero-leaving");
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = window.setTimeout(() => setView("profile"), 310);
      return;
    }
    setView("profile");
  }, []);

  const goToHero = useCallback(() => {
    if (viewRef.current !== "works" || !settledRef.current) return;
    setView("works-leaving");
    window.setTimeout(() => {
      setView("hero");
      setWorksSettled(false);
      window.scrollTo({ top: 0 });
    }, 430);
  }, []);

  useEffect(() => {
    const lock = view === "hero" || view === "hero-leaving" || view === "works-leaving" || !worksSettled;
    document.documentElement.style.overflow = lock ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [view, worksSettled]);

  useEffect(() => {
    let down = 0;
    let up = 0;
    let coolUntil = 0;
    let touchStartY = 0;

    const onWheel = (event: WheelEvent) => {
      const current = viewRef.current;
      if (current === "hero") {
        event.preventDefault();
        if (event.deltaY > 0) {
          down += event.deltaY;
          if (down >= 40) {
            down = 0;
            goToWorks();
          }
        } else {
          down = 0;
        }
        return;
      }
      if (current === "hero-leaving" || current === "works-leaving" || (current === "works" && !settledRef.current)) {
        event.preventDefault();
        return;
      }
      if (current === "works" && settledRef.current && window.scrollY <= 1 && event.deltaY < 0) {
        if (Date.now() < coolUntil) return;
        event.preventDefault();
        up += Math.abs(event.deltaY);
        if (up >= 60) {
          up = 0;
          goToHero();
        }
        return;
      }
      if (event.deltaY > 0) {
        up = 0;
        coolUntil = Date.now() + 600;
      }
    };

    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };

    const onTouchEnd = (event: TouchEvent) => {
      const endY = event.changedTouches[0]?.clientY ?? touchStartY;
      const delta = touchStartY - endY;
      if (viewRef.current === "hero" && delta > 48) goToWorks();
      if (viewRef.current === "works" && settledRef.current && window.scrollY <= 1 && delta < -48) goToHero();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [goToHero, goToWorks]);

  useEffect(() => {
    const onHome = () => {
      window.clearTimeout(leaveTimer.current);
      setWorksSettled(false);
      setView("hero");
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("portfolio-home", onHome);
    return () => window.removeEventListener("portfolio-home", onHome);
  }, []);

  return (
    <div className="relative isolate min-h-screen bg-background text-foreground overflow-x-clip">
      <Header />
      <CoverPreload />

      {(view === "hero" || view === "hero-leaving") && (
        <div
          className={`mx-auto flex min-h-dvh max-w-6xl flex-col justify-center px-4 pb-32 pt-24 sm:px-6 lg:px-8 3xl:max-w-7xl 4xl:max-w-[1700px] ${
            view === "hero-leaving" ? "hero-leaving" : ""
          }`}
        >
          <div className="mx-auto w-fit max-w-full">
            <Hero />
            <p className="mt-10 text-center font-sans text-caption text-muted-foreground sm:mt-12">
              Built with{" "}
              <a
                href="https://cursor.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 transition-colors hover:text-foreground hover:underline"
              >
                Cursor
              </a>{" "}
              · 2026
            </p>
          </div>
        </div>
      )}

      <CaseGrid
        revealed={view === "works" || view === "works-leaving"}
        leaving={view === "works-leaving"}
        onSettled={onWorksSettled}
      />

      {view === "profile" && <ProfilePanel />}

      <FolderDock
        active={
          view === "works" || view === "works-leaving"
            ? "works"
            : view === "profile"
              ? "profile"
              : null
        }
        onWorks={goToWorks}
        onProfile={goToProfile}
      />

      <div id="slide-1" className="scroll-mt-20 h-px" />
    </div>
  );
}
