import { HiChartBar, HiCog, HiTable } from "react-icons/hi";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
    const linkClass = ({ isActive }: { isActive: boolean }) =>
        "flex items-center gap-3 block p-4 mb-2 rounded-xl transition-all duration-300 " +
        (isActive
            ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/25"
            : "text-gray-300 hover:bg-white/10 hover:text-white hover:shadow-lg hover:shadow-cyan-500/10 backdrop-blur-sm");

    return (
        <div className="w-16 sm:w-20 md:w-64 backdrop-blur-xl bg-white/5 border-r border-white/10 p-2 sm:p-4 md:p-6 flex flex-col shadow-2xl">
            <div className="mb-4 md:mb-8">
                <h1 className="text-sm sm:text-lg md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    <span className="hidden md:inline">🚀 Mini Stok</span>
                    <span className="md:hidden">🚀</span>
                </h1>
                <p className="hidden md:block text-gray-400 text-sm mt-1">BaTa Stok Analizi ve Yönetimi</p>
            </div>

            <nav className="flex-1">
                <NavLink to="/dashboard" className={linkClass}>
                    <HiChartBar className="text-lg md:text-xl" />
                    <span className="hidden md:inline ml-3">Dashboard</span>
                </NavLink>
                <NavLink to="/settings" className={linkClass}>
                    <HiCog className="text-lg md:text-xl" />
                    <span className="hidden md:inline ml-3">Ayarlar</span>
                </NavLink>
                <NavLink to="/upload-log" className={linkClass}>
                    <HiTable className="text-lg md:text-xl" />
                    <span className="hidden md:inline ml-3">Yükleme Geçmişi</span>
                </NavLink>
            </nav>

            <footer className="mt-auto pt-6 border-t border-white/10">
                <p className="text-gray-400 text-xs text-center">
                    ⚡ Powered by Saygılı
                </p>
            </footer>
        </div>
    );
}