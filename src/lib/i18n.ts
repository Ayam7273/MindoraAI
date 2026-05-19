/* ─────────────────────────────────────────────
   Mindora — Lightweight i18n
   Supported: English, Arabic, Spanish, French, Chinese
   ───────────────────────────────────────────── */

export type LangCode = "en" | "ar" | "es" | "fr" | "zh";

export interface LangMeta {
  code: LangCode;
  label: string;        // native name shown in UI
  englishLabel: string; // shown as sub-label
  dir: "ltr" | "rtl";
  flag: string;
}

export const LANGUAGES: LangMeta[] = [
  { code: "en", label: "English",  englishLabel: "English",  dir: "ltr", flag: "🇬🇧" },
  { code: "ar", label: "العربية",   englishLabel: "Arabic",   dir: "rtl", flag: "🇸🇦" },
  { code: "es", label: "Español",   englishLabel: "Spanish",  dir: "ltr", flag: "🇪🇸" },
  { code: "fr", label: "Français",  englishLabel: "French",   dir: "ltr", flag: "🇫🇷" },
  { code: "zh", label: "中文",       englishLabel: "Chinese",  dir: "ltr", flag: "🇨🇳" },
];

// ── Translation table ──────────────────────────────────────────────────────────
export type TranslationKey =
  // Navigation
  | "nav.home" | "nav.aiChat" | "nav.mood" | "nav.journal" | "nav.stress"
  | "nav.sleep" | "nav.mindfulness" | "nav.community" | "nav.resources"
  | "nav.progress" | "nav.profile" | "nav.copingToolkit"
  // Common actions
  | "action.save" | "action.cancel" | "action.back" | "action.continue"
  | "action.signIn" | "action.signUp" | "action.logOut" | "action.getStarted"
  | "action.post" | "action.send" | "action.search"
  // Home
  | "home.greeting.morning" | "home.greeting.afternoon" | "home.greeting.evening"
  | "home.checkin" | "home.checkinSub" | "home.quickAccess" | "home.mindfulTracker"
  | "home.mindfulResources" | "home.seeAll" | "home.todayGlance"
  // Mood
  | "mood.title" | "mood.history" | "mood.aiSuggestions" | "mood.setMood"
  | "mood.howFeeling" | "mood.slideSelect" | "mood.loggedMood"
  // Journal
  | "journal.title" | "journal.newEntry" | "journal.noEntries" | "journal.saveEntry"
  | "journal.titleLabel" | "journal.entryLabel" | "journal.savedTitle"
  // Profile
  | "profile.general" | "profile.preferences" | "profile.security" | "profile.data"
  | "profile.personalInfo" | "profile.language" | "profile.inviteFriends"
  | "profile.helpCenter" | "profile.securityPrivacy" | "profile.clearData"
  | "profile.closeAccount" | "profile.member" | "profile.copyLink" | "profile.linkCopied"
  // Auth
  | "auth.welcomeTitle" | "auth.welcomeSub" | "auth.signInTitle" | "auth.signUpTitle"
  | "auth.email" | "auth.password" | "auth.forgotPassword" | "auth.noAccount"
  | "auth.haveAccount"
  // Language screen
  | "lang.title" | "lang.currentlySelected" | "lang.saveLanguage"
  // Security
  | "security.title" | "security.password" | "security.changePassword"
  // Help
  | "help.title" | "help.faq" | "help.liveChat" | "help.supportText"
  // Misc
  | "misc.disclaimer" | "misc.loading" | "misc.score" | "misc.mentallyStable";

type Translations = Record<TranslationKey, string>;

