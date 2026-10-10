import { Phone } from '../types/phone';
import { PHONES_DATA } from '../data/phonesData';

export interface InternalLinkItem {
  targetPhoneId: string;
  targetPhoneNameAr: string;
  targetPhoneName: string;
  targetImage: string;
  targetLowestPriceSAR: number;
  anchorText: string;
  relationType: 'direct_rival' | 'brand_sibling' | 'budget_alternative' | 'upgrade_path';
  relationBadge: string;
  contextNote: string;
}

export interface InternalLinkingStrategy {
  phoneId: string;
  breadcrumbTrail: { label: string; href: string; actionTab?: string }[];
  categoryHubUrl: string;
  brandHubName: string;
  primaryKeywordAnchor: string;
  relatedPhones: InternalLinkItem[];
  topComparisonLinks: {
    rivalPhoneId: string;
    rivalNameAr: string;
    rivalName: string;
    comparisonAnchor: string;
    comparisonUrl: string;
    keyDifference: string;
  }[];
  categoryArticleLinks: {
    title: string;
    anchorText: string;
    targetTab: string;
    filterBrand?: string;
    description: string;
  }[];
}

/**
 * Returns dynamic on-page internal linking graph for a given smartphone article/review page.
 * Strictly adheres to Google On-Page SEO Best Practices:
 * 1. Descriptive Anchor Text (نصوص روابط وصفية تتضمن الكلمات المفتاحية)
 * 2. Topic Clustering & Semantic Proximity (ربط المنافسين والأجهزة من نفس الفئة)
 * 3. Breadcrumb navigation with Schema-ready structure
 * 4. Deep links to direct head-to-head comparisons (/compare?p1=..&p2=..)
 */
export function getInternalLinkingForPhone(phone: Phone): InternalLinkingStrategy {
  const allOtherPhones = PHONES_DATA.filter((p) => p.id !== phone.id);

  // 1. Same Brand siblings
  const brandSiblings = allOtherPhones.filter((p) => p.brand === phone.brand);

  // 2. Direct Price / Category Competitors (closest lowestPriceSAR)
  const priceSortedCompetitors = [...allOtherPhones].sort((a, b) => {
    return Math.abs(a.lowestPriceSAR - phone.lowestPriceSAR) - Math.abs(b.lowestPriceSAR - phone.lowestPriceSAR);
  });

  // Pick top 3-4 most relevant related phones
  const relatedPhonesMap: Map<string, InternalLinkItem> = new Map();

  // Pick direct rivals from competitors
  for (const rival of priceSortedCompetitors) {
    if (relatedPhonesMap.size >= 4) break;
    
    let relationType: InternalLinkItem['relationType'] = 'direct_rival';
    let relationBadge = 'المنافس الأقرب في الفئة';
    let contextNote = `مقارنة مباشرة في السعر والمواصفات ضد ${phone.nameAr}`;

    if (rival.brand === phone.brand) {
      relationType = 'brand_sibling';
      relationBadge = `خيار آخر من ${phone.brand}`;
      contextNote = `هاتف بديل من نفس منظومة شركة ${phone.brand}`;
    } else if (rival.lowestPriceSAR < phone.lowestPriceSAR * 0.85) {
      relationType = 'budget_alternative';
      relationBadge = 'بديل اقتصادي بسعر أقل';
      contextNote = `إذا كنت تبحث عن توفير ميزانية إضافية بمواصفات ممتازة`;
    } else if (rival.lowestPriceSAR > phone.lowestPriceSAR * 1.15) {
      relationType = 'upgrade_path';
      relationBadge = 'ترقية لفئة أعلى';
      contextNote = `خيار مخصص للباحثين عن أقصى أداء وإمكانيات كاميرا فائقة`;
    }

    relatedPhonesMap.set(rival.id, {
      targetPhoneId: rival.id,
      targetPhoneNameAr: rival.nameAr,
      targetPhoneName: rival.name,
      targetImage: rival.image,
      targetLowestPriceSAR: rival.lowestPriceSAR,
      anchorText: `مراجعة ومواصفات ${rival.nameAr} وسعر الشراء الحقيقي`,
      relationType,
      relationBadge,
      contextNote,
    });
  }

  // Generate Comparison head-to-head internal links
  const topComparisonTargets = priceSortedCompetitors.slice(0, 3);
  const topComparisonLinks = topComparisonTargets.map((rival) => {
    return {
      rivalPhoneId: rival.id,
      rivalNameAr: rival.nameAr,
      rivalName: rival.name,
      comparisonAnchor: `مقارنة ${phone.nameAr} ضد ${rival.nameAr} وجهاً لوجه`,
      comparisonUrl: `/compare?p1=${phone.id}&p2=${rival.id}`,
      keyDifference: rival.specs.performance.chipset.includes('Apple') || phone.specs.performance.chipset.includes('Apple')
        ? 'مقارنة نظام iOS ضد أندرويد مع اختبارات الكاميرات والبطارية'
        : `فارق المعالج (${phone.specs.performance.chipset} مقابل ${rival.specs.performance.chipset}) وسرعة الشحن`,
    };
  });

  const categoryArticleLinks = [
    {
      title: `دليل ومراجعات هواتف ${phone.brand} في السوق العربي`,
      anchorText: `تصفح جميع أسعار ومواصفات أجهزة ${phone.brand} المحدثة اليوم`,
      targetTab: 'explore',
      filterBrand: phone.brand,
      description: `قائمة متكاملة تضم أحدث أجهزة وإصدارات ${phone.brand} مع مقارنة الأسعار في جرير ونون وأمازون.`,
    },
    {
      title: 'جدول عروض وتخفيضات الهواتف بأكبر نسبة خصم',
      anchorText: 'أقوى صفقات وتخفيضات الهواتف الذكية الحية في المتاجر',
      targetTab: 'deals',
      description: 'اكتشف الهواتف التي هبطت أسعارها مؤخراً بأعلى معدلات التوفير المالي.',
    },
    {
      title: 'أداة المقارنة المتقدمة للمواصفات',
      anchorText: 'منصة مقارنة حتى 4 هواتف ذكية معاً مع فحص العيوب والمميزات',
      targetTab: 'compare',
      description: 'قارن دقة الشاشة، سعة البطارية، قوة المعالج، والكاميرات في شاشة واحدة منظمة.',
    },
  ];

  return {
    phoneId: phone.id,
    breadcrumbTrail: [
      { label: 'الرئيسية (قارن تك)', href: '/', actionTab: 'explore' },
      { label: `هواتف ${phone.brand}`, href: `/?brand=${phone.brand}`, actionTab: 'explore' },
      { label: phone.nameAr, href: `/${phone.id}` },
    ],
    categoryHubUrl: `/?brand=${phone.brand}`,
    brandHubName: `مركز أجهزة ${phone.brand}`,
    primaryKeywordAnchor: `سعر ومواصفات ${phone.nameAr} في المتاجر`,
    relatedPhones: Array.from(relatedPhonesMap.values()),
    topComparisonLinks,
    categoryArticleLinks,
  };
}
