"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MailIcon, SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Newsletter subscription section — design only (no backend functionality
 * required for this section).
 */
export function Newsletter() {
  const [email, setEmail] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Thanks for subscribing! We'll keep you posted. 💌");
    setEmail("");
  }

  return (
    <section>
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 px-6 py-12 text-center text-white md:px-12 md:py-16">
          {/* Decorative circles */}
          <div
            aria-hidden
            className="absolute -top-16 -right-16 size-64 rounded-full bg-white/10"
          />
          <div
            aria-hidden
            className="absolute -bottom-20 -left-10 size-72 rounded-full bg-black/10"
          />

          <span className="relative mx-auto mb-5 flex size-12 items-center justify-center rounded-2xl bg-white/15">
            <MailIcon className="size-6" />
          </span>

          <h2 className="relative text-3xl font-bold tracking-tight sm:text-4xl">
            Stay in the loop
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-emerald-50/90">
            Get a monthly digest of upcoming community service events, volunteer
            stories and organizing tips — straight to your inbox.
          </p>

          <form
            onSubmit={handleSubmit}
            className="relative mx-auto mt-8 flex max-w-md flex-col gap-2 sm:flex-row"
          >
            <Input
              type="email"
              required
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 flex-1 rounded-full border-0 bg-white px-5 text-foreground"
              aria-label="Email address"
            />
            <Button
              type="submit"
              size="lg"
              className="h-11 rounded-full bg-white px-6 text-emerald-700 hover:bg-emerald-50"
            >
              Subscribe
              <SendIcon data-icon="inline-end" />
            </Button>
          </form>
          <p className="relative mt-4 text-xs text-emerald-50/70">
            No spam — unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
