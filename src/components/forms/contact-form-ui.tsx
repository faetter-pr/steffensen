"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  type ContactSegment,
  type ContactState,
  SEGMENTS,
  SEGMENT_LABELS,
} from "@/lib/contact-schema";

/**
 * Inquiry form UI (architecture.md §11, §13.9).
 *
 * Layer 2: no Storyblok imports. The action is injected so this stays reusable.
 *
 * §11: the first question is "what is this for?", and the answer reveals the relevant
 * fields — a kindergarten and a wedding need different information, and showing all of
 * it at once makes the form feel like paperwork.
 */

interface ContactFormUIProps {
  action: (state: ContactState, formData: FormData) => Promise<ContactState>;
  segments?: ContactSegment[];
  successMessage?: string;
}

const INITIAL: ContactState = { status: "idle" };

export function ContactFormUI({ action, segments, successMessage }: ContactFormUIProps) {
  const available = segments?.length ? segments : [...SEGMENTS];
  const [segment, setSegment] = useState<ContactSegment>(available[0] ?? "other");
  const [state, formAction] = useActionState(action, INITIAL);

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-xl border border-brand-accent bg-secondary/50 p-8">
        <h3 className="font-heading text-2xl">Tak for din henvendelse.</h3>
        <p className="mt-3 leading-relaxed">
          {successMessage || "Jeg vender tilbage inden for to hverdage."}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {/* §11 — "What is this for?" comes first and drives the rest. */}
      <fieldset>
        <legend className="text-sm font-medium">Hvad drejer det sig om?</legend>

        <div className="mt-3 flex flex-wrap gap-2">
          {available.map((value) => (
            <label
              key={value}
              className={`tap-target flex cursor-pointer items-center rounded-full border px-4 text-sm transition-colors ${
                segment === value
                  ? "border-brand-accent bg-secondary"
                  : "border-border hover:bg-secondary/50"
              }`}
            >
              <input
                type="radio"
                name="segment"
                value={value}
                checked={segment === value}
                onChange={() => setSegment(value)}
                className="sr-only"
              />
              {SEGMENT_LABELS[value]}
            </label>
          ))}
        </div>
      </fieldset>

      {segment === "kindergartens" ? (
        <>
          <Field
            name="organisation"
            label="Institutionens navn"
            required
            error={state.errors?.organisation}
          />
          <Field name="group_count" label="Antal børn eller grupper" />
          <Field name="preferred_period" label="Ønsket periode" />
        </>
      ) : null}

      {segment === "schools" ? (
        <>
          <Field
            name="organisation"
            label="Skolens navn"
            required
            error={state.errors?.organisation}
          />
          <Field name="class_count" label="Antal klasser" />
          <Field name="preferred_period" label="Ønsket periode" />
        </>
      ) : null}

      {segment === "weddings" ? (
        <>
          <Field name="wedding_date" label="Dato" type="date" />
          <Field name="venue" label="Sted" />
          <Field name="guest_count" label="Antal gæster" />
          <Field name="coverage_hours" label="Ønsket antal timer" />
        </>
      ) : null}

      {segment === "other" ? <Field name="occasion" label="Anledning" /> : null}

      <Field name="name" label="Dit navn" required error={state.errors?.name} />
      <Field name="email" label="E-mail" type="email" required error={state.errors?.email} />
      <Field name="phone" label="Telefon" type="tel" />

      <div>
        <Label htmlFor="message">
          Besked <RequiredMark />
        </Label>
        <Textarea
          id="message"
          name="message"
          rows={5}
          required
          aria-describedby={state.errors?.message ? "message-error" : undefined}
          aria-invalid={state.errors?.message ? true : undefined}
          className="mt-2"
        />
        {state.errors?.message ? (
          <FieldError id="message-error">{state.errors.message}</FieldError>
        ) : null}
      </div>

      {/* §11 honeypot — hidden from people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && state.message ? (
        <p role="alert" className="text-sm text-destructive">
          {state.message}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton />
        <p className="text-xs text-muted-foreground">
          Se hvordan jeg behandler oplysninger i{" "}
          <Link href="/privacy" className="text-brand-accent-ink underline underline-offset-4">
            privatlivspolitikken
          </Link>
          .
        </p>
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" className="tap-target" disabled={pending}>
      {pending ? "Sender…" : "Send forespørgsel"}
    </Button>
  );
}

function Field({
  name,
  label,
  type = "text",
  required = false,
  error,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <Label htmlFor={name}>
        {label} {required ? <RequiredMark /> : null}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        required={required}
        aria-describedby={error ? `${name}-error` : undefined}
        aria-invalid={error ? true : undefined}
        className="mt-2"
      />
      {error ? <FieldError id={`${name}-error`}>{error}</FieldError> : null}
    </div>
  );
}

function RequiredMark() {
  return (
    <span className="text-destructive" aria-hidden="true">
      *
    </span>
  );
}

function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="mt-1.5 text-sm text-destructive">
      {children}
    </p>
  );
}
