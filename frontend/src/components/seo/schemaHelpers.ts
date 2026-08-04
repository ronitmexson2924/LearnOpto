export const SITE_URL = "https://learnopto.com";

export const buildWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "LearnOpto",
  alternateName: "LearnOpto AI Study Assistant",
  url: SITE_URL,
  description: "AI-powered educational search platform that curates top YouTube videos, podcasts, technical documentation, and courses into structured study paths.",
  publisher: {
    "@type": "Organization",
    name: "LearnOpto",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/dashboard?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
});

export const buildOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "LearnOpto",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.svg`,
  description: "LearnOpto is an AI-powered educational discovery engine eliminating search fatigue for self-directed learners and developers worldwide.",
  founder: {
    "@type": "Person",
    name: "Ronit Mexson",
    url: "https://ronitmexson.netlify.app",
    jobTitle: "Founder & Lead Architect",
  },
  sameAs: [
    "https://github.com",
    "https://twitter.com/LearnOpto",
    "https://linkedin.com",
  ],
});

export const buildSoftwareApplicationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "LearnOpto",
  operatingSystem: "All (Web App)",
  applicationCategory: "EducationalApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "1280",
  },
  description: "LearnOpto is an AI-driven learning platform that aggregates YouTube tutorials, technical documentation, podcasts, and courses into personalized roadmaps with real-time URL reachability verification.",
  featureList: [
    "AI Multi-Source Curation across Videos, Podcasts, Docs & Courses",
    "Zero Dead Link Guarantee with Real-Time Reachability Checks",
    "Personalized Learning Library & Bookmarks",
    "Adaptable Media Preference Weighting",
    "Passkey & OAuth 2.0 Passwordless Security",
    "Activity Analytics & Progress Tracking",
  ],
  author: {
    "@type": "Person",
    name: "Ronit Mexson",
    url: "https://ronitmexson.netlify.app",
  },
});

export const buildFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

export const buildBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
  })),
});

export const buildCourseSchema = (course: {
  name: string;
  description: string;
  provider: string;
  category: string;
  url: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Course",
  name: course.name,
  description: course.description,
  provider: {
    "@type": "Organization",
    name: course.provider,
    sameAs: SITE_URL,
  },
  educationalCredentialAwarded: "Certificate of Completion",
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "Online",
    courseWorkload: "PT10H",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  url: course.url,
});

export const buildHowToSchema = (howTo: {
  name: string;
  description: string;
  steps: Array<{ title: string; text: string }>;
}) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: howTo.name,
  description: howTo.description,
  step: howTo.steps.map((s, idx) => ({
    "@type": "HowToStep",
    position: idx + 1,
    name: s.title,
    text: s.text,
  })),
});
