"use server";

import { Resend } from "resend";

import { type ContactState, SEGMENT_LABELS, contactSchema } from "@/lib/contact-schema";

/**
 * Inquiry form server action (architecture.md §11): validate, then email via Resend.
 *
 * Degrades like the rest of the project — with no RESEND_API_KEY it reports a clear
 * error rather than throwing, so the form is reviewable before email is configured.
 */

export async function submitContact(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const raw = Object.fromEntries(formData.entries());

  // §11 honeypot. Bots fill every field; people never see this one. Report success so
  // the bot has nothing to learn from the response.
  if (typeof raw.website === "string" && raw.website.length > 0) {
    return { status: "success" };
  }

  const parsed = contactSchema.safeParse(raw);

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !errors[key]) errors[key] = issue.message;
    }
    return { status: "error", message: "Tjek de markerede felter.", errors };
  }

  const data = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    console.warn(
      "[contact] RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL not set — inquiry not sent.",
    );
    return {
      status: "error",
      message: "Formularen er ikke sat op til at sende endnu. Skriv i stedet direkte på e-mail.",
    };
  }

  try {
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: `Forespørgsel: ${SEGMENT_LABELS[data.segment]} — ${data.name}`,
      text: formatInquiry(data),
    });

    if (error) {
      console.error("[contact] Resend rejected the message:", error);
      return { status: "error", message: "Kunne ikke sende lige nu. Prøv igen om lidt." };
    }

    return { status: "success" };
  } catch (error) {
    console.error("[contact] Failed to send inquiry:", error);
    return { status: "error", message: "Kunne ikke sende lige nu. Prøv igen om lidt." };
  }
}

/** Plain-text body. Field set differs per segment (§11). */
function formatInquiry(data: ReturnType<typeof contactSchema.parse>): string {
  const lines: string[] = [
    `Type: ${SEGMENT_LABELS[data.segment]}`,
    `Navn: ${data.name}`,
    `E-mail: ${data.email}`,
  ];

  if (data.phone) lines.push(`Telefon: ${data.phone}`);

  switch (data.segment) {
    case "kindergartens":
      lines.push(`Institution: ${data.organisation}`);
      if (data.group_count) lines.push(`Antal børn/grupper: ${data.group_count}`);
      if (data.preferred_period) lines.push(`Ønsket periode: ${data.preferred_period}`);
      break;
    case "schools":
      lines.push(`Skole: ${data.organisation}`);
      if (data.class_count) lines.push(`Antal klasser: ${data.class_count}`);
      if (data.preferred_period) lines.push(`Ønsket periode: ${data.preferred_period}`);
      break;
    case "weddings":
      if (data.wedding_date) lines.push(`Dato: ${data.wedding_date}`);
      if (data.venue) lines.push(`Sted: ${data.venue}`);
      if (data.guest_count) lines.push(`Antal gæster: ${data.guest_count}`);
      if (data.coverage_hours) lines.push(`Timer: ${data.coverage_hours}`);
      break;
    case "other":
      if (data.occasion) lines.push(`Anledning: ${data.occasion}`);
      break;
  }

  lines.push("", "Besked:", data.message);
  return lines.join("\n");
}
