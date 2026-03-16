
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiDocument } from "react-icons/hi";
import { unixToDate } from "../utils";

interface LogEntry {
    id: string;
    fileName: string;
    totalProducts: number;
    criticalCount: number;
    uploadedAt: {
        _seconds: number;
        _nanoseconds: number;

    }
}


const UploadLog = () => {

    const [logs, setLogs] = useState<LogEntry[]>([]);

    const getUploadsHistory = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/upload`, {
                method: "GET",
            });

            if (!res.ok) {
                throw new Error(`Sunucu hatası: ${res.status} ${res.statusText}`);
            }

            const response = await res.json();
            setLogs(response)

        } catch (error: any) {
            toast.error("Ayarlar yüklenirken bir hata oluştu.");
        }
    };

    useEffect(() => {
        getUploadsHistory()
    }, [])





    const columns: ColumnDef<LogEntry>[] = [
        {
            accessorKey: "uploadedAt",
            header: "Tarih/Saat",
            cell: ({ row }) => {
                const formatted = unixToDate(row.original.uploadedAt._seconds).toLocaleString('tr-TR');
                return <div>{formatted}</div>
            },
        },
        {
            accessorKey: "fileName",
            header: "Dosya Adı",
            cell: ({ row }) => row.original.fileName,
        },
        {
            accessorKey: "totalProducts",
            header: "Kayıt Sayısı (ad.)",
            cell: ({ row }) => row.original.totalProducts,
        },
        {
            accessorKey: "criticalCount",
            header: "Kritik Ürün (ad.)",
            cell: ({ row }) => {
                return row?.original?.criticalCount > 0 ? (
                    <span className="text-red-400 font-semibold">{row.original.criticalCount}</span>
                ) : (
                    <span className="text-gray-400">-</span>
                )
            }
        },
    ];

    const table = useReactTable({
        data: logs || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });




    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 sm:mb-12">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-blue-100">
                    📋 Yükleme Geçmişi
                </h1>
                <p className="text-gray-300 text-base sm:text-lg">Dosya yükleme işlemlerinin detaylı kayıtları</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl">
                    <div className="flex items-center gap-3 mb-2">
                        <HiDocument className="text-cyan-400 text-2xl" />
                        <h3 className="text-white font-bold text-lg">Toplam Yükleme</h3>
                    </div>
                    <p className="text-3xl font-bold text-cyan-400">{logs.length}</p>
                </div>
            </div>

            {/* Logs Table */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <HiDocument className="text-cyan-400" />
                    Detaylı Kayıtlar
                </h2>


                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white/5 border border-white/10 rounded-lg shadow-md">
                        <thead className="bg-white/10">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-white/10"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className={row.index % 2 === 0 ? "bg-white/5 hover:bg-white/10" : "bg-white/10 hover:bg-white/15"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-200"
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition-all duration-300 border border-white/20"
                        >
                            ← Önceki
                        </button>
                        <span className="text-white text-sm px-3 py-2 bg-white/10 rounded-lg border border-white/20">
                            Sayfa {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                        </span>
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition-all duration-300 border border-white/20"
                        >
                            Sonraki →
                        </button>
                    </div>
                    <select
                        title="sayfa"
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => table.setPageSize(Number(e.target.value))}
                        className="px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    >
                        {[10, 20, 30, 40, 50].map((size) => (
                            <option key={size} value={size} className="bg-gray-800 text-white">
                                {size} satır göster
                            </option>
                        ))}
                    </select>
                </div>

                {/* <div className="overflow-x-auto">
                    <table className="min-w-full bg-white/5 border border-white/10 rounded-lg shadow-md">
                        <thead className="bg-white/10">
                            <tr>
                                <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-white/10">
                                    Tarih/Saat
                                </th>
                                <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-white/10">
                                    Dosya Adı
                                </th>
                                <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-white/10">
                                    Kayıt Sayısı
                                </th>
                                <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-white/10">
                                    Kritik Ürün
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-white/10 transition-colors duration-200">
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                                        {log?.uploadedAt?._seconds}
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                                        <div className="flex items-center gap-2">
                                            <HiDocument className="text-cyan-400" />
                                            {log.fileName}
                                        </div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                                        {log.totalProducts}
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                                        {log.criticalCount > 0 ? (
                                            <span className="text-red-400 font-semibold">{log.criticalCount}</span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div> */}

                {logs.length === 0 && (
                    <div className="text-center py-12">
                        <HiDocument className="text-gray-400 text-6xl mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">Henüz yükleme geçmişi bulunmuyor</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadLog;