const en: Translations = {
  // Navigation
  "nav.home": "Home", "nav.aiChat": "AI Chat", "nav.mood": "Mood",
  "nav.journal": "Journal", "nav.stress": "Stress", "nav.sleep": "Sleep",
  "nav.mindfulness": "Mindfulness", "nav.community": "Community",
  "nav.resources": "Resources", "nav.progress": "Progress", "nav.profile": "Profile",
  "nav.copingToolkit": "Coping Toolkit",
  // Actions
  "action.save": "Save", "action.cancel": "Cancel", "action.back": "Back",
  "action.continue": "Continue", "action.signIn": "Sign In", "action.signUp": "Sign Up",
  "action.logOut": "Log Out", "action.getStarted": "Get Started",
  "action.post": "Post", "action.send": "Send", "action.search": "Search",
  // Home
  "home.greeting.morning": "Good morning",
  "home.greeting.afternoon": "Good afternoon",
  "home.greeting.evening": "Good evening",
  "home.checkin": "How are you feeling today?",
  "home.checkinSub": "Tap to log your mood",
  "home.quickAccess": "Quick Access",
  "home.mindfulTracker": "Mindful Tracker",
  "home.mindfulResources": "Mindful Resources",
  "home.seeAll": "See all",
  "home.todayGlance": "Today at a Glance",
  // Mood
  "mood.title": "Mood", "mood.history": "History",
  "mood.aiSuggestions": "AI Suggestions",
  "mood.setMood": "Set Mood", "mood.howFeeling": "How are you feeling?",
  "mood.slideSelect": "Slide to select your current mood",
  "mood.loggedMood": "Mood logged",
  // Journal
  "journal.title": "Journal", "journal.newEntry": "New journal",
  "journal.noEntries": "No entries yet", "journal.saveEntry": "Save Entry",
  "journal.titleLabel": "Title (optional)", "journal.entryLabel": "Entry",
  "journal.savedTitle": "Entry saved!",
  // Profile
  "profile.general": "General", "profile.preferences": "Preferences",
  "profile.security": "Security", "profile.data": "Data",
  "profile.personalInfo": "Personal Information",
  "profile.language": "Language",
  "profile.inviteFriends": "Invite Friends",
  "profile.helpCenter": "Help Center",
  "profile.securityPrivacy": "Security & Privacy",
  "profile.clearData": "Clear All App Data",
  "profile.closeAccount": "Close Account",
  "profile.member": "Mindora member",
  "profile.copyLink": "Copy Invite Link",
  "profile.linkCopied": "Link copied!",
  // Auth
  "auth.welcomeTitle": "Welcome to Mindora AI",
  "auth.welcomeSub": "Your mindful mental health AI companion.",
  "auth.signInTitle": "Sign In To Mindora AI",
  "auth.signUpTitle": "Create your account",
  "auth.email": "Email address", "auth.password": "Password",
  "auth.forgotPassword": "Forgot Password",
  "auth.noAccount": "Don't have an account?",
  "auth.haveAccount": "Already have an account?",
  // Language
  "lang.title": "Language", "lang.currentlySelected": "Currently selected",
  "lang.saveLanguage": "Save Language",
  // Security
  "security.title": "Security Settings", "security.password": "Password",
  "security.changePassword": "Change",
  // Help
  "help.title": "Help Center", "help.faq": "FAQ", "help.liveChat": "Live Chat",
  "help.supportText": "Supportive tools for everyday mental wellness.",
  // Misc
  "misc.disclaimer": "Mindora is not a substitute for professional mental health care.",
  "misc.loading": "Loading…", "misc.score": "Mindora Score",
  "misc.mentallyStable": "Mentally Stable",
};

