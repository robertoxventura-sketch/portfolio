import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";

const COLUMNS = [
  "Visual Impairment Conditions",
  "Preferred Method of Gaming",
  "Experienced Pain Points",
  "Helpful Accessibility Features",
] as const;

type Note = { title: string; subtitle?: string; body: string };

const PARTICIPANTS: { id: string; label: string; notes: Note[] }[] = [
  {
    id: "p1",
    label: "Participant 01",
    notes: [
      {
        title: "Myopia",
        subtitle: "Nearsightedness",
        body: "Close up objects can be seen clearly but distant objects can appear blurry.",
      },
      {
        title: "PC",
        subtitle: "Dual Monitor Desktop",
        body: "Prefers PC gaming because they can sit closer to their monitors and adjust display settings to make things easier to see.",
      },
      {
        title: "Difficulty Reading Game Interface",
        body: "Struggles to read smaller text and make out important information on screen, especially when checking menus or details during gameplay.",
      },
      {
        title: "God of War Ragnarök",
        subtitle: "Adjustable Text and Icon Sizes",
        body: "Appreciates being able to enlarge text and icons, making menus and important gameplay information easier to read.",
      },
    ],
  },
  {
    id: "p2",
    label: "Participant 02",
    notes: [
      {
        title: "Hyperopia",
        subtitle: "Farsightedness",
        body: "Distant objects can be seen clearly, close up objects can appear blurry.",
      },
      {
        title: "Console",
        subtitle: "Playstation 5",
        body: "Enjoys playing on a larger TV because it's easier for them to see what's happening in the game.",
      },
      {
        title: "Keeping Track of Gameplay",
        body: "Finds it difficult to keep track of enemies and other important details when there's a lot happening on screen, during action sequences.",
      },
      {
        title: "Marvel's Spider-Man: Miles Morales",
        subtitle: "High-Contrast Visuals",
        body: "Likes having the option to make characters stand out more from their surroundings when multiple characters are present.",
      },
    ],
  },
  {
    id: "p3",
    label: "Participant 03",
    notes: [
      {
        title: "Astigmatism",
        body: "Blurred or distorted vision at all distances.",
      },
      {
        title: "Portable Console",
        subtitle: "Nintendo Switch 1",
        body: "Enjoys the portability of the Nintendo Switch, allowing them to play games wherever they go without being tied to a television or monitor.",
      },
      {
        title: "Difficulty Seeing Gameplay Details",
        body: "Sometimes has trouble spotting items and following visual cues. Smaller icons and indicators can also be difficult to make out on the handheld screen.",
      },
      {
        title: "Hogwarts Legacy",
        subtitle: "High-Contrast Gameplay",
        body: "Finds the high-contrast setting helpful for spotting characters and important objects, especially when the environment makes them difficult to see.",
      },
    ],
  },
];

const MIN_ZOOM = 0.28;
const MAX_ZOOM = 1.75;
const CHROME = 68;

type View = { zoom: number; x: number; y: number };
type Size = { w: number; h: number };

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function fitView(width: number, height: number, world: Size): View {
  const padX = 28;
  const padTop = 20;
  const padBottom = 16 + CHROME;
  const viewW = Math.max(80, width - padX * 2);
  const viewH = Math.max(80, height - padTop - padBottom);
  const zoom = clamp(Math.min(viewW / world.w, viewH / world.h), MIN_ZOOM, MAX_ZOOM);
  return {
    zoom,
    x: (width - world.w * zoom) / 2,
    y: padTop + (viewH - world.h * zoom) / 2,
  };
}

function sameView(a: View, b: View) {
  return Math.abs(a.zoom - b.zoom) < 0.004 && Math.abs(a.x - b.x) < 0.75 && Math.abs(a.y - b.y) < 0.75;
}

