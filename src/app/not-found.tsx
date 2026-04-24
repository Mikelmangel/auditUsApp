import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-svh w-full bg-[var(--bg)] px-6 text-center">
      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-black/5 flex flex-col items-center max-w-[360px]">
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6 text-3xl font-black">
          404
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Página no encontrada</h2>
        <p className="text-sm font-medium text-gray-500 mb-8 leading-relaxed">
          Parece que te has perdido. Esta encuesta, grupo o página ya no existe o la URL es incorrecta.
        </p>
        <Link href="/" className="w-full">
          <button className="bg-[var(--primary)] text-white w-full rounded-full py-4 font-black text-sm shadow-lg shadow-teal-500/20 active:scale-95 transition-all">
            Volver al inicio
          </button>
        </Link>
      </div>
    </div>
  );
}