const ar: Translations = {
  "nav.home": "الرئيسية", "nav.aiChat": "محادثة AI", "nav.mood": "المزاج",
  "nav.journal": "المذكرة", "nav.stress": "التوتر", "nav.sleep": "النوم",
  "nav.mindfulness": "التأمل", "nav.community": "المجتمع",
  "nav.resources": "الموارد", "nav.progress": "التقدم", "nav.profile": "الملف",
  "nav.copingToolkit": "أدوات التأقلم",
  "action.save": "حفظ", "action.cancel": "إلغاء", "action.back": "رجوع",
  "action.continue": "متابعة", "action.signIn": "تسجيل الدخول",
  "action.signUp": "إنشاء حساب", "action.logOut": "تسجيل الخروج",
  "action.getStarted": "ابدأ الآن", "action.post": "نشر",
  "action.send": "إرسال", "action.search": "بحث",
  "home.greeting.morning": "صباح الخير",
  "home.greeting.afternoon": "مساء الخير",
  "home.greeting.evening": "مساء النور",
  "home.checkin": "كيف حالك اليوم؟",
  "home.checkinSub": "اضغط لتسجيل مزاجك",
  "home.quickAccess": "الوصول السريع",
  "home.mindfulTracker": "متتبع اليقظة",
  "home.mindfulResources": "موارد اليقظة",
  "home.seeAll": "عرض الكل",
  "home.todayGlance": "لمحة اليوم",
  "mood.title": "المزاج", "mood.history": "السجل",
  "mood.aiSuggestions": "اقتراحات AI",
  "mood.setMood": "تعيين المزاج", "mood.howFeeling": "كيف تشعر؟",
  "mood.slideSelect": "اسحب لاختيار مزاجك الحالي",
  "mood.loggedMood": "تم تسجيل المزاج",
  "journal.title": "المذكرة", "journal.newEntry": "إدخال جديد",
  "journal.noEntries": "لا توجد إدخالات بعد",
  "journal.saveEntry": "حفظ الإدخال",
  "journal.titleLabel": "العنوان (اختياري)",
  "journal.entryLabel": "الإدخال", "journal.savedTitle": "تم الحفظ!",
  "profile.general": "عام", "profile.preferences": "التفضيلات",
  "profile.security": "الأمان", "profile.data": "البيانات",
  "profile.personalInfo": "المعلومات الشخصية",
  "profile.language": "اللغة", "profile.inviteFriends": "دعوة الأصدقاء",
  "profile.helpCenter": "مركز المساعدة",
  "profile.securityPrivacy": "الأمان والخصوصية",
  "profile.clearData": "مسح جميع بيانات التطبيق",
  "profile.closeAccount": "إغلاق الحساب",
  "profile.member": "عضو ماينـدورا", "profile.copyLink": "نسخ رابط الدعوة",
  "profile.linkCopied": "تم نسخ الرابط!",
  "auth.welcomeTitle": "مرحباً بك في ماينـدورا AI",
  "auth.welcomeSub": "رفيقك الذكي للصحة النفسية.",
  "auth.signInTitle": "تسجيل الدخول إلى ماينـدورا AI",
  "auth.signUpTitle": "إنشاء حسابك",
  "auth.email": "البريد الإلكتروني", "auth.password": "كلمة المرور",
  "auth.forgotPassword": "نسيت كلمة المرور",
  "auth.noAccount": "ليس لديك حساب؟",
  "auth.haveAccount": "لديك حساب بالفعل؟",
  "lang.title": "اللغة", "lang.currentlySelected": "المحدد حالياً",
  "lang.saveLanguage": "حفظ اللغة",
  "security.title": "إعدادات الأمان", "security.password": "كلمة المرور",
  "security.changePassword": "تغيير",
  "help.title": "مركز المساعدة", "help.faq": "الأسئلة الشائعة",
  "help.liveChat": "الدردشة المباشرة",
  "help.supportText": "أدوات داعمة لصحتك النفسية اليومية.",
  "misc.disclaimer": "ماينـدورا ليست بديلاً عن الرعاية النفسية المتخصصة.",
  "misc.loading": "جارٍ التحميل…", "misc.score": "نقاط ماينـدورا",
  "misc.mentallyStable": "مستقر نفسياً",
};

