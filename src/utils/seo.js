import { createContext, useContext, useEffect } from 'react';

// Build-time rendering collects the same metadata used by client navigation.
export const SeoContext = createContext(null);

export const SITE_URL = 'https://blushingbirdie.com';
export const SITE_NAME = 'Blushing Birdie';
export const DEFAULT_IMAGE = `${SITE_URL}/Blushing-Birdie-Icon.png`;
export const APP_URL = `${SITE_URL}/app`;

export const DEFAULT_DESCRIPTION =
  'Blushing Birdie is a simple, private golf tracker, built to help you track rounds and build confidence one swing at a time.';

const setMetaTag = ({ selector, attributes }) => {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
};

const setLinkTag = ({ selector, attributes }) => {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement('link');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
};

const removeStructuredData = () => {
  document
    .querySelectorAll('script[data-seo-json-ld="true"]')
    .forEach((element) => element.remove());
};

const addStructuredData = (items) => {
  items.filter(Boolean).forEach((item, index) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.dataset.seoJsonLd = 'true';
    script.dataset.seoJsonLdIndex = String(index);
    script.textContent = JSON.stringify(item);
    document.head.appendChild(script);
  });
};

export const absoluteUrl = (path = '/') => {
  if (path.startsWith('http')) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

export const applyPageSeo = ({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  robots = 'index,follow',
  structuredData = [],
}) => {
  const canonicalUrl = absoluteUrl(path);
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  document.title = fullTitle;

  setMetaTag({
    selector: 'meta[name="description"]',
    attributes: { name: 'description', content: description },
  });
  setMetaTag({
    selector: 'meta[name="robots"]',
    attributes: { name: 'robots', content: robots },
  });
  setMetaTag({
    selector: 'meta[property="og:site_name"]',
    attributes: { property: 'og:site_name', content: SITE_NAME },
  });
  setMetaTag({
    selector: 'meta[property="og:title"]',
    attributes: { property: 'og:title', content: fullTitle },
  });
  setMetaTag({
    selector: 'meta[property="og:description"]',
    attributes: { property: 'og:description', content: description },
  });
  setMetaTag({
    selector: 'meta[property="og:type"]',
    attributes: { property: 'og:type', content: type },
  });
  setMetaTag({
    selector: 'meta[property="og:url"]',
    attributes: { property: 'og:url', content: canonicalUrl },
  });
  setMetaTag({
    selector: 'meta[property="og:image"]',
    attributes: { property: 'og:image', content: image },
  });
  setMetaTag({
    selector: 'meta[name="twitter:card"]',
    attributes: { name: 'twitter:card', content: 'summary_large_image' },
  });
  setMetaTag({
    selector: 'meta[name="twitter:title"]',
    attributes: { name: 'twitter:title', content: fullTitle },
  });
  setMetaTag({
    selector: 'meta[name="twitter:description"]',
    attributes: { name: 'twitter:description', content: description },
  });
  setMetaTag({
    selector: 'meta[name="twitter:image"]',
    attributes: { name: 'twitter:image', content: image },
  });
  setLinkTag({
    selector: 'link[rel="canonical"]',
    attributes: { rel: 'canonical', href: canonicalUrl },
  });

  removeStructuredData();
  addStructuredData(structuredData);
};

export const usePageSeo = (options) => {
  const collector = useContext(SeoContext);
  if (collector) collector.current = options;
  useEffect(() => { applyPageSeo(options); }, [options]);
};

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: [
    'The Blushing Birdie',
    'Blushing Birdie Golf Tracker',
    'Blushing Birdie Golf App',
  ],
  url: SITE_URL,
  logo: DEFAULT_IMAGE,
  description:
    'Blushing Birdie creates simple, encouraging golf tools with the promise: Confidence, one swing at a time.',
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  alternateName: [
    'Blushing Birdie golf app',
  ],
  url: SITE_URL,
  publisher: { '@id': `${SITE_URL}/#organization` },
  about: [
    'golf app',
    'golf round tracker',
    'private golf scorecard',
    'golf progress tracking',
  ],
};

export const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  '@id': `${SITE_URL}/#app`,
  name: 'Blushing Birdie Golf Tracker',
  alternateName: [
    'Blushing Birdie',
    'The Blushing Birdie',
    'Blushing Birdie golf scorecard app',
  ],
  url: APP_URL,
  applicationCategory: 'SportsApplication',
  operatingSystem: 'Any operating system with a modern web browser',
  isAccessibleForFree: true,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  audience: {
    '@type': 'Audience',
    audienceType: 'Everyday recreational golfers',
  },
  description: DEFAULT_DESCRIPTION,
  publisher: { '@id': `${SITE_URL}/#organization` },
  potentialAction: {
    '@type': 'UseAction',
    target: APP_URL,
    name: 'Open Blushing Birdie Golf Tracker',
  },
};
