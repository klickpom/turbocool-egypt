import { SITE_ORIGIN, SITE_NAME_AR } from './config.js';

export const SEO_ROUTES = [
  {
    path: '/',
    sectionId: 'hero-section',
    tab: 'home',
    title: `أفضل شركة تكييفات 2026 في مصر | ${SITE_NAME_AR} Turbo Cool`,
    description:
      'تربو كوول شركة تكييفات في مصر 2026: وكيل معتمد كاريير وميديا وشارب وإل جي وأوكس وبلوتو. توريد وتركيب مجاني خلال 24 ساعة ومعاينة في الجيزة والقاهرة. أسعار كاريير وميديا من 23,900 ج.م.',
  },
  {
    path: '/products',
    sectionId: 'catalog-section',
    tab: 'catalog',
    title: `أسعار التكييفات في مصر 2026 | كتالوج كاريير وميديا | ${SITE_NAME_AR}`,
    description:
      'كتالوج تكييفات كاريير وميديا 2026 لدى تربو كوول: 1.5 و2.25 و3 حصان، إنفرتر وبارد/ساخن، توريد وتركيب مجاني خلال 24 ساعة. شارب وإل جي وأوكس وبلوتو عبر واتساب.',
  },
  {
    path: '/faq',
    sectionId: 'faq',
    tab: 'faq',
    title: `أسئلة شائعة | أفضل شركة تكييفات 2026 في مصر | ${SITE_NAME_AR}`,
    description:
      'إجابات مباشرة: أفضل شركة تكييفات 2026 في مصر، الأسعار، الإنفرتر، حساب الحصان، الضمان، مناطق الجيزة والقاهرة، وطلب المعاينة من تربو كوول.',
  },
  {
    path: '/guide',
    sectionId: 'seo-guides',
    tab: 'faq',
    title: `دليل شراء التكييف 2026 في مصر | ${SITE_NAME_AR}`,
    description:
      'دليل تربو كوول لاختيار التكييف 2026: القدرة بالحصان، الإنفرتر، الأسعار، التركيب المعتمد، والصيانة في الجيزة والقاهرة.',
  },
  {
    path: '/prices',
    sectionId: 'prices-2026-section',
    tab: 'catalog',
    title: `جدول أسعار التكييفات 2026 | تربو كوول Turbo Cool`,
    description:
      'جدول أسعار تكييفات كاريير وميديا 2026 في مصر من تربو كوول: 1.5 و2.25 و3 حصان مع توريد وتركيب مجاني خلال 24 ساعة.',
  },
  {
    path: '/calculator',
    sectionId: 'calculator-section',
    tab: 'calculator',
    title: `حاسبة أحمال التكييف بالحصان | ${SITE_NAME_AR}`,
    description:
      'احسب قدرة التكييف المناسبة لمساحة غرفتك (1.5 / 2.25 / 3 حصان) ثم اختر موديل كاريير أو ميديا من تربو كوول مع تركيب خلال 24 ساعة.',
  },
  {
    path: '/services',
    sectionId: 'services-section',
    tab: 'services',
    title: `صيانة وتركيب وشحن فريون | ${SITE_NAME_AR}`,
    description:
      'حجز صيانة تكييف، غسيل كيميائي، شحن فريون R32 و R410A، وتأسيس مواسير في الجيزة والقاهرة. خط الطوارئ 01023499515.',
  },
  {
    path: '/booking',
    sectionId: 'services-section',
    tab: 'services',
    title: `حجز معاينة وتركيب تكييف | ${SITE_NAME_AR}`,
    description:
      'احجز معاينة هندسية مجانية أو تركيب تكييف خلال 24 ساعة مع تربو كوول في الجيزة والقاهرة عبر الموقع أو واتساب 01097640898.',
  },
  {
    path: '/about',
    sectionId: 'about-brand',
    tab: 'why-us',
    title: `عن تربو كوول | أفضل شركة تكييفات 2026 في مصر`,
    description:
      'من هي تربو كوول: شركة توريد وتركيب وصيانة تكييفات، وكيل معتمد لكاريير وميديا وشارب وإل جي وأوكس وبلوتو في الجيزة والقاهرة الكبرى.',
  },
];

export const matchRoute = (pathname) => {
  const clean = String(pathname || '/').replace(/\/+$/, '') || '/';
  return SEO_ROUTES.find((route) => route.path === clean) || SEO_ROUTES[0];
};

export const canonicalFor = (pathname) => {
  const route = matchRoute(pathname);
  return route.path === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${route.path}`;
};

export const SECTION_TO_PATH = {
  'hero-section': '/',
  'catalog-section': '/products',
  'calculator-section': '/calculator',
  'services-section': '/services',
  'why-us-section': '/about',
  'reviews-section': '/about',
  'seo-knowledge-section': '/faq',
  faq: '/faq',
  'about-brand': '/about',
  'howto-choose-ac': '/guide',
  'seo-guides': '/guide',
  'prices-2026-section': '/prices',
};
