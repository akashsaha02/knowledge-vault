type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export class EmailDeliveryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmailDeliveryError";
  }
}

export async function sendEmail({ to, subject, text, html }: SendEmailInput) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from =
    process.env.EMAIL_FROM?.trim() ?? "Nook <onboarding@resend.dev>";

  if (!apiKey) {
    if (process.env.NODE_ENV === "production") {
      throw new EmailDeliveryError(
        "RESEND_API_KEY is required in production to send email",
      );
    }

    console.info("[email:dev]", { to, subject, text });
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text,
      html: html ?? text.replace(/\n/g, "<br />"),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new EmailDeliveryError(
      `Failed to send email (${response.status}): ${body}`,
    );
  }
}
