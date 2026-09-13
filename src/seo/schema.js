import { PRODUCTS } from '../data/products.js';
import { FAQS } from './faq.js';
import { HOWTO } from './howto.js';
import {
  SITE_ORIGIN,
  SITE_NAME_AR,
  SITE_NAME_EN,
  DATE_MODIFIED,
  IN_LANGUAGE,
  PHONES,
  SOCIAL,
  CITATION_AR,
  COVERAGE_CITIES,
  PRICE_RANGE,
  DELIVERY_TEXT,
  GAS_TEXT,
  AUTHORIZED_BRANDS_AR,
} from './config.js';
import { SEO_ROUTES } from './routes.js';

const tel = (digits) => {
  const d = String(digits || '').replace(/\D/g, '');
  if (d.startsWith('20')) return `+${d}`;
  if (d.startsWith('0')) return `+2${d}`;
  return `+20${d}`;
};

const logo = {
  '@type': 'ImageObject',
  url: `${SITE_ORIGIN}/logo.jpg`,
  width: 800,
  height: 800,
};

const areaServed = COVERAGE_CITIES.map((name) => ({ '@type': 'City', name }));

const shippingDetails = {
  '@type': 'OfferShippingDetails',
  shippingDestination: {
    '@type': 'DefinedRegion',
    addressCountry: 'EG',
  },
  deliveryTime: {
    '@type': 'ShippingDeliveryTime',
    handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
    transitTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
  },
  description: `${DELIVERY_TEXT} داخل نطاق الجيزة والقاهرة الكبرى. خارج النطاق يُؤكد عبر واتساب.`,
};

