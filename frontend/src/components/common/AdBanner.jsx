import { ExternalLink, Cloud, ShoppingBag, Dumbbell, Zap, Headphones } from 'lucide-react';

const ads = [
    {
        id: 'cloudsync',
        title: 'CloudSync Pro',
        tagline: 'Your Files, Everywhere.',
        cta: 'Try Free for 30 Days',
        icon: Cloud,
        gradient: 'from-blue-600 via-indigo-600 to-purple-700',
        accent: 'bg-cyan-400 text-gray-900',
        pattern: 'radial-gradient(circle at 90% 20%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 10% 80%, rgba(255,255,255,0.05) 0%, transparent 40%)',
    },
    {
        id: 'shopease',
        title: 'ShopEase',
        tagline: 'Shop Smarter, Save More.',
        cta: 'Up to 50% Off — Shop Now',
        icon: ShoppingBag,
        gradient: 'from-orange-500 via-red-500 to-pink-600',
        accent: 'bg-white text-orange-600',
        pattern: 'radial-gradient(circle at 80% 30%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 20% 70%, rgba(255,255,255,0.06) 0%, transparent 40%)',
    },
    {
        id: 'fittrack',
        title: 'FitTrack',
        tagline: 'Your Personal Fitness Coach.',
        cta: 'Download Free',
        icon: Dumbbell,
        gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
        accent: 'bg-white text-emerald-600',
        pattern: 'radial-gradient(circle at 85% 25%, rgba(255,255,255,0.1) 0%, transparent 45%), radial-gradient(circle at 15% 75%, rgba(255,255,255,0.06) 0%, transparent 35%)',
    },
    {
        id: 'soundwave',
        title: 'SoundWave+',
        tagline: 'Premium Music Streaming.',
        cta: '3 Months Free Trial',
        icon: Headphones,
        gradient: 'from-violet-600 via-purple-600 to-fuchsia-600',
        accent: 'bg-yellow-400 text-gray-900',
        pattern: 'radial-gradient(circle at 75% 35%, rgba(255,255,255,0.12) 0%, transparent 50%), radial-gradient(circle at 25% 65%, rgba(255,255,255,0.05) 0%, transparent 35%)',
    },
    {
        id: 'zaphost',
        title: 'ZapHost',
        tagline: 'Blazing Fast Web Hosting.',
        cta: 'Plans from ₱99/mo',
        icon: Zap,
        gradient: 'from-amber-500 via-orange-500 to-red-500',
        accent: 'bg-gray-900 text-amber-400',
        pattern: 'radial-gradient(circle at 90% 15%, rgba(255,255,255,0.1) 0%, transparent 45%), radial-gradient(circle at 10% 85%, rgba(255,255,255,0.07) 0%, transparent 40%)',
    },
];

/**
 * AdBanner component — renders a stylish CSS-only ad.
 *
 * @param {string} variant - 'leaderboard' (wide horizontal) | 'banner' (standard) | 'sidebar' (square/vertical)
 * @param {number} adIndex - which ad to show (0–4), wraps around
 * @param {string} className - extra classes
 */
const AdBanner = ({ variant = 'banner', adIndex = 0, className = '' }) => {
    const ad = ads[adIndex % ads.length];
    const Icon = ad.icon;

    if (variant === 'leaderboard') {
        return (
            <div className={`w-full ${className}`}>
                <div
                    className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${ad.gradient} p-4 md:p-5 shadow-lg`}
                    style={{ backgroundImage: ad.pattern }}
                >
                    {/* Decorative circles */}
                    <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full" />
                    <div className="absolute -left-4 -bottom-4 w-20 h-20 bg-white/5 rounded-full" />

                    <div className="relative flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                    <h4 className="text-white font-bold text-lg">{ad.title}</h4>
                                    <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded font-medium uppercase tracking-wider">Ad</span>
                                </div>
                                <p className="text-white/80 text-sm">{ad.tagline}</p>
                            </div>
                        </div>
                        <button className={`${ad.accent} px-5 py-2.5 rounded-xl font-semibold text-sm hover:scale-105 transition-transform duration-200 flex items-center gap-2 flex-shrink-0 shadow-lg`}>
                            {ad.cta}
                            <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (variant === 'sidebar') {
        return (
            <div className={`w-full ${className}`}>
                <div
                    className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${ad.gradient} p-6 shadow-lg`}
                    style={{ backgroundImage: ad.pattern }}
                >
                    {/* Decorative circles */}
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/5 rounded-full" />
                    <div className="absolute -left-3 -bottom-3 w-16 h-16 bg-white/5 rounded-full" />

                    <div className="relative text-center space-y-4">
                        <div className="w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto">
                            <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <h4 className="text-white font-bold text-lg">{ad.title}</h4>
                                <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded font-medium uppercase tracking-wider">Ad</span>
                            </div>
                            <p className="text-white/75 text-sm">{ad.tagline}</p>
                        </div>
                        <button className={`${ad.accent} w-full py-3 rounded-xl font-semibold text-sm hover:scale-[1.02] transition-transform duration-200 flex items-center justify-center gap-2 shadow-lg`}>
                            {ad.cta}
                            <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        <p className="text-white/40 text-[10px]">Sponsored</p>
                    </div>
                </div>
            </div>
        );
    }

    // Default: banner (medium, inline)
    return (
        <div className={`w-full ${className}`}>
            <div
                className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${ad.gradient} px-5 py-3.5 shadow-md`}
                style={{ backgroundImage: ad.pattern }}
            >
                <div className="absolute -right-6 -top-6 w-20 h-20 bg-white/5 rounded-full" />

                <div className="relative flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white/15 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon className="w-4.5 h-4.5 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-white font-bold text-sm">{ad.title}</span>
                                <span className="text-[9px] bg-white/20 text-white px-1 py-0.5 rounded font-medium">AD</span>
                            </div>
                            <p className="text-white/70 text-xs">{ad.tagline}</p>
                        </div>
                    </div>
                    <button className={`${ad.accent} px-4 py-2 rounded-lg font-semibold text-xs hover:scale-105 transition-transform duration-200 flex items-center gap-1.5 flex-shrink-0 shadow-md`}>
                        {ad.cta}
                        <ExternalLink className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdBanner;
