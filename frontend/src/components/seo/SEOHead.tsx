import { useEffect } from "react";

export interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  keywords?: string[];
  ogType?: "website" | "article" | "profile";
  ogImage?: string;
  noindex?: boolean;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

const DEFAULT_SITE_URL = "https://learnopto.site";
const DEFAULT_SITE_NAME = "LearnOpto";
const DEFAULT_OG_IMAGE = `${DEFAULT_SITE_URL}/og-image.png`;

export const SEOHead = ({
  title,
  description,
  canonicalUrl,
  keywords = [
    "AI learning resources",
    "personalized learning roadmaps",
    "AI study assistant",
    "curated developer courses",
    "programming tutorials",
    "tech documentation search",
    "LearnOpto",
  ],
  ogType = "website",
  ogImage = DEFAULT_OG_IMAGE,
  noindex = false,
  author = "Ronit Mexson",
  publishedTime,
  modifiedTime,
}: SEOHeadProps) => {
  useEffect(() => {
    const fullTitle = title.includes("LearnOpto") ? title : `${title} | LearnOpto`;
    document.title = fullTitle;

    const setMetaTag = (selector: string, attr: string, value: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement("meta");
        const match = selector.match(/\[(name|property)="([^"]+)"\]/);
        if (match) {
          element.setAttribute(match[1], match[2]);
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attr, value);
    };

    const setLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
      }
      element.setAttribute("href", href);
    };

    // Primary Meta
    setMetaTag('meta[name="description"]', "content", description);
    setMetaTag('meta[name="keywords"]', "content", keywords.join(", "));
    setMetaTag('meta[name="author"]', "content", author);
    setMetaTag('meta[name="robots"]', "content", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");

    // Canonical Link
    const currentCanonical = canonicalUrl || `${DEFAULT_SITE_URL}${window.location.pathname}`;
    setLinkTag("canonical", currentCanonical);

    // OpenGraph Meta
    setMetaTag('meta[property="og:site_name"]', "content", DEFAULT_SITE_NAME);
    setMetaTag('meta[property="og:type"]', "content", ogType);
    setMetaTag('meta[property="og:title"]', "content", fullTitle);
    setMetaTag('meta[property="og:description"]', "content", description);
    setMetaTag('meta[property="og:url"]', "content", currentCanonical);
    setMetaTag('meta[property="og:image"]', "content", ogImage);
    setMetaTag('meta[property="og:locale"]', "content", "en_US");

    if (publishedTime) {
      setMetaTag('meta[property="article:published_time"]', "content", publishedTime);
    }
    if (modifiedTime) {
      setMetaTag('meta[property="article:modified_time"]', "content", modifiedTime);
    }

    // Twitter Card Meta
    setMetaTag('meta[name="twitter:card"]', "content", "summary_large_image");
    setMetaTag('meta[name="twitter:site"]', "content", "@LearnOpto");
    setMetaTag('meta[name="twitter:creator"]', "content", "@ronitmexson");
    setMetaTag('meta[name="twitter:title"]', "content", fullTitle);
    setMetaTag('meta[name="twitter:description"]', "content", description);
    setMetaTag('meta[name="twitter:image"]', "content", ogImage);

    // Mobile & PWA Theme
    setMetaTag('meta[name="theme-color"]', "content", "#10b981");
  }, [title, description, canonicalUrl, keywords, ogType, ogImage, noindex, author, publishedTime, modifiedTime]);

  return null;
};