export function InterviewExplorer() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const worldSize = useRef<Size>({ w: 1120, h: 920 });
  const touched = useRef(false);
  const viewRef = useRef<View>({ zoom: 1, x: 0, y: 0 });
  const drag = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const [view, setView] = useState<View>(viewRef.current);
  const [fitted, setFitted] = useState<View>(viewRef.current);
  const [ready, setReady] = useState(false);
  const [grabbing, setGrabbing] = useState(false);

  const commit = useCallback((next: View) => {
    viewRef.current = next;
    setView(next);
  }, []);

  const readFit = useCallback(() => {
    const canvas = canvasRef.current;
    const world = worldRef.current;
    if (!canvas || !world) return null;
    worldSize.current = { w: world.offsetWidth, h: world.offsetHeight };
    return fitView(canvas.clientWidth, canvas.clientHeight, worldSize.current);
  }, []);

  const zoomAt = useCallback(
    (factor: number, originX: number, originY: number) => {
      const current = viewRef.current;
      const zoom = clamp(current.zoom * factor, MIN_ZOOM, MAX_ZOOM);
      if (zoom === current.zoom) return;
      const ratio = zoom / current.zoom;
      touched.current = true;
      commit({
        zoom,
        x: originX * (1 - ratio) + current.x * ratio,
        y: originY * (1 - ratio) + current.y * ratio,
      });
    },
    [commit],
  );

  const reset = useCallback(() => {
    const next = readFit();
    if (!next) return;
    touched.current = false;
    setFitted(next);
    commit(next);
  }, [commit, readFit]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const world = worldRef.current;
    if (!canvas || !world) return;
    const measure = () => {
      if (canvas.clientWidth < 40 || canvas.clientHeight < 40) return;
      if (world.offsetWidth < 40 || world.offsetHeight < 40) return;
      worldSize.current = { w: world.offsetWidth, h: world.offsetHeight };
      const next = fitView(canvas.clientWidth, canvas.clientHeight, worldSize.current);
      setFitted(next);
      setReady(true);
      if (touched.current) return;
      commit(next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(canvas);
    observer.observe(world);
    return () => observer.disconnect();
  }, [commit]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      const rect = canvas.getBoundingClientRect();
      zoomAt(event.deltaY > 0 ? 1 / 1.12 : 1.12, event.clientX - rect.left, event.clientY - rect.top);
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const center = () => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    return { x: canvas.clientWidth / 2, y: canvas.clientHeight / 2 };
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    if ((event.target as HTMLElement).closest(".ix-chrome")) return;
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: viewRef.current.x,
      originY: viewRef.current.y,
    };
    setGrabbing(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;
    const dx = event.clientX - current.startX;
    const dy = event.clientY - current.startY;
    if (Math.hypot(dx, dy) < 4) return;
    touched.current = true;
    commit({ zoom: viewRef.current.zoom, x: current.originX + dx, y: current.originY + dy });
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;
    drag.current = null;
    setGrabbing(false);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      const point = center();
      zoomAt(1.25, point.x, point.y);
    } else if (event.key === "-" || event.key === "_") {
      event.preventDefault();
      const point = center();
      zoomAt(1 / 1.25, point.x, point.y);
    } else if (event.key === "0") {
      event.preventDefault();
      reset();
    }
  };

  const percent = Math.round(view.zoom * 100);
  const atFit = sameView(view, fitted);

  return (
    <div className="ix">
      <div
        className={`ix-frame${ready ? " is-ready" : ""}${grabbing ? " is-grabbing" : ""}`}
        role="region"
        aria-label="Interview findings map"
        onKeyDown={onKeyDown}
      >
        <div
          ref={canvasRef}
          className={`ix-canvas${grabbing ? " is-grabbing" : ""}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div
            ref={worldRef}
            className="ix-world"
            style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})` }}
          >
            {COLUMNS.map((label) => (
              <div key={label} className="ix-colhead">
                {label}
              </div>
            ))}
            {PARTICIPANTS.map((person) =>
              person.notes.map((note) => (
                <div key={`${person.id}-${note.title}`} className="ix-card">
                  <span className="ix-card-who">{person.label}</span>
                  <span className="ix-card-title">{note.title}</span>
                  {note.subtitle ? <span className="ix-card-sub">{note.subtitle}</span> : null}
                  <span className="ix-card-body">{note.body}</span>
                </div>
              )),
            )}
          </div>
          <div className="ix-chrome">
            <div className="ix-zoom" role="group" aria-label="Zoom">
              <span className="ix-zoom-name" aria-hidden="true">
                Zoom
              </span>
              <button
                type="button"
                aria-label="Zoom out"
                disabled={view.zoom <= MIN_ZOOM + 0.001}
                onClick={() => {
                  const point = center();
                  zoomAt(1 / 1.25, point.x, point.y);
                }}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 12h12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              <span className="ix-zoom-pct" aria-hidden="true">
                {percent}%
              </span>
              <button
                type="button"
                aria-label="Zoom in"
                disabled={view.zoom >= MAX_ZOOM - 0.001}
                onClick={() => {
                  const point = center();
                  zoomAt(1.25, point.x, point.y);
                }}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 6v12M6 12h12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              <button type="button" className="ix-reset" aria-label="Reset zoom" disabled={atFit} onClick={reset}>
                Reset
              </button>
              <span className="sr-only" aria-live="polite">
                Zoom {percent} percent
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
