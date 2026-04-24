"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service like Sentry
    console.error("AuditUs App Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-svh w-full bg-[var(--bg)] px-6 text-center">
      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-black/5 flex flex-col items-center max-w-[360px]">
        <div className="w-16 h-16 bg-orange-100 text-[#f36b2d] rounded-full flex items-center justify-center mb-6">
          <AlertCircle size={32} strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">¡Ups! Algo falló</h2>
        <p className="text-sm font-medium text-gray-500 mb-8 leading-relaxed">
          Ha ocurrido un error inesperado. Nuestro equipo ya ha sido notificado.
        </p>
        
        <div className="flex flex-col w-full gap-3">
          <button
            onClick={() => reset()}
            className="bg-[#f36b2d] text-white w-full rounded-full py-4 font-black text-sm shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
          >
            Intentar de nuevo
          </button>
          <Link href="/" className="w-full">
            <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 w-full rounded-full py-4 font-black text-sm transition-all">
              Volver al inicio
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
