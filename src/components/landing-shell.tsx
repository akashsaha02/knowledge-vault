"use client";

import { BookOpen, Code2, Folder, Link as LinkIcon, Sparkles } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";

const FEATURES = [
  {
    icon: BookOpen,
    title: "Write notes",
    description: "Capture thoughts and ideas in a focused editor with bold color accents.",
    accent: "notes" as const,
  },
  {
    icon: Code2,
    title: "Save code & commands",
    description: "Syntax-highlighted snippets and a terminal-style command vault.",
    accent: "code" as const,
  },
  {
    icon: LinkIcon,
    title: "Save useful links",
    description: "Bookmark websites and pages so you can find them later.",
    accent: "links" as const,
  },
  {
    icon: Folder,
    title: "Organise by project",
    description: "Group notes and links into projects so everything stays in its place.",
    accent: "projects" as const,
  },
] as const;

export function LandingShell() {
  return (
    <div className="landing-page">
      <nav className="landing-nav-wrap" aria-label="Main navigation">
        <div className="landing-nav-glass">
          <BrandLogo href="/" variant="lockup" className="landing-logo" />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/sign-up">Get started</Link>
            </Button>
          </div>
        </div>
      </nav>

      <section className="landing-hero-section">
        <div className="landing-hero-content">
          <div className="landing-hero-badge">
            <Sparkles size={14} className="text-[var(--brand)]" aria-hidden="true" />
            Notes, links &amp; code — free to use
          </div>
          <h1 className="landing-hero-title">{BRAND_TAGLINE}</h1>
          <p className="landing-hero-text">
            Notes, links, and code — organised in your own private corner of the web.
          </p>
          <div className="landing-hero-actions">
            <Button size="lg" asChild>
              <Link href="/sign-up">Start for free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>
          <p className="landing-meta">{BRAND_NAME} — made for curious minds</p>
        </div>
      </section>

      <section className="landing-features-section" aria-label="Features">
        <div className="landing-features-grid">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className={`landing-feature-card landing-feature-card--${feature.accent}`}
              >
                <div className="landing-feature-icon">
                  <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                </div>
                <h2 className="landing-feature-title">{feature.title}</h2>
                <p className="landing-feature-text">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <footer className="landing-footer">
        <BrandLogo href="/" variant="lockup" />
        <p className="landing-footer-text">
          {BRAND_NAME} — your private corner for ideas
        </p>
      </footer>
    </div>
  );
}
