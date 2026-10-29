import { Header } from "../components/Header";

export function Writings() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-3xl px-6 pt-36 pb-24">
        <h1 className="font-display text-display-sm">Writings</h1>
        <p className="mt-4 font-sans text-body text-muted-foreground">Coming soon.</p>
      </main>
    </div>
  );
}
