import { z } from "zod";

/**
 * Inquiry form schema (architecture.md §11).
 *
 * Shared by the client form and the server action, so validation rules exist once.
 * The server re-validates regardless — client validation is a convenience, not a control.
 */

export const SEGMENTS = ["kindergartens", "schools", "weddings", "other"] as const;
export type ContactSegment = (typeof SEGMENTS)[number];

export const SEGMENT_LABELS: Record<ContactSegment, string> = {
  kindergartens: "Børnehave",
  schools: "Skole",
  weddings: "Bryllup",
  other: "Andet",
};

const base = {
  segment: z.enum(SEGMENTS),
  name: z.string().min(2, "Skriv dit navn").max(120),
  email: z.email("Tjek e-mailadressen").max(200),
  phone: z.string().max(40).optional().or(z.literal("")),
  message: z.string().min(10, "Skriv et par ord om opgaven").max(4000),
  /** Honeypot (§11). Real people never fill this; bots do. */
  website: z.string().max(0, "").optional().or(z.literal("")),
};

/**
 * §11: the first question is "what is this for?", which reveals the relevant fields.
 * Institutions and weddings need genuinely different information.
 */
export const contactSchema = z.discriminatedUnion("segment", [
  z.object({
    ...base,
    segment: z.literal("kindergartens"),
    organisation: z.string().min(2, "Skriv institutionens navn").max(200),
    group_count: z.string().max(40).optional().or(z.literal("")),
    preferred_period: z.string().max(120).optional().or(z.literal("")),
  }),
  z.object({
    ...base,
    segment: z.literal("schools"),
    organisation: z.string().min(2, "Skriv skolens navn").max(200),
    class_count: z.string().max(40).optional().or(z.literal("")),
    preferred_period: z.string().max(120).optional().or(z.literal("")),
  }),
  z.object({
    ...base,
    segment: z.literal("weddings"),
    wedding_date: z.string().max(40).optional().or(z.literal("")),
    venue: z.string().max(200).optional().or(z.literal("")),
    guest_count: z.string().max(40).optional().or(z.literal("")),
    coverage_hours: z.string().max(40).optional().or(z.literal("")),
  }),
  z.object({
    ...base,
    segment: z.literal("other"),
    occasion: z.string().max(200).optional().or(z.literal("")),
  }),
]);

export type ContactInput = z.infer<typeof contactSchema>;

export interface ContactState {
  status: "idle" | "success" | "error";
  message?: string;
  /** Field name → first error message. */
  errors?: Record<string, string>;
}
