import { z } from "zod";

/**
 * Inquiry form schema (architecture.md §11).
 *
 * Shared by the client form and the server action, so validation rules exist once.
 * The server re-validates regardless — client validation is a convenience, not a control.
 *
 * Deliberately flat: five fields, always visible. §11 describes a segment-aware form that
 * swaps its fields per segment; in practice the free-text message gets the same information
 * with none of the paperwork.
 */

/**
 * Fallback for the Type dropdown. The real list is editor-defined on the `contact_form`
 * blok (`types` → `contact_type` bloks); these are only used when none are configured, so
 * the form is never broken by an empty field.
 */
export const DEFAULT_CONTACT_TYPES = ["Børnehave", "Skole", "Bryllup", "Andet"] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Skriv dit navn").max(120),
  email: z.email("Tjek e-mailadressen").max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  /**
   * The allowed values live in the CMS, per block, so the action has no list to check
   * against — it validates shape only. The blast radius of a forged value is one junk
   * line in an email that already carries a free-text message; `formatInquiry` strips
   * newlines before it reaches the subject.
   */
  type: z.string().trim().min(1, "Vælg hvad det drejer sig om").max(120),
  message: z.string().trim().min(10, "Skriv et par ord om opgaven").max(4000),
  /** Honeypot (§11). Real people never fill this; bots do. */
  website: z.string().max(0, "").optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;

export interface ContactState {
  status: "idle" | "success" | "error";
  message?: string;
  /** Field name → first error message. */
  errors?: Record<string, string>;
}