const es: Translations = {
  "nav.home": "Inicio", "nav.aiChat": "Chat IA", "nav.mood": "Estado de ánimo",
  "nav.journal": "Diario", "nav.stress": "Estrés", "nav.sleep": "Sueño",
  "nav.mindfulness": "Mindfulness", "nav.community": "Comunidad",
  "nav.resources": "Recursos", "nav.progress": "Progreso", "nav.profile": "Perfil",
  "nav.copingToolkit": "Kit de afrontamiento",
  "action.save": "Guardar", "action.cancel": "Cancelar", "action.back": "Atrás",
  "action.continue": "Continuar", "action.signIn": "Iniciar sesión",
  "action.signUp": "Registrarse", "action.logOut": "Cerrar sesión",
  "action.getStarted": "Comenzar", "action.post": "Publicar",
  "action.send": "Enviar", "action.search": "Buscar",
  "home.greeting.morning": "Buenos días",
  "home.greeting.afternoon": "Buenas tardes",
  "home.greeting.evening": "Buenas noches",
  "home.checkin": "¿Cómo te sientes hoy?",
  "home.checkinSub": "Toca para registrar tu estado",
  "home.quickAccess": "Acceso rápido",
  "home.mindfulTracker": "Seguimiento consciente",
  "home.mindfulResources": "Recursos mindfulness",
  "home.seeAll": "Ver todo",
  "home.todayGlance": "Resumen del día",
  "mood.title": "Estado de ánimo", "mood.history": "Historial",
  "mood.aiSuggestions": "Sugerencias IA",
  "mood.setMood": "Establecer estado", "mood.howFeeling": "¿Cómo te sientes?",
  "mood.slideSelect": "Desliza para seleccionar tu estado actual",
  "mood.loggedMood": "Estado registrado",
  "journal.title": "Diario", "journal.newEntry": "Nueva entrada",
  "journal.noEntries": "Sin entradas todavía",
  "journal.saveEntry": "Guardar entrada",
  "journal.titleLabel": "Título (opcional)",
  "journal.entryLabel": "Entrada", "journal.savedTitle": "¡Entrada guardada!",
  "profile.general": "General", "profile.preferences": "Preferencias",
  "profile.security": "Seguridad", "profile.data": "Datos",
  "profile.personalInfo": "Información personal",
  "profile.language": "Idioma", "profile.inviteFriends": "Invitar amigos",
  "profile.helpCenter": "Centro de ayuda",
  "profile.securityPrivacy": "Seguridad y privacidad",
  "profile.clearData": "Borrar todos los datos",
  "profile.closeAccount": "Cerrar cuenta",
  "profile.member": "Miembro de Mindora",
  "profile.copyLink": "Copiar enlace de invitación",
  "profile.linkCopied": "¡Enlace copiado!",
  "auth.welcomeTitle": "Bienvenido a Mindora AI",
  "auth.welcomeSub": "Tu compañero de bienestar mental.",
  "auth.signInTitle": "Iniciar sesión en Mindora AI",
  "auth.signUpTitle": "Crea tu cuenta",
  "auth.email": "Correo electrónico", "auth.password": "Contraseña",
  "auth.forgotPassword": "¿Olvidaste tu contraseña?",
  "auth.noAccount": "¿No tienes cuenta?",
  "auth.haveAccount": "¿Ya tienes cuenta?",
  "lang.title": "Idioma", "lang.currentlySelected": "Seleccionado actualmente",
  "lang.saveLanguage": "Guardar idioma",
  "security.title": "Configuración de seguridad",
  "security.password": "Contraseña", "security.changePassword": "Cambiar",
  "help.title": "Centro de ayuda", "help.faq": "Preguntas frecuentes",
  "help.liveChat": "Chat en vivo",
  "help.supportText": "Herramientas de apoyo para el bienestar mental.",
  "misc.disclaimer": "Mindora no sustituye la atención profesional de salud mental.",
  "misc.loading": "Cargando…", "misc.score": "Puntuación Mindora",
  "misc.mentallyStable": "Mentalmente estable",
};

