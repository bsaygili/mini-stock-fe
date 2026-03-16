
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { HiAdjustments, HiCalendar, HiClock, HiCog, HiMail } from "react-icons/hi";

export default function SettingsPage() {

    const [settings, setSettings] = useState<{
        emails: string,
        criticalLimitPercent: number,
        mailEnabled: boolean,
        salesPeriodDays: number,
        stockDays: number,
    }>({
        emails: "",
        criticalLimitPercent: 25,
        mailEnabled: true,
        salesPeriodDays: 60,
        stockDays: 7,
    })

    const getSettings = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/settings`, {
                method: "GET",
            });

            if (!res.ok) {
                throw new Error(`Sunucu hatası: ${res.status} ${res.statusText}`);
            }

            const response = await res.json();
            setSettings({ ...response, emails: Array.isArray(response.emails) ? response.emails.join(", ") : "" })

        } catch (error: any) {
            toast.error("Ayarlar yüklenirken bir hata oluştu.");
        }
    };

    const handleSave = async () => {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/settings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...settings, emails: settings.emails.split(","), }),
        })
        if (res.ok) {
            toast.success("Ayarlar kaydedildi!");
            getSettings()
        } else {
            toast.error(`Hata: ${res}`);
        }

    };

    useEffect(() => {
        getSettings()

    }, [])



    return (
        <div className="max-w-7xl mx-auto">
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: 'rgba(0, 0, 0, 0.8)',
                        color: '#fff',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                    },
                }}
            />
            {/* Header */}
            <div className="text-center mb-8 sm:mb-12">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-blue-100">
                    ⚙️ Sistem Ayarları
                </h1>
            </div>

            {/* Current Settings Overview */}
            <div className="mb-8 sm:mb-12 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <HiAdjustments className="text-cyan-400" />
                    Geçerli Ayarlar
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        { label: "Mail Listesi", value: settings.emails ? settings.emails.split(",").map((e) => e.trim()).filter(Boolean).join(", ") : "(boş)", icon: HiMail },
                        { label: "Mail Gönderimi", value: settings.mailEnabled ? "Aktif" : "Pasif", icon: HiCog },
                        { label: "Kritik Stok Limit", value: `%${settings.criticalLimitPercent}`, icon: HiAdjustments },
                        { label: "Satış Periyodu", value: `${settings.salesPeriodDays} gün`, icon: HiCalendar },
                        { label: "Stok Hesap Periyodu", value: `${settings.stockDays} gün`, icon: HiClock },
                    ].map((item, index) => (
                        <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                            <div className="flex items-center gap-3 mb-2">
                                <item.icon className="text-cyan-400 text-xl" />
                                <span className="text-gray-300 font-medium">{item.label}</span>
                            </div>
                            <p className="text-white font-semibold text-lg">{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Settings Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                {/* Email Settings */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-3 mb-4">
                        <HiMail className="text-cyan-400 text-2xl" />
                        <h3 className="text-white font-bold text-lg">Mail Listesi</h3>
                    </div>
                    <label htmlFor="emails" className="block text-gray-300 text-sm mb-2">Virgülle ayırarak girin</label>
                    <textarea
                        id="emails"
                        placeholder="ornek@email.com, diger@email.com"
                        value={settings.emails}
                        onChange={(e) => setSettings(prev => ({
                            ...prev,
                            emails: e.target.value
                        }))}
                        rows={8}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
                    />
                </div>

                {/* Mail Toggle */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-3 mb-4">
                        <HiCog className="text-cyan-400 text-2xl" />
                        <h3 className="text-white font-bold text-lg">Mail Gönderimi</h3>
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                id="mailEnabled"
                                type="checkbox"
                                checked={settings.mailEnabled}
                                onChange={(e) => {
                                    setSettings(prev => ({
                                        ...prev,
                                        mailEnabled: e.target.checked
                                    }))
                                }}
                                className="sr-only peer"
                            />
                            <div className="w-14 h-7 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-400 peer-checked:to-purple-500"></div>
                        </label>
                        <span className={`text-lg font-semibold transition-colors duration-300 ${settings.mailEnabled ? 'text-green-400' : 'text-red-400'}`}>
                            {settings.mailEnabled ? "Aktif" : "Pasif"}
                        </span>
                    </div>
                </div>

                {/* Critical Stock Limit */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-3 mb-4">
                        <HiAdjustments className="text-cyan-400 text-2xl" />
                        <h3 className="text-white font-bold text-lg">Kritik Stok</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="text-center">
                            <span className="text-3xl font-bold text-cyan-400">{settings.criticalLimitPercent}%</span>
                        </div>
                        <input
                            type="range"
                            min={1}
                            max={100}
                            value={settings.criticalLimitPercent}
                            onChange={(e) => setSettings(prev => ({
                                ...prev,
                                criticalLimitPercent: Number(e.target.value)
                            }))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${settings.criticalLimitPercent}%, #374151 ${settings.criticalLimitPercent}%, #374151 100%)`
                            }}
                        />
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>1%</span>
                            <span>100%</span>
                        </div>
                    </div>
                </div>

                {/* Period Settings */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-3 mb-4">
                        <HiCalendar className="text-cyan-400 text-2xl" />
                        <h3 className="text-white font-bold text-lg">Periyodlar</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="salesPeriodDays" className="block text-gray-300 text-sm mb-1">Satış Periyodu</label>
                            <div className="relative">
                                <input
                                    id="salesPeriodDays"
                                    type="number"
                                    value={settings.salesPeriodDays}
                                    onChange={(e) => setSettings(prev => ({
                                        ...prev,
                                        salesPeriodDays: Number(e.target.value)
                                    }))}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 pr-12"
                                />
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">gün</span>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="stockDays" className="block text-gray-300 text-sm mb-1">Stok Hesap</label>
                            <div className="relative">
                                <input
                                    id="stockDays"
                                    type="number"
                                    value={settings.stockDays}
                                    onChange={(e) => setSettings(prev => ({
                                        ...prev,
                                        stockDays: Number(e.target.value)
                                    }))}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 pr-12"
                                />
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">gün</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="text-center">
                <button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                >
                    💾 Ayarları Kaydet
                </button>
            </div>
        </div>
    );
}