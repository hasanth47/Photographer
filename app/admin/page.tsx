import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { updateAbout, updateHero, updateSite } from "./actions";
import { AdminForm, Field, TextArea } from "./admin-form";

export const metadata: Metadata = { title: "Content" };

export default async function AdminContentPage() {
  const { site, hero, about } = await getContent();

  return (
    <div className="max-w-3xl space-y-16">
      <header>
        <p className="label text-muted">Dashboard</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-foreground">Site content</h1>
        <p className="mt-3 text-sm text-muted">
          Changes are saved to <span className="font-mono text-foreground/70">data/content.json</span> and go live immediately.
        </p>
      </header>

      <section id="hero" className="scroll-mt-10 border-t border-line pt-10">
        <h2 className="font-display text-2xl font-semibold text-foreground">Home hero</h2>
        <p className="mt-2 text-sm text-muted">
          Hero slides are the photos flagged “Use in hero” on the Photos page.
        </p>
        <AdminForm action={updateHero} className="mt-6">
          <Field label="Eyebrow" name="eyebrow" defaultValue={hero.eyebrow} />
          <Field label="Headline (first line)" name="headline" defaultValue={hero.headline} />
          <Field label="Headline (italic second line)" name="headlineItalic" defaultValue={hero.headlineItalic} />
        </AdminForm>
      </section>

      <section id="about" className="scroll-mt-10 border-t border-line pt-10">
        <h2 className="font-display text-2xl font-semibold text-foreground">About</h2>
        <AdminForm action={updateAbout} className="mt-6">
          <Field label="Heading" name="heading" defaultValue={about.heading} />
          <TextArea
            label="Home page teaser"
            name="teaser"
            rows={3}
            defaultValue={about.teaser}
            hint="Short intro shown on the home page above “Full biography”."
          />
          <TextArea
            label="Biography"
            name="paragraphs"
            rows={10}
            defaultValue={about.paragraphs.join("\n\n")}
            hint="Separate paragraphs with a blank line."
          />
          <Field
            label="Portrait image"
            name="portrait"
            defaultValue={about.portrait}
            hint="An /uploads/ path (upload it on the Photos page first) or an images.unsplash.com URL."
          />
        </AdminForm>
      </section>

      <section id="site" className="scroll-mt-10 border-t border-line pt-10">
        <h2 className="font-display text-2xl font-semibold text-foreground">Site &amp; contact details</h2>
        <AdminForm action={updateSite} className="mt-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Site name" name="name" defaultValue={site.name} />
            <Field label="Email" name="email" type="email" defaultValue={site.email} />
            <Field label="Location" name="location" defaultValue={site.location} />
            <Field label="Instagram" name="instagram" defaultValue={site.instagram} />
            <Field label="Twitter" name="twitter" defaultValue={site.twitter} />
            <Field label="Behance" name="behance" defaultValue={site.behance} />
          </div>
          <TextArea label="Booking note" name="bookingNote" rows={3} defaultValue={site.bookingNote} />
        </AdminForm>
      </section>
    </div>
  );
}