const fr: Translations = {
  "nav.home": "Accueil", "nav.aiChat": "Chat IA", "nav.mood": "Humeur",
  "nav.journal": "Journal", "nav.stress": "Stress", "nav.sleep": "Sommeil",
  "nav.mindfulness": "Pleine conscience", "nav.community": "Communauté",
  "nav.resources": "Ressources", "nav.progress": "Progrès", "nav.profile": "Profil",
  "nav.copingToolkit": "Boîte à outils",
  "action.save": "Sauvegarder", "action.cancel": "Annuler", "action.back": "Retour",
  "action.continue": "Continuer", "action.signIn": "Se connecter",
  "action.signUp": "S'inscrire", "action.logOut": "Se déconnecter",
  "action.getStarted": "Commencer", "action.post": "Publier",
  "action.send": "Envoyer", "action.search": "Rechercher",
  "home.greeting.morning": "Bonjour",
  "home.greeting.afternoon": "Bon après-midi",
  "home.greeting.evening": "Bonsoir",
  "home.checkin": "Comment vous sentez-vous aujourd'hui ?",
  "home.checkinSub": "Touchez pour noter votre humeur",
  "home.quickAccess": "Accès rapide",
  "home.mindfulTracker": "Suivi pleine conscience",
  "home.mindfulResources": "Ressources mindfulness",
  "home.seeAll": "Tout voir",
  "home.todayGlance": "Résumé du jour",
  "mood.title": "Humeur", "mood.history": "Historique",
  "mood.aiSuggestions": "Suggestions IA",
  "mood.setMood": "Définir l'humeur", "mood.howFeeling": "Comment vous sentez-vous ?",
  "mood.slideSelect": "Glissez pour sélectionner votre humeur",
  "mood.loggedMood": "Humeur enregistrée",
  "journal.title": "Journal", "journal.newEntry": "Nouvelle entrée",
  "journal.noEntries": "Aucune entrée pour l'instant",
  "journal.saveEntry": "Sauvegarder l'entrée",
  "journal.titleLabel": "Titre (optionnel)",
  "journal.entryLabel": "Entrée", "journal.savedTitle": "Entrée sauvegardée !",
  "profile.general": "Général", "profile.preferences": "Préférences",
  "profile.security": "Sécurité", "profile.data": "Données",
  "profile.personalInfo": "Informations personnelles",
  "profile.language": "Langue", "profile.inviteFriends": "Inviter des amis",
  "profile.helpCenter": "Centre d'aide",
  "profile.securityPrivacy": "Sécurité et confidentialité",
  "profile.clearData": "Effacer toutes les données",
  "profile.closeAccount": "Fermer le compte",
  "profile.member": "Membre Mindora",
  "profile.copyLink": "Copier le lien d'invitation",
  "profile.linkCopied": "Lien copié !",
  "auth.welcomeTitle": "Bienvenue sur Mindora AI",
  "auth.welcomeSub": "Votre compagnon de bien-être mental.",
  "auth.signInTitle": "Connexion à Mindora AI",
  "auth.signUpTitle": "Créez votre compte",
  "auth.email": "Adresse e-mail", "auth.password": "Mot de passe",
  "auth.forgotPassword": "Mot de passe oublié",
  "auth.noAccount": "Pas encore de compte ?",
  "auth.haveAccount": "Vous avez déjà un compte ?",
  "lang.title": "Langue", "lang.currentlySelected": "Actuellement sélectionné",
  "lang.saveLanguage": "Enregistrer la langue",
  "security.title": "Paramètres de sécurité",
  "security.password": "Mot de passe", "security.changePassword": "Modifier",
  "help.title": "Centre d'aide", "help.faq": "FAQ",
  "help.liveChat": "Chat en direct",
  "help.supportText": "Des outils de soutien pour le bien-être mental quotidien.",
  "misc.disclaimer": "Mindora ne remplace pas les soins professionnels de santé mentale.",
  "misc.loading": "Chargement…", "misc.score": "Score Mindora",
  "misc.mentallyStable": "Mentalement stable",
};

