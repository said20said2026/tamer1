import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone as PhoneIcon, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Bell, 
  Sparkles, 
  ArrowLeft,
  Smartphone,
  LogOut,
  Sliders,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthMode } from '../types/auth';
import { CurrencyCode } from '../types/phone';
import { CURRENCIES } from '../utils/currency';
import { PHONES_DATA } from '../data/phonesData';

interface LoginPageProps {
  initialMode?: AuthMode;
  onClose?: () => void;
  onNavigateHome?: () => void;
  onSelectPhone?: (phoneId: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  initialMode = 'login',
  onClose,
  onNavigateHome,
  onSelectPhone,
}) => {
  const { 
    user, 
    login, 
    register, 
    loginWithSocial, 
    loginDemoUser, 
    logout,
    updateUserPreferences 
  } = useAuth();

  const [mode, setMode] = useState<AuthMode>(user ? 'profile' : initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>('SAR');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      if (!res.success) {
        setErrorMessage(res.error || 'فشل تسجيل الدخول. تحقق من البيانات المدخلة.');
      } else {
        setSuccessMessage('تم تسجيل الدخول بنجاح! جاري توجيهك...');
        setTimeout(() => {
          if (onClose) onClose();
          else setMode('profile');
        }, 800);
      }
    } catch {
      setErrorMessage('حدث خطأ غير متوقع أثناء الاتصال بالخادم.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    if (password.length < 6) {
      setErrorMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل.');
      setLoading(false);
      return;
    }

    try {
      const res = await register(name, email, password, currency);
      if (!res.success) {
        setErrorMessage(res.error || 'تعذر إنشاء الحساب');
      } else {
        setSuccessMessage('تم إنشاء حسابك بنجاح! مرحباً بك في قارن تك.');
        setTimeout(() => {
          if (onClose) onClose();
          else setMode('profile');
        }, 900);
      }
    } catch {
      setErrorMessage('حدث خطأ أثناء إنشاء الحساب.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('يرجى إدخال بريد إلكتروني صالح.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage(`تم إرسال رابط إعادة تعيين كلمة المرور إلى ${email}`);
    }, 900);
  };

  const handleSocialClick = async (provider: 'google' | 'apple') => {
    setLoading(true);
    try {
      await loginWithSocial(provider);
      setSuccessMessage('تم تسجيل الدخول بنجاح!');
      setTimeout(() => {
        if (onClose) onClose();
        else setMode('profile');
      }, 700);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = () => {
    loginDemoUser();
    setSuccessMessage('تم الدخول بحساب المشتري الذكي التجريبي!');
    setTimeout(() => {
      if (onClose) onClose();
      else setMode('profile');
    }, 600);
  };

  // If already logged in, show user dashboard
  if (user && mode === 'profile') {
    const favoritePhones = PHONES_DATA.filter((p) => user.favorites.includes(p.id));

    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <button 
              onClick={onNavigateHome || onClose} 
              className="hover:text-slate-900 transition-colors flex items-center gap-1 font-medium"
            >
              <ArrowRight className="w-4 h-4" />
              العودة للرئيسية ومقارنة الهواتف
            </button>
            <span aria-hidden="true">/</span>
            <span className="text-slate-900 font-semibold">حسابي الشخصي</span>
          </div>

          <button
            onClick={() => {
              logout();
              setMode('login');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            تسجيل الخروج
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 md:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-black text-2xl shadow-xs">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900">{user.name}</h1>
                  <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-100">
                    عضو موثق
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-0.5">{user.email}</p>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                  <span>انضم: {user.joinedDate}</span>
                  <span aria-hidden="true">·</span>
                  <span>العملة المفضلة: {CURRENCIES[user.preferredCurrency]?.name}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
              <div className="bg-slate-50 border border-slate-200/70 p-3 rounded-xl text-center min-w-[120px]">
                <span className="block text-xl font-extrabold text-slate-900">{user.favorites.length}</span>
                <span className="text-xs text-slate-500 font-medium">الهواتف المفضلة</span>
              </div>
              <div className="bg-slate-50 border border-slate-200/70 p-3 rounded-xl text-center min-w-[120px]">
                <span className="block text-xl font-extrabold text-amber-600">{user.alertIds.length}</span>
                <span className="text-xs text-slate-500 font-medium">تنبيهات الأسعار</span>
              </div>
            </div>
          </div>

          {/* User Preferences Controls */}
          <div className="pt-6">
            <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-slate-500" />
              تفضيلات الحساب والتنبيهات
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <div>
                  <span className="block text-xs font-semibold text-slate-900">تنبيهات البريد الإلكتروني</span>
                  <span className="text-[11px] text-slate-500">إشعار فوري عند انخفاض سعر أي هاتف تتابعه</span>
                </div>
                <input
                  type="checkbox"
                  checked={user.emailNotifications}
                  onChange={(e) => updateUserPreferences({ emailNotifications: e.target.checked })}
                  className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 border-slate-300"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <div>
                  <span className="block text-xs font-semibold text-slate-900">العملة الافتراضية</span>
                  <span className="text-[11px] text-slate-500">تحديث تلقائي لكافة الأسعار المعروضة</span>
                </div>
                <select
                  value={user.preferredCurrency}
                  onChange={(e) => updateUserPreferences({ preferredCurrency: e.target.value as any })}
                  className="bg-white border border-slate-200 text-xs font-semibold text-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {Object.values(CURRENCIES).map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Favorites Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-amber-600" />
              الهواتف التي تتابعها وتنتظر نزول سعرها ({favoritePhones.length})
            </h2>
          </div>

          {favoritePhones.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <p className="text-sm text-slate-500 mb-3">لم تقم بإضافة أي هاتف إلى قائمتك المفضلة حتى الآن.</p>
              <button
                onClick={onNavigateHome || onClose}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                تصفح الهواتف وأضف للمفضلة
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoritePhones.map((phone) => (
                <div
                  key={phone.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={phone.image}
                      alt={phone.name}
                      className="w-16 h-16 object-cover rounded-lg border border-slate-100 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] font-semibold text-amber-700">{phone.brand}</span>
                      <h3 className="text-sm font-bold text-slate-900 truncate">{phone.nameAr}</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        يبدأ من <span className="font-extrabold text-slate-900">{phone.lowestPriceSAR} ر.س</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100 text-xs">
                    <button
                      onClick={() => onSelectPhone && onSelectPhone(phone.id)}
                      className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-center transition-colors"
                    >
                      عرض ومقارنة الأسعار
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-10 px-4 sm:px-6">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8">
          {/* Top Back / Close header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onNavigateHome || onClose}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              الرجوع للتطبيق
            </button>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
              <Sparkles className="w-4 h-4" />
              <span>قارن تك الحساب الموحد</span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-50 text-amber-600 mb-3 border border-amber-200/70">
              {mode === 'login' && <Lock className="w-6 h-6" />}
              {mode === 'register' && <User className="w-6 h-6" />}
              {mode === 'forgot' && <Mail className="w-6 h-6" />}
            </div>

            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {mode === 'login' && 'تسجيل الدخول'}
              {mode === 'register' && 'إنشاء حساب جديد'}
              {mode === 'forgot' && 'استعادة كلمة المرور'}
            </h1>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              {mode === 'login' && 'تابع انخفاض أسعار هواتفك المفضلة واحصل على إشعارات فورية بالصفقات'}
              {mode === 'register' && 'انضم إلى آلاف المشترين الأذكياء وقارن الأسعار بين المتاجر بسهولة'}
              {mode === 'forgot' && 'أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور'}
            </p>
          </div>

          {/* Alert messages */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0"></span>
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Quick Demo Access Bar (Helpful for instant evaluation) */}
          {mode === 'login' && (
            <div className="mb-6 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="text-right">
                <span className="block text-xs font-bold text-slate-900">تجربة سريعة بدون إدخال بيانات؟</span>
                <span className="text-[11px] text-slate-500">دخول تجريبي كـ "مشتري ذكي"</span>
              </div>
              <button
                type="button"
                onClick={handleDemoClick}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
              >
                دخول تجريبي فوري
              </button>
            </div>
          )}

          {/* MODE: LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 text-right">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    dir="ltr"
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50 rounded-xl py-2.5 pr-10 pl-3.5 text-sm text-slate-900 transition-colors focus:outline-none text-left"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null);
                      setMode('forgot');
                    }}
                    className="text-xs text-amber-600 hover:text-amber-700 font-semibold"
                  >
                    نسيت كلمة المرور؟
                  </button>
                  <label className="block text-xs font-bold text-slate-800 text-right">
                    كلمة المرور
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    dir="ltr"
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50 rounded-xl py-2.5 pr-10 pl-10 text-sm text-slate-900 transition-colors focus:outline-none text-left"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                  />
                  <span className="text-xs text-slate-600 font-medium">تذكر بياناتي في هذا المتصفح</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-xl text-sm transition-all shadow-sm active:scale-[0.99] disabled:opacity-50 mt-2"
              >
                {loading ? 'جاري التحقق...' : 'دخول إلى حسابي'}
              </button>
            </form>
          )}

          {/* MODE: REGISTER */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 text-right">
                  الاسم الكامل
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: فيصل العتيبي"
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50 rounded-xl py-2.5 pr-10 pl-3.5 text-sm text-slate-900 transition-colors focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 text-right">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    dir="ltr"
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50 rounded-xl py-2.5 pr-10 pl-3.5 text-sm text-slate-900 transition-colors focus:outline-none text-left"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 text-right">
                  رقم الجوال لتنبيهات الصفقات (اختياري)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <PhoneIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="05XXXXXXXX"
                    dir="ltr"
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50 rounded-xl py-2.5 pr-10 pl-3.5 text-sm text-slate-900 transition-colors focus:outline-none text-left"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 text-right">
                  كلمة المرور (6 خانات أو أكثر)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    dir="ltr"
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50 rounded-xl py-2.5 pr-10 pl-10 text-sm text-slate-900 transition-colors focus:outline-none text-left"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 text-right">
                  العملة المفضلة لعرض الأسعار
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as any)}
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50 rounded-xl py-2.5 pr-10 pl-3.5 text-sm text-slate-900 transition-colors focus:outline-none"
                  >
                    {Object.values(CURRENCIES).map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name} ({c.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-xl text-sm transition-all shadow-sm active:scale-[0.99] disabled:opacity-50"
                >
                  {loading ? 'جاري الإنشاء...' : 'إنشاء حساب جديد مجاناً'}
                </button>
              </div>
            </form>
          )}

          {/* MODE: FORGOT PASSWORD */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 text-right">
                  البريد الإلكتروني المسجل
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    dir="ltr"
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50 rounded-xl py-2.5 pr-10 pl-3.5 text-sm text-slate-900 transition-colors focus:outline-none text-left"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-xl text-sm transition-all shadow-sm active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? 'جاري الإرسال...' : 'إرسال رابط استعادة المرور'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setSuccessMessage(null);
                  setMode('login');
                }}
                className="w-full py-2 text-xs font-bold text-slate-600 hover:text-slate-900 text-center"
              >
                العودة لشاشة الدخول
              </button>
            </form>
          )}

          {/* Social Sign-in Divider (on login and register) */}
          {mode !== 'forgot' && (
            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="relative flex justify-center text-xs uppercase mb-4">
                <span className="bg-white px-2 text-slate-400 font-medium">أو المتابعة عبر</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSocialClick('google')}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialClick('apple')}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <svg className="w-4 h-4 fill-current text-slate-900" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.4c.64-.78 1.08-1.87.96-2.96-.93.04-2.07.62-2.73 1.4-.58.67-1.09 1.77-.95 2.83 1.04.08 2.08-.49 2.72-1.27z" />
                  </svg>
                  <span>Apple</span>
                </button>
              </div>
            </div>
          )}

          {/* Toggle between Login and Register */}
          <div className="mt-6 text-center text-xs text-slate-500">
            {mode === 'login' ? (
              <p>
                ليس لديك حساب بعد؟{' '}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setSuccessMessage(null);
                    setMode('register');
                  }}
                  className="font-bold text-amber-600 hover:text-amber-700 underline underline-offset-2"
                >
                  أنشئ حساباً جديداً
                </button>
              </p>
            ) : mode === 'register' ? (
              <p>
                لديك حساب بالفعل؟{' '}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setSuccessMessage(null);
                    setMode('login');
                  }}
                  className="font-bold text-amber-600 hover:text-amber-700 underline underline-offset-2"
                >
                  تسجيل الدخول
                </button>
              </p>
            ) : null}
          </div>
        </div>

        {/* Benefits bar below card */}
        <div className="mt-6 grid grid-cols-3 gap-2 text-center text-[11px] text-slate-500 font-medium">
          <div className="flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>بيانات محمية ومشفرة</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <Bell className="w-3.5 h-3.5 text-amber-600" />
            <span>تنبيهات فورية بالخصم</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <Smartphone className="w-3.5 h-3.5 text-sky-600" />
            <span>تتبع تاريخ الأسعار</span>
          </div>
        </div>
      </div>
    </div>
  );
};
