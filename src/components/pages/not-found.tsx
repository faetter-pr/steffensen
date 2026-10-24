import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="container-content flex min-h-[60vh] flex-col justify-center py-24">
      <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">404</p>

      <h1 className="mt-4 max-w-xl font-heading text-4xl leading-tight text-balance sm:text-5xl">
        Siden findes ikke.
      </h1>

      <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
        Linket er måske forældet, eller siden er flyttet.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild className="tap-target">
          <Link href="/">Til forsiden</Link>
        </Button>
        <Button asChild variant="outline" className="tap-target">
          <Link href="/contact">Kontakt mig</Link>
        </Button>
      </div>
    </main>
  );
}
