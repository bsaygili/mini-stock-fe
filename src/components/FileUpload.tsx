import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";

export default function FileUpload({ onFile }: { onFile: (file: File) => void }) {
    const [dragActive, setDragActive] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length) onFile(acceptedFiles[0]);
    }, [onFile]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        onDragEnter: () => setDragActive(true),
        onDragLeave: () => setDragActive(false),
        multiple: false,
        // accept: {
        //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [], // .xlsx
        //     "application/vnd.ms-excel": [], // .xls
        // },
        accept: {
            "application/*": [".xls", ".xlsx"],
        },
    });

    return (
        <div {...getRootProps()} className={`border-4 border-dashed rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer backdrop-blur-sm
      ${dragActive
                ? "border-cyan-400 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 shadow-lg shadow-cyan-500/25 scale-105"
                : "border-white/30 bg-white/5 hover:bg-white/10 hover:border-white/50 hover:shadow-lg hover:shadow-cyan-500/10"}`}>
            <input {...getInputProps()} />
            <FiUploadCloud size={48} className={`mb-4 transition-colors duration-300 ${dragActive ? "text-cyan-400" : "text-gray-300"}`} />
            <p className={`text-center font-medium transition-colors duration-300 ${dragActive ? "text-cyan-300" : "text-gray-300"}`}>
                📄 Excel dosyasını buraya sürükleyin
            </p>
            <p className={`text-center text-sm mt-2 transition-colors duration-300 ${dragActive ? "text-cyan-200" : "text-gray-400"}`}>
                veya tıklayarak dosya seçin (.xlsx veya .xls formatında)
            </p>
        </div>
    );
}