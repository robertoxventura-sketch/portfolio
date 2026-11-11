import { Link, useParams } from "react-router-dom";
import { CaseStudyDock } from "../components/FolderDock";
import { ReadingProgress, RoommateCaseStudy } from "../components/RoommateCaseStudy";
import { cases } from "../data/cases";

export function CaseStudy() {
  const { id } = useParams();
  const study = cases.find((item) => item.id === id);

  if (study?.id === "table-redesign" || study?.id === "tokyo-afterfall") {
    return <RoommateCaseStudy key={study.id} study={study} />;
  }

  if (study?.id === "framer-components") {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 pb-40 pt-12 sm:pt-16">
          <Link
            to="/"
            state={{ view: "works" }}
            className="w-fit font-sans text-body-sm text-muted-foreground hover:text-foreground"
          >
            ← Back
          </Link>
          <div className="flex flex-1 flex-col justify-center pb-24">
            <p className="font-mono-label text-micro uppercase tracking-widest text-muted-foreground">{study.client}</p>
            <h1 className="mt-3 font-display text-display-sm leading-tight">Coming soon.</h1>
          </div>
        </main>
        <CaseStudyDock />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ReadingProgress />
      <main className="mx-auto max-w-3xl px-6 pb-40 pt-12 sm:pt-16">
        <Link to="/" className="font-sans text-body-sm text-muted-foreground hover:text-foreground">
          ← Back
        </Link>
        {study ? (
          <>
            <p className="mt-8 font-mono-label text-micro uppercase tracking-widest text-muted-foreground">
              Case study · {study.client}
            </p>
            <h1 className="mt-3 font-display text-display-sm sm:text-display-md leading-tight">
              {study.title}
            </h1>
            <p className="mt-6 font-sans text-body text-muted-foreground leading-relaxed">
              {study.desc}
            </p>
            <div className="mt-10 overflow-hidden rounded-3xl bg-secondary">
              <img src={study.image} alt={study.title} className="h-auto w-full" decoding="async" />
            </div>
          </>
        ) : (
          <h1 className="mt-10 font-display text-display-sm">Case study not found.</h1>
        )}
      </main>
      <CaseStudyDock />
    </div>
  );
}