const zh: Translations = {
  "nav.home": "主页", "nav.aiChat": "AI 聊天", "nav.mood": "情绪",
  "nav.journal": "日记", "nav.stress": "压力", "nav.sleep": "睡眠",
  "nav.mindfulness": "正念", "nav.community": "社区",
  "nav.resources": "资源", "nav.progress": "进度", "nav.profile": "个人",
  "nav.copingToolkit": "应对工具",
  "action.save": "保存", "action.cancel": "取消", "action.back": "返回",
  "action.continue": "继续", "action.signIn": "登录",
  "action.signUp": "注册", "action.logOut": "退出登录",
  "action.getStarted": "开始使用", "action.post": "发布",
  "action.send": "发送", "action.search": "搜索",
  "home.greeting.morning": "早上好",
  "home.greeting.afternoon": "下午好",
  "home.greeting.evening": "晚上好",
  "home.checkin": "今天感觉怎么样？",
  "home.checkinSub": "点击记录您的情绪",
  "home.quickAccess": "快速访问",
  "home.mindfulTracker": "正念追踪",
  "home.mindfulResources": "正念资源",
  "home.seeAll": "查看全部",
  "home.todayGlance": "今日概览",
  "mood.title": "情绪", "mood.history": "历史",
  "mood.aiSuggestions": "AI 建议",
  "mood.setMood": "设置情绪", "mood.howFeeling": "您感觉怎么样？",
  "mood.slideSelect": "滑动以选择当前情绪",
  "mood.loggedMood": "情绪已记录",
  "journal.title": "日记", "journal.newEntry": "新建日记",
  "journal.noEntries": "暂无日记",
  "journal.saveEntry": "保存日记",
  "journal.titleLabel": "标题（可选）",
  "journal.entryLabel": "内容", "journal.savedTitle": "日记已保存！",
  "profile.general": "通用", "profile.preferences": "偏好设置",
  "profile.security": "安全", "profile.data": "数据",
  "profile.personalInfo": "个人信息",
  "profile.language": "语言", "profile.inviteFriends": "邀请朋友",
  "profile.helpCenter": "帮助中心",
  "profile.securityPrivacy": "安全与隐私",
  "profile.clearData": "清除所有数据",
  "profile.closeAccount": "注销账户",
  "profile.member": "Mindora 会员",
  "profile.copyLink": "复制邀请链接",
  "profile.linkCopied": "链接已复制！",
  "auth.welcomeTitle": "欢迎使用 Mindora AI",
  "auth.welcomeSub": "您的智能心理健康伴侣。",
  "auth.signInTitle": "登录 Mindora AI",
  "auth.signUpTitle": "创建您的账户",
  "auth.email": "电子邮件地址", "auth.password": "密码",
  "auth.forgotPassword": "忘记密码",
  "auth.noAccount": "没有账户？",
  "auth.haveAccount": "已有账户？",
  "lang.title": "语言", "lang.currentlySelected": "当前已选",
  "lang.saveLanguage": "保存语言",
  "security.title": "安全设置",
  "security.password": "密码", "security.changePassword": "更改",
  "help.title": "帮助中心", "help.faq": "常见问题",
  "help.liveChat": "在线聊天",
  "help.supportText": "支持日常心理健康的工具。",
  "misc.disclaimer": "Mindora 不能替代专业心理健康护理。",
  "misc.loading": "加载中…", "misc.score": "Mindora 分数",
  "misc.mentallyStable": "心理稳定",
};

const TABLE: Record<LangCode, Translations> = { en, ar, es, fr, zh };

/** Get a translated string. Falls back to English if key is missing. */
export function translate(lang: LangCode, key: TranslationKey): string {
  return TABLE[lang]?.[key] ?? TABLE.en[key] ?? key;
}
