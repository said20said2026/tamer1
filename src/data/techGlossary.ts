export interface TechTermExplanation {
  term: string;
  nameAr: string;
  shortDesc: string;
  whyItMatters: string;
  category: 'screen' | 'performance' | 'camera' | 'battery' | 'body' | 'connectivity';
}

export const TECH_GLOSSARY: Record<string, TechTermExplanation> = {
  screen_panel: {
    term: 'panel',
    nameAr: 'نوع لوحة الشاشة (OLED / AMOLED / LTPO)',
    shortDesc: 'تقنية تصنيع الشاشة حيث تضيء كل بكسلة بشكل مستقل لتقديم تباين لانهائي وسواد حقيقي.',
    whyItMatters: 'توفر ألواناً زاهية وتريح العين وتوفر طاقة البطارية بنسبة كبيرة مقارنة بشاشات LCD القديمة.',
    category: 'screen',
  },
  refresh_rate: {
    term: 'refresh_rate',
    nameAr: 'معدل التحديث (Hz / هرتز)',
    shortDesc: 'عدد المرات التي تتغير فيها الصورة المعروضة على الشاشة في الثانية الواحدة (60Hz, 120Hz, 144Hz).',
    whyItMatters: '120Hz تجعل التمرير وتصفح التطبيقات وسرعة الألعاب ناعمة وفائقة السلاسة بدون أي تقطيع بصري.',
    category: 'screen',
  },
  peak_brightness: {
    term: 'peak_brightness',
    nameAr: 'السطوع الأقصى (Nits / شمعة)',
    shortDesc: 'مستوى الإضاءة والسطوع الأقصى الذي يمكن للشاشة الوصول إليه تحت الإضاءة القوية.',
    whyItMatters: 'إذا كان السطوع 2000+ شمعة، ستتمكن من قراءة الشاشة واستخدام الكاميرا بوضوح تام حتى تحت شمس الظهيرة الحارقة.',
    category: 'screen',
  },
  protection_glass: {
    term: 'protection_glass',
    nameAr: 'زجاج الحماية (Ceramic Shield / Gorilla Armor)',
    shortDesc: 'طبقة معالجة كيميائياً توضع فوق الشاشة لمقاومة الكسر والخدوش.',
    whyItMatters: 'تحمي الهاتف من الصدمات وكسور السقوط العرضية، وتقلل انعكاسات أضواء المصابيح بنسبة تصل إلى 75%.',
    category: 'screen',
  },
  chipset: {
    term: 'chipset',
    nameAr: 'المعالج المركزي والذكاء الاصطناعي (Chipset / SoC)',
    shortDesc: 'عقل الهاتف الرئيسي الذي يدير كل العمليات الحسابية والرسوميات وسرعة التطبيقات.',
    whyItMatters: 'المعالجات الحديثة (مثل Snapdragon 8 Elite و A18 Pro) تعني سرعة فورية واستقراراً لعدة سنوات دون أي بطء.',
    category: 'performance',
  },
  gpu: {
    term: 'gpu',
    nameAr: 'المعالج الرسومي (GPU)',
    shortDesc: 'الوحدة المسؤولة عن معالجة الرسوم والصور ثلاثية الأبعاد والألعاب ومؤثرات الفيديو.',
    whyItMatters: 'يحدد كفاءة الهاتف في تشغيل ألعاب مثل ببجي وجينشن إمباكت بأعلى معدل إطارات وبدون تسقيط فريمات.',
    category: 'performance',
  },
  ram: {
    term: 'ram',
    nameAr: 'الذاكرة العشوائية (RAM)',
    shortDesc: 'مساحة العمل السريعة التي تحتفظ بالتطبيقات المفتوحة حالياً في الخلفية.',
    whyItMatters: 'كلما زاد الرام (12GB أو 16GB)، استطعت فتح عشرات التطبيقات والتنقل بينها فورياً دون أن يعيد الهاتف تحميلها.',
    category: 'performance',
  },
  antutu: {
    term: 'antutu',
    nameAr: 'اختبار AnTuTu القياسي',
    shortDesc: 'مقياس عالمي موحد يقيس القوة الشاملة للهاتف في المعالجة والرسوم والذاكرة وسرعة النظام.',
    whyItMatters: 'النقاط فوق 1,500,000 تعني أداءً فائقاً يتصدر أقوى الهواتف في العالم لعام 2025/2026.',
    category: 'performance',
  },
  main_camera: {
    term: 'main_camera',
    nameAr: 'الكاميرا الرئيسية ومستشعر OIS',
    shortDesc: 'الكاميرا الأساسية ذات الدقة العالية وميزة التثبيت البصري الميكانيكي OIS.',
    whyItMatters: 'ميزة OIS تلغي اهتزاز اليد وتلتقط صوراً ليلية حادة ومقاطع فيديو ثابتة بدون أي رجفة.',
    category: 'camera',
  },
  ultrawide_camera: {
    term: 'ultrawide_camera',
    nameAr: 'الكاميرا فائقة الاتساع (Ultrawide)',
    shortDesc: 'عدسة ذات زاوية رؤية واسعة جداً (120 درجة تقريباً) تشبه رؤية عين الصقر.',
    whyItMatters: 'تتيح لك تصوير المناظر الطبيعية الشاسعة أو جمع العائلة كاملة في صورة واحدة دون الحاجة للرجوع للخلف.',
    category: 'camera',
  },
  telephoto_camera: {
    term: 'telephoto_camera',
    nameAr: 'عدسة التقريب البصري (Telephoto / Periscope)',
    shortDesc: 'عدسة تقريب حقيقي ميكانيكي (3x أو 5x) تقرب المشهد باستخدام حركة المرايا والعدسات.',
    whyItMatters: 'تمنحك لقطات مقربة حادة جداً للأجسام البعيدة وصور بورتريه احترافية بخلفية مموهة طبيعياً دون تشويش رقمي.',
    category: 'camera',
  },
  video_recording: {
    term: 'video_recording',
    nameAr: 'تسجيل الفيديو ودعم 4K / 8K / Dolby Vision',
    shortDesc: 'أعلى دقة تسجيل وتنسيق ألوان سينمائي يدعمه الهاتف.',
    whyItMatters: 'تصوير 4K بمعدل 60 أو 120 إطاراً يتيح التقاط حركة بطيئة سينمائية وألواناً واقعية كالسينما.',
    category: 'camera',
  },
  battery_capacity: {
    term: 'battery_capacity',
    nameAr: 'سعة البطارية (mAh / مللي أمبير)',
    shortDesc: 'حجم سعة تخزين الطاقة الكهربائية داخل بطارية الهاتف.',
    whyItMatters: 'سعة 5000 إلى 6000 مللي أمبير تعني استمرار عمل الهاتف ليوم كامل أو يومين دون الحاجة لإعادة الشحن أثناء خروجك.',
    category: 'battery',
  },
  fast_charging: {
    term: 'fast_charging',
    nameAr: 'الشحن السريع السلكي (Watt / واط)',
    shortDesc: 'القدرة الكهربائية التي يستقبلها الهاتف للشحن في الدقيقة الواحدة.',
    whyItMatters: 'شواحن 90W أو 120W تشحن هاتفك بالكامل من 0 إلى 100% خلال 19 إلى 30 دقيقة فقط أثناء تناولك للقهوة!',
    category: 'battery',
  },
  wireless_charging: {
    term: 'wireless_charging',
    nameAr: 'الشحن اللاسلكي (Wireless / MagSafe)',
    shortDesc: 'تقنية شحن البطارية عبر الحث الكهرومغناطيسي بوضع الهاتف على القاعدة دون أسلاك.',
    whyItMatters: 'راحة تامة في المكتب أو السيارة، وضع الهاتف فوق الشاحن يبدأ الشحن تلقائياً.',
    category: 'battery',
  },
  water_resistance: {
    term: 'water_resistance',
    nameAr: 'معيار مقاومة الماء والغبار (IP68 / IP69)',
    shortDesc: 'شهادة اعتماد عالمية ضد الغمر في الماء وضغط السوائل.',
    whyItMatters: 'IP68 تعني أن الهاتف يتحمل السقوط في المسبح أو المغسلة حتى عمق 1.5 إلى 6 أمتار دون أن يتضرر مطلقاً.',
    category: 'body',
  },
  connectivity_5g: {
    term: 'connectivity_5g',
    nameAr: 'شبكات الجيل الخامس (5G)',
    shortDesc: 'أحدث معيار لشبكات الاتصال اللاسلكي الخلوي فائق السرعة.',
    whyItMatters: 'تحميل ملفات وأفلام ضخمة في ثوانٍ معدودة وبث ألعاب مباشر بدون تأخير أو بطء في الأماكن المزدحمة.',
    category: 'connectivity',
  },
  nfc: {
    term: 'nfc',
    nameAr: 'تقنية الاتصال قريب المدى (NFC)',
    shortDesc: 'شريحة لاسلكية تنقل البيانات عند ملامسة الهاتف لجهاز آخر لمسافة سنتيمترات معدودة.',
    whyItMatters: 'تتيح لك الدفع الإلكتروني في المحلات والمطاعم بواسطة هاتفك عبر Apple Pay أو mada Pay بدون إخراج بطاقة البنك.',
    category: 'connectivity',
  },
};
