import type React from "react"
import { HiAdjustments, HiCalculator, HiCalendar, HiClock, HiCog, HiMail } from "react-icons/hi"


type Settings = {
    emails: string | string[]
    mailEnabled: boolean
    criticalLimitPercent: number
    salesPeriodDays: number
    stockDays: number
}

type Props = {
    settings: Settings
}

const CurrentSettingsOverview: React.FC<Props> = ({ settings }) => {


    const emailBreaker = (emails: string | string[]) => {
        return typeof emails === "string" ? emails.split(",").map((e) => e.trim()).filter(Boolean).join(", ") : emails?.map((e) => e.trim()).filter(Boolean).join(", ")

    }

    return (
        <div className="mb-8 sm:mb-12 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl" >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <HiAdjustments className="text-cyan-400" />
                Geçerli Ayarlar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                    { label: "Mail Listesi", value: settings?.emails ? emailBreaker(settings?.emails) : "(boş)", icon: HiMail },
                    { label: "Mail Gönderimi", value: settings?.mailEnabled ? "Aktif" : "Pasif", icon: HiCog },
                    { label: "Güvenlik Payı", value: `%${settings?.criticalLimitPercent}`, icon: HiAdjustments },
                    { label: "Satış Periyodu", value: `${settings?.salesPeriodDays} gün`, icon: HiCalendar },
                    { label: "Stok Hesap Periyodu", value: `${settings?.stockDays} gün`, icon: HiClock },
                    { label: "Hesaplama Algoritması", value: `(N.M / SP) * SHP *( 1 + (GP / 100))`, icon: HiCalculator },
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
        </div >

    )
}

export default CurrentSettingsOverview
