import { Link, useNavigate, useParams } from "react-router-dom";
import { FolderDock } from "../components/FolderDock";
import { Header } from "../components/Header";
import { RoommateCaseStudy } from "../components/RoommateCaseStudy";
import { cases } from "../data/cases";

export function CaseStudy() {
  const { id } = useParams();
  const navigate = useNavigate();
  const study = cases.find((item) => item.id === id);

  if (study?.id === "table-redesign" || study?.id === "tokyo-afterfall") {
    return <RoommateCaseStudy study={study} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-3xl px-6 pb-40 pt-36">
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
      <FolderDock
        active={null}
        onWorks={() => navigate("/", { state: { view: "works" } })}
        onProfile={() => navigate("/", { state: { view: "profile" } })}
      />
    </div>
  );
}
