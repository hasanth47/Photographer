export const CATEGORIES = ["Portraits", "Landscapes", "Editorial"] as const;
export type Category = (typeof CATEGORIES)[number];

export type Photo = {
  id: string;
  src: string;
  title: string;
  category: Category;
  width: number;
  height: number;
  /** Shown in the "Selected work" section on the home page. */
  featured: boolean;
  /** Used as a slide in the home page hero. */
  hero: boolean;
};

export type SiteContent = {
  site: {
    name: string;
    email: string;
    location: string;
    instagram: string;
    twitter: string;
    behance: string;
    bookingNote: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    headlineItalic: string;
  };
  about: {
    heading: string;
    teaser: string;
    paragraphs: string[];
    portrait: string;
  };
  photos: Photo[];
};

export type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  receivedAt: string;
};
