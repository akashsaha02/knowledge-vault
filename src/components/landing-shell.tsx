"use client";

import {
  BookOpen,
  Code2,
  Folder,
  Link as LinkIcon,
  Lock,
  Search,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { ProductPreview } from "@/components/landing/product-preview";
import { Button } from "@/components/ui/button";
import { FeatureIllustration, Illustration } from "@/components/ui/illustration";
import { IconContainer } from "@/components/ui/icon-container";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";

const FEATURES = [
  {
    icon: BookOpen,
    title: "Write notes",
    description: "Capture thoughts in a calm editor. Color them, pin them, find them later.",
  },
  {
    icon: Code2,
    title: "Save code & commands",
    description: "Keep reusable snippets and terminal commands ready to copy.",
  },
  {
    icon: LinkIcon,
    title: "Save useful links",
    description: "Bookmark websites and pages so you can find them when you need them.",
  },
] as const;

const STEPS = [
  {
    icon: Sparkles,
    title: "Capture",
    description: "Drop in a note, snippet, or link the moment it appears.",
  },
  {
    icon: Folder,
    title: "Organize",
    description: "Group related things into projects when you're ready.",
  },
  {
    icon: Search,
    title: "Find",
    description: "Search your whole Nook instantly — including from the keyboard.",
  },
  {
    icon: BookOpen,
    title: "Reuse",
    description: "Copy code, reopen links, and pick up notes where you left off.",
  },
] as const;

export function LandingShell() {
  return (
    <div className="landing-page">
      <nav className="landing-nav-wrap" aria-label="Main navigation">
        <div className="landing-nav-inner">
          <div className="landing-nav-start">
            <BrandLogo href="/" variant="lockup" className="landing-logo" />
            <div className="landing-nav-links">
              <a href="#features" className="landing-nav-link">
                Features
              </a>
              <a href="#how-it-works" className="landing-nav-link">
                How it works
              </a>
            </div>
          </div>
          <div className="landing-nav-actions">
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
            <Sparkles size={14} aria-hidden="true" />
            A quiet personal workspace
          </div>
          <h1 className="landing-hero-title">{BRAND_TAGLINE}</h1>
          <p className="landing-hero-text">
            Capture notes, code, links and ideas in one private place. Find them
            when you need them — without the noise of a typical productivity app.
          </p>
          <div className="landing-hero-actions">
            <Button size="lg" asChild>
              <Link href="/sign-up">Start for free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>
          <p className="landing-meta">Private by default. No clutter. Just your things.</p>
        </div>
        <div className="landing-hero-art">
          <Illustration name="hero" size="hero" title="Notes, code, and saved links together in Nook" />
        </div>
      </section>

      <section className="landing-trust" aria-label="Why people use Nook">
        <span className="landing-trust-item">
          <Lock size={14} aria-hidden="true" />
          Private workspace
        </span>
        <span className="landing-trust-item">
          <BookOpen size={14} aria-hidden="true" />
          Notes, code, and links together
        </span>
        <span className="landing-trust-item">
          <Search size={14} aria-hidden="true" />
          Fast search from anywhere
        </span>
      </section>

      <section className="landing-section" id="features" aria-labelledby="features-heading">
        <p className="landing-section-kicker">What you can keep</p>
        <h2 className="landing-section-title" id="features-heading">
          Everything worth keeping, in one nook
        </h2>
        <p className="landing-section-lead">
          Stop scattering ideas across apps. Nook is a calm home for the notes,
          snippets, and links you actually want to find again.
        </p>

        <article className="landing-feature-spotlight">
          <FeatureIllustration name="welcome" />
          <div className="landing-feature-copy">
            <IconContainer>
              <Folder size={18} strokeWidth={1.75} />
            </IconContainer>
            <h3>Organise by project when it helps</h3>
            <p>
              Group notes and links around something you&apos;re working on.
              Leave the rest in your library until you need it.
            </p>
          </div>
        </article>

        <div className="landing-features-grid">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="landing-feature-card">
                <IconContainer>
                  <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                </IconContainer>
                <h3 className="landing-feature-title">{feature.title}</h3>
                <p className="landing-feature-text">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="landing-section" id="how-it-works" aria-labelledby="how-heading">
        <p className="landing-section-kicker">How it works</p>
        <h2 className="landing-section-title" id="how-heading">
          Capture now. Organize later.
        </h2>
        <p className="landing-section-lead">
          Four simple steps. No setup wizard, no empty dashboards full of charts.
        </p>
        <ol className="landing-steps">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={step.title} className="landing-step">
                <IconContainer size="sm">
                  <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
                </IconContainer>
                <span className="landing-step-index">Step {index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="landing-section" aria-labelledby="preview-heading">
        <p className="landing-section-kicker">Inside Nook</p>
        <h2 className="landing-section-title" id="preview-heading">
          A workspace that stays out of the way
        </h2>
        <p className="landing-section-lead">
          Open a note, save a snippet, pin what matters. The rest of the interface
          stays quiet so you can think.
        </p>
        <ProductPreview />
      </section>

      <section className="landing-section">
        <div className="landing-cta-panel">
          <h2>Make a little room for the things that matter</h2>
          <p>
            Create a private Nook in a minute. Your notes, code, and links stay
            in one place — ready when you need them.
          </p>
          <div className="landing-cta-actions">
            <Button size="lg" asChild>
              <Link href="/sign-up">Start for free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/sign-in">I already have an account</Link>
            </Button>
          </div>
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
