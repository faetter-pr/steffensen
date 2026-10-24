/**
 * Shown on "/" when STORYBLOK_TOKEN is absent.
 *
 * The project is built so it compiles and runs before a Storyblok space exists
 * (see CLAUDE.md). This replaces the crash that would otherwise occur, and doubles as
 * a visual check that the design tokens and layout shell are wired up.
 */
export function NotConfigured() {
  return (
    <main className="container-content flex min-h-[60vh] flex-col justify-center py-24">
      <p className="text-xs font-medium tracking-widest text-brand-accent-ink uppercase">
        Opsætning
      </p>

      <h1 className="mt-4 max-w-2xl font-heading text-4xl leading-tight text-balance sm:text-5xl">
        Storyblok er ikke forbundet endnu.
      </h1>

      <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
        Fundamentet står klar — layout, designtokens, billedpipeline og blokregistret. Der mangler
        kun et Storyblok-space at hente indhold fra.
      </p>

      <ol className="mt-10 max-w-xl space-y-4 text-sm">
        <li className="border-l-2 border-border pl-4">
          <span className="font-medium">1. Opret et space</span> på storyblok.com og hent et
          Preview-token under Settings → Access Tokens.
        </li>
        <li className="border-l-2 border-border pl-4">
          <span className="font-medium">2. Kopiér .env.example til .env.local</span> og udfyld{" "}
          <code className="rounded bg-muted px-1.5 py-0.5">STORYBLOK_TOKEN</code>.
        </li>
        <li className="border-l-2 border-border pl-4">
          <span className="font-medium">3. Generér typer</span> med{" "}
          <code className="rounded bg-muted px-1.5 py-0.5">npm run generate:types</code>, og erstat
          den håndskrevne{" "}
          <code className="rounded bg-muted px-1.5 py-0.5">lib/storyblok/types.ts</code>.
        </li>
      </ol>

      <p className="mt-10 text-sm text-muted-foreground">
        Hele specifikationen ligger i{" "}
        <code className="rounded bg-muted px-1.5 py-0.5">docs/architecture.md</code>.
      </p>
    </main>
  );
}
