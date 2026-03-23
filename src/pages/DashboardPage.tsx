import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BiLoaderCircle } from "react-icons/bi";
import CurrentSettingsOverview from "../components/CurrentSettingsOverview";
import FileUpload from "../components/FileUpload";
import { useGetProgressQuery, useGetSettingsQuery, useUploadExcelMutation } from "../services/api";

interface Product {
    StokKodu?: string;
    productCode?: string;
    StokAdi?: string;
    productName?: string;
    stockQty: number;
    criticalStockQty: number;
    dailyAvg: number;
    minOrderQty: number;
}

const PROGRESS: { [key: string]: string } = {
    done: "Tamamlandı",
    parsing: "Ayrıştırılıyor",
    calculating: "Hesaplanıyor",
    sending_mail: "Mail Gönderiliyor",
    not_found: "Bulunamadı",
    error: "Hata Oluştu"
}

export default function DashboardPage() {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState("");
    const [jobId, setJobId] = useState<string | null>(null);



    const [uploadExcel, { isLoading }] = useUploadExcelMutation();
    const { data: settingsData } = useGetSettingsQuery(null)
    const [stopPolling, setStopPolling] = useState<boolean>(false);

    const { data: progressData, isError, error: progressError } = useGetProgressQuery(jobId!, {
        skip: !jobId || stopPolling,
        pollingInterval: stopPolling ? 0 : 1000,
    });

    useEffect(() => {
        if (
            progressData?.status === "done" ||
            progressData?.status === "error" ||
            progressData?.status === "not_found"
        ) {
            setStopPolling(true);
            setFile(null)
            setJobId(null)
        }
    }, [progressData]);

    useEffect(() => {
        if (isError) {
            console.log('progressError', progressError)
            toast.error("test")
        }
    }, [isError]);



    const handleUpload = async () => {
        if (!file) return setError("Lütfen bir dosya seçin");

        const res = await uploadExcel(file).unwrap();
        setJobId(res.jobId);
    };

    const columns: ColumnDef<Product>[] = [
        {
            accessorKey: "StokKodu",
            header: "Stok Kodu",
            cell: ({ row }) => row.original.StokKodu || row.original.productCode,
        },
        {
            accessorKey: "StokAdi",
            header: "Stok Adı",
            cell: ({ row }) => row.original.StokAdi || row.original.productName,
        },
        {
            accessorKey: "stock",
            header: "Mevcut Stok",
        },
        {
            accessorKey: "criticalStockQty",
            header: "Kritik Stok",
        },
        {
            accessorKey: "dailyAvg",
            header: "Günlük Ortalama Satış",
            cell: ({ getValue }) => Number(getValue()).toFixed(2),
        },
        {
            accessorKey: "minOrderQty",
            header: "Eksik Adet",
            cell: ({ getValue }) => `${getValue()} adet`,
        },
    ];

    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable({
        data: progressData?.result?.criticalProducts || [],
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
            <div className="text-center mb-12">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-blue-100">
                    📊 Stok Analizi
                </h1>
                <p className="text-gray-300 text-base sm:text-lg">Dosya yükleyip kritik stokları hesaplayın</p>
            </div>
            {/* Current Settings Overview */}
            <CurrentSettingsOverview settings={settingsData} />

            {/* Upload Section */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl mb-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="text-3xl">📤</span>
                    Dosya Yükleme
                </h2>

                <div className="space-y-6">
                    <FileUpload onFile={setFile} />

                    {file && (
                        <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                            <p className="text-white font-semibold flex items-center gap-2">
                                📄 {file.name}
                            </p>
                        </div>
                    )}

                    <button
                        onClick={handleUpload}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 disabled:transform-none disabled:hover:scale-100"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <BiLoaderCircle className="animate-spin" />
                                Yükleniyor...
                            </span>
                        ) : (
                            "🚀 Yükle ve Hesapla"
                        )}
                    </button>

                    {error && !file && (
                        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                            <p className="text-red-300 font-medium">❌ {error}</p>
                        </div>
                    )}
                </div>
            </div>

            {progressData && (
                <div className="my-6 w-full max-w-md mx-auto">

                    {/* STATUS */}
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-sm text-gray-500">
                            {PROGRESS[progressData.status]}
                        </p>
                        <p className="text-sm font-semibold text-gray-700">
                            %{progressData.progress}
                        </p>
                    </div>

                    {/* BAR CONTAINER */}
                    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">

                        {/* PROGRESS */}
                        <div
                            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out relative"
                            style={{ width: `${progressData.progress}%` }}
                        >
                            {/* SHIMMER EFFECT */}
                            <div className="absolute inset-0 bg-white/20 animate-pulse" />

                        </div>
                    </div>

                </div>
            )}

            {!isLoading && progressData?.result?.criticalProducts?.length === 0 && (
                <div>
                    <p className="text-lg mt-5">{progressData?.result?.message}. Kritik stok seviyesine düşen ürün yoktur.</p>
                </div>)}
            {progressData?.result && progressData?.result?.criticalProducts?.length > 0 && (
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="text-3xl">⚠️</span>
                        Kritik Ürünler ({progressData?.result?.criticalProducts?.length ?? 0})
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
                            title="satir-goster"
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
                </div>
            )}
        </div>
    );
}