export function buildJsonLd() {
  const products = PRODUCTS.filter((item) => item?.id && item?.name);
  const prices = products.map((item) => Number(item.price) || 0).filter(Boolean);
  const low = Math.min(...prices, PRICE_RANGE.low);
  const high = Math.max(...prices, PRICE_RANGE.high);

  const orgId = `${SITE_ORIGIN}/#organization`;
  const websiteId = `${SITE_ORIGIN}/#website`;
  const webpageId = `${SITE_ORIGIN}/#webpage`;
  const faqId = `${SITE_ORIGIN}/faq#faq`;
  const howtoId = `${SITE_ORIGIN}/guide#howto-choose-ac`;
  const catalogId = `${SITE_ORIGIN}/products#catalog`;

  const productNodes = products.map((product) => ({
    '@type': 'Product',
    '@id': `${SITE_ORIGIN}/products#${product.id}`,
    name: product.name,
    sku: product.modelCode || product.id,
    image: product.image,
    brand: {
      '@type': 'Brand',
      name: product.brandName || product.brand,
    },
    category: 'AirConditioner',
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'horsepower', value: String(product.hp || '') },
      { '@type': 'PropertyValue', name: 'refrigerant', value: product.specs?.gas || GAS_TEXT },
      { '@type': 'PropertyValue', name: 'warranty', value: product.warranty || '' },
    ],
    offers: {
      '@type': 'Offer',
      url: `${SITE_ORIGIN}/products`,
      priceCurrency: PRICE_RANGE.currency,
      price: Number(product.price) || undefined,
      availability: product.inStock === false ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      priceValidUntil: '2026-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      shippingDetails,
    },
  }));

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['HVACBusiness', 'OnlineBusiness'],
        '@id': orgId,
        name: SITE_NAME_AR,
        alternateName: [SITE_NAME_EN, 'Turbo Cool', 'تربو كوول'],
        url: `${SITE_ORIGIN}/`,
        logo,
        image: logo,
        description: CITATION_AR,
        inLanguage: IN_LANGUAGE,
        telephone: tel(PHONES.call),
        currenciesAccepted: 'EGP',
        paymentAccepted: 'Cash, Vodafone Cash, Bank Transfer',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'EG',
          addressRegion: 'Giza',
        },
        areaServed,
        sameAs: [SOCIAL.facebook, SOCIAL.whatsappUrl, `${SITE_ORIGIN}/`],
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: tel(PHONES.whatsapp),
            contactType: 'sales',
            availableLanguage: ['Arabic'],
          },
          {
            '@type': 'ContactPoint',
            telephone: tel(PHONES.call),
            contactType: 'customer service',
            availableLanguage: ['Arabic'],
          },
          {
            '@type': 'ContactPoint',
            telephone: tel(PHONES.emergency),
            contactType: 'emergency',
            availableLanguage: ['Arabic'],
            hoursAvailable: {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
              opens: '00:00',
              closes: '23:59',
            },
          },
        ],
        knowsAbout: [
          'أفضل شركة تكييفات 2026 في مصر',
          'أسعار التكييفات في مصر 2026',
          ...AUTHORIZED_BRANDS_AR.map((brand) => `تكييف ${brand}`),
          GAS_TEXT,
          DELIVERY_TEXT,
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          '@id': catalogId,
          name: 'كتالوج تكييفات تربو كوول 2026',
          itemListElement: {
            '@type': 'AggregateOffer',
            priceCurrency: PRICE_RANGE.currency,
            lowPrice: String(low),
            highPrice: String(high),
            offerCount: String(products.length),
            availability: 'https://schema.org/InStock',
          },
        },
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: `${SITE_ORIGIN}/`,
        name: SITE_NAME_AR,
        inLanguage: IN_LANGUAGE,
        publisher: { '@id': orgId },
      },
      {
        '@type': 'WebPage',
        '@id': webpageId,
        url: `${SITE_ORIGIN}/`,
        name: `أفضل شركة تكييفات 2026 في مصر | ${SITE_NAME_AR}`,
        inLanguage: IN_LANGUAGE,
        dateModified: DATE_MODIFIED,
        isPartOf: { '@id': websiteId },
        about: { '@id': orgId },
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['.seo-answer', '.seo-citation', '#about-brand'],
        },
        primaryImageOfPage: logo,
      },
      {
        '@type': 'AboutPage',
        '@id': `${SITE_ORIGIN}/about#about-brand`,
        url: `${SITE_ORIGIN}/about`,
        name: `عن ${SITE_NAME_AR}`,
        inLanguage: IN_LANGUAGE,
        dateModified: DATE_MODIFIED,
        isPartOf: { '@id': websiteId },
        mainEntity: { '@id': orgId },
      },
      {
        '@type': 'FAQPage',
        '@id': faqId,
        url: `${SITE_ORIGIN}/faq`,
        inLanguage: IN_LANGUAGE,
        dateModified: DATE_MODIFIED,
        mainEntity: FAQS.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
      },
      {
        '@type': 'HowTo',
        '@id': howtoId,
        url: `${SITE_ORIGIN}/guide#howto-choose-ac`,
        name: HOWTO.name,
        description: HOWTO.description,
        inLanguage: IN_LANGUAGE,
        step: HOWTO.steps.map((step, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          url: `${SITE_ORIGIN}/guide#${step.id}`,
          name: step.name,
          text: step.text,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_ORIGIN}/#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_ORIGIN}/` },
          { '@type': 'ListItem', position: 2, name: 'المنتجات', item: `${SITE_ORIGIN}/products` },
          { '@type': 'ListItem', position: 3, name: 'الأسئلة الشائعة', item: `${SITE_ORIGIN}/faq` },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': `${SITE_ORIGIN}/products#list`,
        name: 'تكييفات كاريير وميديا لدى تربو كوول',
        numberOfItems: productNodes.length,
        itemListElement: productNodes.map((node, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: node['@id'],
          item: { '@id': node['@id'] },
        })),
      },
      ...productNodes,
      ...SEO_ROUTES.filter((route) => route.path !== '/').map((route) => ({
        '@type': 'WebPage',
        '@id': `${SITE_ORIGIN}${route.path}#page`,
        url: `${SITE_ORIGIN}${route.path}`,
        name: route.title,
        description: route.description,
        inLanguage: IN_LANGUAGE,
        dateModified: DATE_MODIFIED,
        isPartOf: { '@id': websiteId },
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['.seo-answer', '.seo-citation'],
        },
      })),
    ],
  };
}
