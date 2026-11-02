"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type ContactState, DEFAULT_CONTACT_TYPES } from "@/lib/contact-schema";

/**
 * Inquiry form UI (architecture.md §11, §13.9).
 *
 * Layer 2: no Storyblok imports. The action and the type list are injected so this stays
 * reusable and the CMS owns the choices.
 *
 * Five fields, always visible: name, e-mail, phone, type, message. Nothing is revealed
 * or hidden as you fill it in — the form should read as short, because it is.
 */

interface ContactFormUIProps {
  action: (state: ContactState, formData: FormData) => Promise<ContactState>;
  /** Choices for the Type dropdown. Empty falls back to DEFAULT_CONTACT_TYPES. */
  types?: string[];
  successMessage?: string;
}

const INITIAL: ContactState = { status: "idle" };

export function ContactFormUI({ action, types, successMessage }: ContactFormUIProps) {
  // Radix needs a non-empty, unique value per item, and an editor can produce neither.
  const available = dedupe(types ?? []);
  const options = available.length ? available : [...DEFAULT_CONTACT_TYPES];
  const [state, formAction] = useActionState(action, INITIAL);

  if (state.status === "success") {
    return (
      <div role="status" className="border-t border-brand-accent pt-8">
        <h3 className="font-heading text-2xl">Tak for din henvendelse.</h3>
        <p className="mt-3 leading-relaxed">
          {successMessage || "Jeg vender tilbage inden for to hverdage."}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <Field name="name" label="Navn" required error={state.errors?.name} />
      <Field name="email" label="E-mail" type="email" required error={state.errors?.email} />
      <Field name="phone" label="Telefon" type="tel" />

      <div>
        <Label htmlFor="type">
          Type <RequiredMark />
        </Label>
        {/* Radix renders a hidden native select for `name`, so this submits with the form. */}
        <Select name="type" required>
          <SelectTrigger
            id="type"
            className="mt-2 w-full"
            aria-describedby={state.errors?.type ? "type-error" : undefined}
            aria-invalid={state.errors?.type ? true : undefined}
          >
            <SelectValue placeholder="Vælg type" />
          </SelectTrigger>
          <SelectContent>
            {options.map((label) => (
              <SelectItem key={label} value={label}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {state.errors?.type ? <FieldError id="type-error">{state.errors.type}</FieldError> : null}
      </div>

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

/** Trim, drop blanks, drop repeats — an editor-defined list can contain all three. */
function dedupe(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
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
