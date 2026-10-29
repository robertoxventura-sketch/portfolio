import { useEffect, useLayoutEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cases } from "../data/cases";
import { CoverMedia } from "./CoverMedia";

type Mode = "hidden" | "stacking" | "emerge" | "settled" | "leaving";

export function CaseGrid({
  revealed,
  leaving,
  onSettled,
}: {
  revealed: boolean;
  leaving: boolean;
  onSettled: () => void;
}) {
  const [mode, setMode] = useState<Mode>("hidden");

  useLayoutEffect(() => {
    if (!revealed) {
      setMode("hidden");
      return;
    }
    if (leaving) {
      setMode("leaving");
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-work-card]"));
    if (reduce || window.innerWidth <= 480 || cards.length === 0) {
      setMode("settled");
      onSettled();
      return;
    }

    const v = window.innerWidth / 2;
    const k = window.innerHeight * 0.44;
    cards.forEach((card, q) => {
      const g = card.getBoundingClientRect();
      const cx = g.left + g.width / 2;
      const cy = g.top + g.height / 2;
      const s = q - (cards.length - 1) / 2;
      card.style.setProperty("--sx", `${v - cx + s * 9}px`);
      card.style.setProperty("--sy", `${k - cy - Math.abs(s) * 3}px`);
      card.style.setProperty("--srot", `${s * 2.5}deg`);
      card.style.animationDelay = `${q * 95}ms`;
    });
    setMode("stacking");

    const stackMs = (cards.length - 1) * 95 + 325;
    const dealMs = 850 + (cards.length - 1) * 30;
    const toEmerge = window.setTimeout(() => {
      cards.forEach((card, q) => {
        card.style.animationDelay = `${q * 30}ms`;
      });
      setMode("emerge");
    }, stackMs);
    const toSettled = window.setTimeout(() => {
      setMode("settled");
      onSettled();
    }, stackMs + dealMs);

    return () => {
      window.clearTimeout(toEmerge);
      window.clearTimeout(toSettled);
    };
  }, [revealed, leaving, onSettled]);

  useEffect(() => {
    if (mode !== "leaving") return;
    const cards = document.querySelectorAll<HTMLElement>("[data-work-card]");
    cards.forEach((card) => {
      card.style.animationDelay = "0ms";
    });
  }, [mode]);

  if (!revealed && !leaving) return null;

  const cardClass =
    mode === "stacking"
      ? "is-stacking"
      : mode === "emerge"
        ? "is-emerging"
        : mode === "leaving"
          ? "is-leaving"
          : "";

  return (
    <section id="case-grid" className="relative z-10 w-full px-4 pb-40 pt-28 sm:px-10 sm:pt-32">
      <div className="mx-auto grid w-full max-w-[1120px] grid-cols-1 gap-6 sm:grid-cols-2">
        {cases.map((c) => (
          <Link
            key={c.id}
            to={`/case/${c.id}`}
            data-work-card
            className={`work-card group relative flex origin-center flex-col rounded-[20px] bg-white/55 p-2 text-inherit no-underline shadow-[0_1px_8px_rgba(0,0,0,0.05)] backdrop-blur-md ${cardClass} ${
              mode === "settled"
                ? "is-interactive opacity-100 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_30px_70px_-28px_rgba(0,0,0,0.28)]"
                : mode === "hidden"
                  ? "opacity-0"
                  : ""
            }`}
          >
            <div
              className={`aspect-video w-full shrink-0 overflow-hidden rounded-lg ${
                c.id === "one-care" ? "bg-black" : ""
              }`}
            >
              <CoverMedia
                src={c.cover ?? c.image}
                className={`work-thumb h-full w-full ${c.id === "one-care" ? "object-contain" : "object-cover"}`}
              />
            </div>
            <div className="flex flex-col gap-3.5 px-3.5 pb-3 pt-[18px]">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2.5 font-sans text-[15px] font-medium leading-none tracking-[-0.01em] text-foreground">
                  {c.client}
                </span>
                {c.status ? (
                  <span className="inline-flex items-center gap-[7px] whitespace-nowrap rounded-full border border-[#E9E9E9] bg-white px-3.5 py-1.5 font-mono text-[14px] uppercase tracking-[0.04em] text-[#1e1a15]">
                    <span
                      className={
                        c.status.tone === "concept"
                          ? "concept-dot"
                          : c.status.tone === "delivered"
                            ? "delivered-dot"
                            : "live-dot"
                      }
                      aria-hidden="true"
                    />
                    {c.status.label}
                  </span>
                ) : c.metrics[0] ? (
                  <span className="inline-flex items-center whitespace-nowrap rounded-full border border-[#E9E9E9] bg-white/80 px-2.5 py-1 font-mono text-[13px] uppercase tracking-[0.04em] text-foreground">
                    {c.metrics[0].value}
                  </span>
                ) : null}
              </div>
              <h2 className="font-sans text-[26px] font-medium leading-[1.1] tracking-[-0.035em] text-foreground sm:text-[32px]">
                {c.title}
              </h2>
              <div className={`work-reveal ${mode === "settled" ? "is-ready" : ""}`}>
                <div className="overflow-hidden">
                  <p className="font-sans text-[15px] leading-[1.55] text-[#5c564e]">
                    {c.hoverSummary ?? c.desc}
                  </p>
                  {c.hoverTags && c.hoverTags.length > 0 && (
                    <div className="mt-3.5 flex flex-wrap gap-2 pb-1">
                      {c.hoverTags.map((tag, index) => (
                        <span
                          key={tag}
                          className="work-pill inline-flex items-center rounded-full border border-[#E4E4E4] bg-white/90 px-3 py-1 font-sans text-[13px] font-medium leading-none text-foreground"
                          style={{ transitionDelay: `${index * 60}ms` }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
