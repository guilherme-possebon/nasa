'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
            <h1 className="text-4xl font-bold mb-2">🌎 Chicxulub Simulator</h1>
            <p className="text-gray-300 mb-8">Escolha o modo de simulação</p>

            <div className="flex gap-6">
                {/* Botão: Dados Manuais */}
                <button
                    onClick={() => router.push('/manual')}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700
                     font-semibold shadow-lg transition-transform active:scale-95"
                >
                    Dados Manuais
                </button>

                {/* Botão: Dados da API */}
                <button
                    onClick={() => router.push('/from-api')}
                    className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700
                     font-semibold shadow-lg transition-transform active:scale-95"
                >
                    Dados da API
                </button>
            </div>
        </main>
    );
}
