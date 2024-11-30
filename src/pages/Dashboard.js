"use client"

import { useState } from 'react';

// Datos de ejemplo para el gráfico
const data = [
    { name: 'Ene', total: 1500 },
    { name: 'Feb', total: 2300 },
    { name: 'Mar', total: 1800 },
    { name: 'Abr', total: 2600 },
    { name: 'May', total: 2200 },
    { name: 'Jun', total: 2800 },
];

export default function Dashboard() {
    const [balance, setBalance] = useState(15000);

    return (
        <div className="container mx-auto p-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white p-4 rounded shadow">
                    <div className="flex flex-row items-center justify-between pb-2">
                        <span className="text-sm font-medium">Saldo Actual</span>
                        
                    </div>
                    <div>
                        <div className="text-2xl font-bold">${balance.toLocaleString()}</div>
                        <p className="text-xs text-gray-500">+20.1% del mes anterior</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <div className="flex flex-row items-center justify-between pb-2">
                        <span className="text-sm font-medium">Facturas Pendientes</span>
                        
                    </div>
                    <div>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-gray-500">-2 desde el último mes</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <div className="flex flex-row items-center justify-between pb-2">
                        <span className="text-sm font-medium">Pagos Programados</span>
                       
                    </div>
                    <div>
                        <div className="text-2xl font-bold">2</div>
                        <p className="text-xs text-gray-500">Próximo: 15/07/2023</p>
                    </div>
                </div>
            </div>

            <div className="mt-4 bg-zinc-400 p-4 rounded shadow">
                <h2 className="text-lg font-semibold">Alertas</h2>
                <table className="min-w-full mt-2">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">Fecha</th>
                            <th className="px-4 py-2 text-left">Descripción</th>
                            <th className="px-4 py-2 text-left">Monto</th>
                            <th className="px-4 py-2 text-left">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border px-4 py-2">2023-06-28</td>
                            <td className="border px-4 py-2">Pago de factura #1234</td>
                            <td className="border px-4 py-2">$1,999.00</td>
                            <td className="border px-4 py-2"><span className="bg-green-200 text-green-800 px-2 py-1 rounded">Completado</span></td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2">2023-06-25</td>
                            <td className="border px-4 py-2">Compra de materiales</td>
                            <td className="border px-4 py-2">$3,500.00</td>
                            <td className="border px-4 py-2"><span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded">Pendiente</span></td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2">2023-06-20</td>
                            <td className="border px-4 py-2">Devolución de mercancía</td>
                            <td className="border px-4 py-2">-$500.00</td>
                            <td className="border px-4 py-2"><span className="bg-gray-200 text-gray-800 px-2 py-1 rounded">Procesando</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="bg-white col-span-4 p-4 rounded shadow">
                    <h2 className="text-lg font-semibold">Resumen de Cuenta</h2>
                </div>
                <div className="bg-white col-span-3 p-4 rounded shadow">
                    <h2 className="text-lg font-semibold">Alertas</h2>
                    <div className="space-y-4">
                        <div className="flex items-center">
                           
                            <p className="text-sm">Factura #1234 vence en 3 días</p>
                        </div>
                        <div className="flex items-center">
                            
                            <p className="text-sm">Límite de crédito al 70% de uso</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 flex justify-between">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => setBalance(prev => prev + 1000)}
                >
                    Agregar Fondos
                </button>
                <button className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-100">
                    Ver Más
                </button>
            </div>
        </div>
    );
}
