"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/Button";

// Netlify Forms: the static twin of this form lives in public/__form.html so
// Netlify registers it at build time; we POST there with the same field names.
const FORM_NAME = "contact";
const FORM_ENDPOINT = "/__form.html";

type Field = "name" | "email" | "message";
type Errors = Partial<Record<Field, string>>;
type Status = "idle" | "pending" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(data: FormData): Errors {
  const name = String(data.get("name") ?? "").trim();
  const email = String(data.get("email") ?? "").trim();
  const message = String(data.get("message") ?? "").trim();
  const errors: Errors = {};
  if (!name) errors.name = "Please enter your name.";
  if (!email) errors.email = "Please enter your email address.";
  else if (!EMAIL_RE.test(email))
    errors.email = "That email address doesn't look right.";
  if (!message) errors.message = "Please enter a message.";
  else if (message.length > 5000)
    errors.message = "Please keep your message under 5,000 characters.";
  return errors;
}

const fieldClasses =
  "mt-2 w-full border border-line bg-transparent px-4 py-3 text-foreground placeholder:text-muted/60 outline-none transition-colors focus:border-accent";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const nextErrors = validate(data);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("pending");
    try {
      const body = new URLSearchParams();
      data.forEach((value, key) => body.append(key, String(value)));
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (!res.ok) throw new Error(`Netlify responded ${res.status}`);
      setStatus("success");
    } catch (err) {
      console.error("[contact] submit failed", err);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-line bg-surface px-6 py-10 text-center">
        <p className="font-display text-2xl">Thank you.</p>
        <p className="mt-3 text-muted">
          Your message has been sent. Dave will be in touch soon.
        </p>
      </div>
    );
  }

  const pending = status === "pending";

  return (
    <form
      name={FORM_NAME}
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6"
    >
      <input type="hidden" name="form-name" value={FORM_NAME} />

      <div>
        <label htmlFor="name" className="text-sm">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={fieldClasses}
        />
        {errors.name && (
          <p id="name-error" className="mt-2 text-sm text-danger">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="text-sm">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={fieldClasses}
        />
        {errors.email && (
          <p id="email-error" className="mt-2 text-sm text-danger">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="text-sm">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`${fieldClasses} resize-y`}
        />
        {errors.message && (
          <p id="message-error" className="mt-2 text-sm text-danger">
            {errors.message}
          </p>
        )}
      </div>

      {/* Netlify honeypot — hidden from people, filled in by bots. */}
      <p className="hidden" aria-hidden="true">
        <label>
          Don&rsquo;t fill this out if you&rsquo;re human:{" "}
          <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      {status === "error" && (
        <p role="alert" className="text-sm text-danger">
          Sorry — the message couldn&rsquo;t be sent right now. Please try
          again or email directly.
        </p>
      )}

      <Button type="submit" disabled={pending} className="disabled:opacity-60">
        {pending ? "Sending…" : "Send"}
      </Button>
    </form>
  );
}
