import React, { useState, useEffect } from 'react';
import {
  Star,
  ThumbsUp,
  CheckCircle2,
  MessageSquare,
  Filter,
  Plus,
  User,
  ShieldCheck,
  Store,
  Calendar,
  Sparkles,
  Check,
  X,
  AlertCircle,
  LogIn,
  Lock,
  ThumbsDown,
  Clock,
  ChevronDown
} from 'lucide-react';
import { UserReview } from '../types/review';
import { INITIAL_REVIEWS } from '../data/initialReviews';
import { useAuth } from '../context/AuthContext';
import { RatingDistributionChart } from './RatingDistributionChart';

export interface UserReviewsProps {
  phoneId: string;
  phoneName: string;
  onOpenAuth?: () => void;
}

const STORAGE_KEY = 'qarenly_user_reviews';
const HELPFUL_VOTES_KEY = 'qarenly_helpful_votes';

export const UserReviews: React.FC<UserReviewsProps> = ({
  phoneId,
  phoneName,
  onOpenAuth,
}) => {
  const { user, isAuthenticated, loginDemoUser, login } = useAuth();

  // All reviews state
  const [reviews, setReviews] = useState<UserReview[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const existingIds = new Set(parsed.map((r: UserReview) => r.id));
        const missingInitial = INITIAL_REVIEWS.filter((r) => !existingIds.has(r.id));
        return [...parsed, ...missingInitial];
      }
      return INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // Track which reviews the user has clicked "Helpful" on
  const [helpfulVotedIds, setHelpfulVotedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(HELPFUL_VOTES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Form display toggle
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Quick Inline Login Modal state (if user prefers logging in right inside reviews)
  const [quickEmail, setQuickEmail] = useState('');
  const [quickPassword, setQuickPassword] = useState('');
  const [quickLoginError, setQuickLoginError] = useState<string | null>(null);
  const [isQuickLoggingIn, setIsQuickLoggingIn] = useState(false);

  // Review Form States
  const [formRating, setFormRating] = useState<number>(5);
  const [formHoverRating, setFormHoverRating] = useState<number | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formComment, setFormComment] = useState('');
  const [formStore, setFormStore] = useState('أمازون السعودية');
  const [formPeriod, setFormPeriod] = useState('شهر');
  const [formRecommend, setFormRecommend] = useState(true);
  const [formProsInput, setFormProsInput] = useState('');
  const [formConsInput, setFormConsInput] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Filter & Sort
  const [selectedStarFilter, setSelectedStarFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'helpful' | 'newest' | 'rating_desc'>('helpful');

  // Filter reviews for this specific phone
  const phoneReviews = reviews.filter((r) => r.phoneId === phoneId);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    } catch (e) {
      console.error(e);
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem(HELPFUL_VOTES_KEY, JSON.stringify(helpfulVotedIds));
    } catch (e) {
      console.error(e);
    }
  }, [helpfulVotedIds]);

  // Statistics calculation
  const totalReviews = phoneReviews.length;
  const avgRating =
    totalReviews > 0
      ? Number((phoneReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
      : 4.8;

  const starCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  phoneReviews.forEach((r) => {
    const star = Math.max(1, Math.min(5, Math.round(r.rating)));
    starCounts[star] = (starCounts[star] || 0) + 1;
  });

  const recommendPercent =
    totalReviews > 0
      ? Math.round((phoneReviews.filter((r) => r.recommend).length / totalReviews) * 100)
      : 95;

  // Filtered and sorted reviews
  const displayedReviews = phoneReviews
    .filter((r) => {
      if (selectedStarFilter !== null) {
        return r.rating === selectedStarFilter;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'helpful') return b.helpfulCount - a.helpfulCount;
      if (sortBy === 'rating_desc') return b.rating - a.rating;
      return b.id.localeCompare(a.id);
    });

  const handleHelpfulClick = (reviewId: string) => {
    const hasVoted = helpfulVotedIds.includes(reviewId);
    if (hasVoted) {
      setHelpfulVotedIds(helpfulVotedIds.filter((id) => id !== reviewId));
      setReviews(
        reviews.map((r) =>
          r.id === reviewId ? { ...r, helpfulCount: Math.max(0, r.helpfulCount - 1) } : r
        )
      );
    } else {
      setHelpfulVotedIds([...helpfulVotedIds, reviewId]);
      setReviews(
        reviews.map((r) =>
          r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
        )
      );
    }
  };

  const handleStartReview = () => {
    if (!isAuthenticated && !user) {
      setShowLoginPrompt(true);
      return;
    }
    setIsFormOpen(true);
    setShowLoginPrompt(false);
  };

  const handleDemoLogin = () => {
    loginDemoUser();
    setShowLoginPrompt(false);
    setIsFormOpen(true);
  };

  const handleQuickLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuickLoginError(null);
    if (!quickEmail || !quickEmail.includes('@')) {
      setQuickLoginError('يرجى إدخال بريد إلكتروني صالح');
      return;
    }
    setIsQuickLoggingIn(true);
    const res = await login(quickEmail, quickPassword || 'password123');
    setIsQuickLoggingIn(false);
    if (res.success) {
      setShowLoginPrompt(false);
      setIsFormOpen(true);
    } else {
      setQuickLoginError(res.error || 'حدث خطأ أثناء تسجيل الدخول');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!user) {
      setSubmitError('يجب تسجيل الدخول أولاً لإضافة المراجعة');
      setShowLoginPrompt(true);
      return;
    }

    if (!formComment.trim()) {
      setSubmitError('يرجى كتابة تفاصيل تجربتك مع الهاتف');
      return;
    }
    if (!formTitle.trim()) {
      setSubmitError('يرجى كتابة عنوان للمراجعة');
      return;
    }

    const pros = formProsInput
      .split(',')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    const cons = formConsInput
      .split(',')
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    const newReview: UserReview = {
      id: `rev_${Date.now()}`,
      phoneId,
      authorName: user.name,
      authorAvatar: user.avatarUrl,
      rating: formRating,
      title: formTitle.trim(),
      comment: formComment.trim(),
      date: 'اليوم',
      storePurchasedFrom: formStore,
      periodOfUse: formPeriod,
      recommend: formRecommend,
      pros: pros.length > 0 ? pros : undefined,
      cons: cons.length > 0 ? cons : undefined,
      helpfulCount: 0,
      isVerifiedPurchase: true,
    };

    setReviews([newReview, ...reviews]);
    setSubmitSuccess(true);

    // Reset fields
    setFormTitle('');
    setFormComment('');
    setFormProsInput('');
    setFormConsInput('');

    setTimeout(() => {
      setSubmitSuccess(false);
      setIsFormOpen(false);
    }, 1500);
  };

  const getRatingLabel = (rating: number) => {
    switch (rating) {
      case 5:
        return 'ممتاز - تجربة استثنائية';
      case 4:
        return 'جيد جداً - يستحق الشراء';
      case 3:
        return 'جيد - أداء مقبول';
      case 2:
        return 'دون التوقعات';
      case 1:
        return 'سيء - لا أنصح به';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6 pt-2">
      {/* 1. Header with title & Add Review button */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                تقييمات وتجارب المشترين لـ {phoneName}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                مراجعات موثقة من مجتمع المستخدمين بعد تجارب استخدام حقيقية
              </p>
            </div>
          </div>

          <button
            onClick={handleStartReview}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-xs sm:text-sm transition-all shadow-sm hover:shadow flex items-center gap-2 shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>أضف تقييمك وتجربتك</span>
          </button>
        </div>

        {/* 2. Rating Breakdown and Distribution Charts */}
        <RatingDistributionChart
          starCounts={starCounts}
          totalReviews={totalReviews}
          avgRating={avgRating}
          recommendPercent={recommendPercent}
          selectedStarFilter={selectedStarFilter}
          onSelectStar={(star) => setSelectedStarFilter(star)}
          phoneName={phoneName}
        />
      </div>

      {/* 3. LOGIN REQUIRED MODAL / PROMPT (Appears when guest clicks Add Review) */}
      {showLoginPrompt && !isAuthenticated && !user && (
        <div className="p-6 bg-gradient-to-br from-amber-50 via-white to-slate-50 dark:from-slate-800/90 dark:via-slate-800 dark:to-slate-900 border-2 border-amber-300 dark:border-amber-600/40 rounded-3xl shadow-lg relative animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={() => setShowLoginPrompt(false)}
            className="absolute top-4 left-4 p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Lock className="w-6 h-6" />
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <span className="inline-block px-2.5 py-0.5 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-black rounded-md mb-1.5">
                  تسجيل الدخول مطلوب
                </span>
                <h4 className="text-base font-black text-slate-900 dark:text-white">
                  يجب تسجيل الدخول لإضافة مراجعة وتقييم لـ {phoneName}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  لضمان موثوقية التقييمات وحماية المشترين من المراجعات الوهمية، نشترط تسجيل الدخول قبل إضافة تجربتك مع الهاتف.
                </p>
              </div>

              {/* Quick Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {/* 1-Click Demo Login */}
                <button
                  onClick={handleDemoLogin}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2 active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>دخول تجريبي فوري (Demo) والمتابعة</span>
                </button>

                {/* Redirect / open full Auth Page */}
                {onOpenAuth && (
                  <button
                    onClick={() => {
                      setShowLoginPrompt(false);
                      onOpenAuth();
                    }}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>صفحة تسجيل الدخول / إنشاء حساب</span>
                  </button>
                )}
              </div>

              {/* Or Quick Inline Login */}
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <details className="text-xs group">
                  <summary className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1.5 select-none">
                    <span>تسجيل دخول سريع بالبريد الإلكتروني هنا مباشرة</span>
                    <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                  </summary>

                  <form onSubmit={handleQuickLoginSubmit} className="mt-3 space-y-2.5 max-w-sm">
                    {quickLoginError && (
                      <div className="p-2 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 rounded-lg text-xs flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{quickLoginError}</span>
                      </div>
                    )}
                    <div>
                      <input
                        type="email"
                        value={quickEmail}
                        onChange={(e) => setQuickEmail(e.target.value)}
                        placeholder="البريد الإلكتروني (مثال: user@example.com)"
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="password"
                        value={quickPassword}
                        onChange={(e) => setQuickPassword(e.target.value)}
                        placeholder="كلمة المرور (اختياري للتجربة)"
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isQuickLoggingIn}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      {isQuickLoggingIn ? 'جاري الدخول...' : 'تسجيل الدخول'}
                    </button>
                  </form>
                </details>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Logged-in User Review Form */}
      {isFormOpen && user && (
        <div className="p-5 sm:p-6 bg-white dark:bg-slate-800/95 border-2 border-amber-400 dark:border-amber-500/60 rounded-3xl shadow-lg relative animate-in fade-in slide-in-from-top-4 duration-200">
          <button
            onClick={() => setIsFormOpen(false)}
            className="absolute top-4 left-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h4 className="text-base font-black text-slate-900 dark:text-white">
              مشاركة تجربتك مع {phoneName}
            </h4>
          </div>

          {/* User Profile Badge */}
          <div className="flex items-center gap-3 p-3 bg-amber-50/70 dark:bg-slate-900/60 rounded-2xl mb-4 border border-amber-200/50 dark:border-slate-700">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-amber-400"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm">
                {user.name.charAt(0)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  {user.name}
                </span>
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold rounded-full">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  مشتري مسجل
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                سيتم نشر المراجعة باسمك المعتمد
              </p>
            </div>
          </div>

          {submitSuccess ? (
            <div className="p-8 text-center space-y-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h5 className="text-base font-black text-emerald-900 dark:text-emerald-200">
                شكراً لك! تم إضافة تقييمك بنجاح
              </h5>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                مراجعتك تساعد آلاف المتسوقين على اتخاذ القرار الصحيح
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {submitError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Star Rating Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  تقييمك الإجمالي للهاتف *
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormRating(star)}
                        onMouseEnter={() => setFormHoverRating(star)}
                        onMouseLeave={() => setFormHoverRating(null)}
                        className="p-1 focus:outline-none transition-transform hover:scale-125"
                      >
                        <Star
                          className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                            star <= (formHoverRating ?? formRating)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300 dark:text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg">
                    {getRatingLabel(formHoverRating ?? formRating)}
                  </span>
                </div>
              </div>

              {/* Title & Comment */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    عنوان ملخص للمراجعة *
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="مثال: أفضل شاشة وكاميرا في فئته، بطارية ممتازة..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    تفاصيل التجربة والتعليق الكامل *
                  </label>
                  <textarea
                    rows={4}
                    value={formComment}
                    onChange={(e) => setFormComment(e.target.value)}
                    placeholder="شاركنا رأيك في الأداء، الكاميرا، البطارية، الشحن، والحرارة بعد استخدامك للهاتف..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
                    required
                  />
                </div>
              </div>

              {/* Store & Usage Period */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    متجر الشراء
                  </label>
                  <select
                    value={formStore}
                    onChange={(e) => setFormStore(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="أمازون السعودية">أمازون السعودية</option>
                    <option value="نون (Noon)">نون (Noon)</option>
                    <option value="مكتبة جرير">مكتبة جرير</option>
                    <option value="إكسترا (eXtra)">إكسترا (eXtra)</option>
                    <option value="أمازون العالمي (Amazon Global)">أمازون العالمي (Amazon Global)</option>
                    <option value="علي إكسبريس العالمي (AliExpress Global)">علي إكسبريس العالمي (AliExpress Global)</option>
                    <option value="B&H Photo Video">B&H Photo Video (نيويورك)</option>
                    <option value="متجر محلي / آخر">متجر محلي آخر</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    مدة الاستخدام قبل كتابة المراجعة
                  </label>
                  <select
                    value={formPeriod}
                    onChange={(e) => setFormPeriod(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="أسبوع">أسبوع واحد</option>
                    <option value="أسبوعين">أسبوعين</option>
                    <option value="شهر">شهر كامل</option>
                    <option value="3 أشهر">3 أشهر</option>
                    <option value="6 أشهر أو أكثر">6 أشهر أو أكثر</option>
                  </select>
                </div>
              </div>

              {/* Recommendation Choice */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  هل تنصح الآخرين بشراء هذا الهاتف؟
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200">
                    <input
                      type="radio"
                      name="recommend"
                      checked={formRecommend === true}
                      onChange={() => setFormRecommend(true)}
                      className="text-amber-500 focus:ring-amber-500"
                    />
                    <ThumbsUp className="w-4 h-4 text-emerald-600" />
                    <span>نعم، أوصي به بشدة</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200">
                    <input
                      type="radio"
                      name="recommend"
                      checked={formRecommend === false}
                      onChange={() => setFormRecommend(false)}
                      className="text-amber-500 focus:ring-amber-500"
                    />
                    <ThumbsDown className="w-4 h-4 text-rose-500" />
                    <span>لا، لا أنصح بشرائه</span>
                  </label>
                </div>
              </div>

              {/* Pros & Cons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                    أبرز الإيجابيات (افصل بينها بفواصل)
                  </label>
                  <input
                    type="text"
                    value={formProsInput}
                    onChange={(e) => setFormProsInput(e.target.value)}
                    placeholder="شاشة ساطعة، بطارية جبارة، شحن سريع"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-rose-700 dark:text-rose-400 mb-1">
                    أبرز السلبيات (افصل بينها بفواصل)
                  </label>
                  <input
                    type="text"
                    value={formConsInput}
                    onChange={(e) => setFormConsInput(e.target.value)}
                    placeholder="السعر مرتفع، الوزن ثقيل"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-sm transition-all"
                >
                  نشر المراجعة الآن
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* 5. Reviews List Controls (Filter & Sort) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            تصفية التقييمات:
          </span>
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedStarFilter(null)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                selectedStarFilter === null
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              الكل ({totalReviews})
            </button>
            {[5, 4, 3, 2, 1].map((s) => (
              <button
                key={s}
                onClick={() => setSelectedStarFilter(selectedStarFilter === s ? null : s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
                  selectedStarFilter === s
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                <span>{s}</span>
                <Star className="w-3 h-3 fill-current" />
                <span className="text-[10px]">({starCounts[s] || 0})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs text-slate-500 dark:text-slate-400">ترتيب حسب:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 font-bold focus:outline-none"
          >
            <option value="helpful">الأكثر فائدة للمستخدمين</option>
            <option value="rating_desc">الأعلى تقييماً</option>
            <option value="newest">الأحدث تاريخاً</option>
          </select>
        </div>
      </div>

      {/* 6. Reviews Cards List */}
      <div className="space-y-4">
        {displayedReviews.length === 0 ? (
          <div className="text-center py-12 px-4 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
            <MessageSquare className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              لا توجد تقييمات مطابقة لهذا الفلتر
            </p>
            <button
              onClick={() => setSelectedStarFilter(null)}
              className="mt-2 text-xs font-bold text-amber-600 hover:underline"
            >
              عرض كافة التقييمات
            </button>
          </div>
        ) : (
          displayedReviews.map((review) => {
            const hasVotedHelpful = helpfulVotedIds.includes(review.id);

            return (
              <div
                key={review.id}
                className="p-5 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-500/50 transition-all shadow-xs"
              >
                {/* Header: Author + Verified + Date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    {review.authorAvatar ? (
                      <img
                        src={review.authorAvatar}
                        alt={review.authorName}
                        className="w-10 h-10 rounded-full object-cover border border-amber-300 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-black flex items-center justify-center text-sm shrink-0">
                        {review.authorName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900 dark:text-white">
                          {review.authorName}
                        </span>
                        {review.isVerifiedPurchase && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            مشتري موثق
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {review.storePurchasedFrom && (
                          <span className="flex items-center gap-1">
                            <Store className="w-3 h-3 text-amber-500" />
                            {review.storePurchasedFrom}
                          </span>
                        )}
                        {review.periodOfUse && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            استخدام لمدة {review.periodOfUse}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {review.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1.5 self-start sm:self-auto bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 rounded-xl border border-amber-200/60 dark:border-amber-800/40">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= review.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300 dark:text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-black text-amber-700 dark:text-amber-400">
                      {review.rating}.0
                    </span>
                  </div>
                </div>

                {/* Review Title & Body */}
                <div className="space-y-2 mb-3">
                  <h5 className="text-sm font-black text-slate-900 dark:text-white">
                    {review.title}
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {review.comment}
                  </p>
                </div>

                {/* Pros and Cons */}
                {((review.pros && review.pros.length > 0) || (review.cons && review.cons.length > 0)) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl text-xs">
                    {review.pros && review.pros.length > 0 && (
                      <div className="space-y-1">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          الإيجابيات:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {review.pros.map((p, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-md text-[11px]"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {review.cons && review.cons.length > 0 && (
                      <div className="space-y-1">
                        <span className="font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1">
                          <X className="w-3.5 h-3.5 text-rose-600" />
                          السلبيات:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {review.cons.map((c, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-rose-100/70 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 rounded-md text-[11px]"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer: Recommendation & Helpful vote button */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-750 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    {review.recommend ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        يوصي بشراء الجهاز
                      </span>
                    ) : (
                      <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                        <ThumbsDown className="w-3.5 h-3.5" />
                        لا يوصي بشراء الجهاز
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleHelpfulClick(review.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 ${
                      hasVotedHelpful
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${hasVotedHelpful ? 'fill-current' : ''}`} />
                    <span>مفيد</span>
                    <span>({review.helpfulCount})</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
