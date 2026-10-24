/**
 * Pure text helpers, safe to call from server components.
 *
 * This lives outside components/motion/ deliberately: those modules are `"use client"`,
 * and a plain function exported from a client module cannot be CALLED on the server —
 * only rendered as a component or passed as a prop.
 */

/**
 * Split an editor-entered headline into display lines on newlines.
 *
 * Lines are authored rather than measured: measuring wrapped text needs a layout pass,
 * which would either flash unstyled text or shift. The editor controls the break.
 */
export function toLines(text: string | undefined | null): string[] {
  if (!text) return [];
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}
