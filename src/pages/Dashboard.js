"use client"
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Table from '../components/Table';
import { obtenerTodosMovimientos } from '../api/movimientos';
import { DollarSign, ArrowLeftRight, Users } from 'lucide-react';
import Cookies from 'js-cookie';

export default function Dashboard() {
    const [movimientos, setMovimientos] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovimientos = async () => {
            try {
                const data = await obtenerTodosMovimientos();
                setMovimientos(data);
            } catch (error) {
                setError('Error al obtener los movimientos');
                console.error('Error al obtener los movimientos:', error);
            }
        };

        fetchMovimientos();
    }, []);

    // Ajustar columnas a mostrar en tabla
    const columns = [
        { header: 'Comentario', align: 'text-left' },
        { header: 'Importe', align: 'text-center' },
        { header: 'Medio de Pago', align: 'text-end' },
    ];
    const [balance] = useState(15000);
    const userName = Cookies.get('name');

    return (
        <div className="container mx-auto">
            <div className='pb-5'>
                <p className='font-semibold text-2xl'>Hola, {userName}!</p>
                <p className='text-zinc-500 text-xs'>Este es un resumen de la actividad</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="p-4 border-none bg-gradient-to-t from-monza-500 to-monza-900 text-monza-100">
                    <div className="flex flex-row items-center justify-between pb-2">
                        <span className="text-sm font-medium">Patrimonio</span>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                        <div className="text-4xl font-bold py-3">${balance.toLocaleString()}</div>
                        <p className="text-xs text-gray-200">+20.1% del mes anterior</p>
                    </div>
                </Card>
                <Card className='p-4 border-none bg-gradient-to-t from-blue-500 to-blue-900 text-blue-100'>
                    <div className="flex flex-row items-center justify-between pb-2">
                        <span className="text-sm font-medium">Movimientos Pendientes</span>
                        <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                        <div className="text-3xl font-bold py-3">3</div>
                        <p className="text-xs text-gray-200">-2 desde el último mes</p>
                    </div>
                </Card>
                <Card className='p-4 border-zinc-400'>
                    <div className="flex flex-row items-center justify-between pb-2">
                        <span className="text-sm font-medium">Cuentas Totales</span>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                        <div className="text-3xl font-bold py-3">2</div>
                        <p className="text-xs text-gray-800">Próximo: 15/07/2023</p>
                    </div>
                </Card>
            </div>

            <div className="mt-4 mb-10 min-h-52 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4">
                    <h2 className="text-lg font-semibold my-2">Resumen de Cuenta</h2>
                    {error ? (
                        <div className="text-red-500">Error: {error}</div>
                    ) : (
                        <div className="overflow-y-auto max-h-96"> {/* Añadir altura y scroll */}
                            <Table
                                columns={columns}
                                data={movimientos}
                                renderRow={(movimiento) => (
                                    <>
                                        <td className="px-4 py-3">{movimiento.comentarioMovimiento}</td>
                                        <td className="px-4 py-3 text-center">${movimiento.importeMovimiento}</td>
                                        <td className="px-4 py-3 text-end">{movimiento.medioPago}</td>
                                    </>
                                )}
                            />
                        </div>
                    )}
                </div>
                <div className="col-span-3">
                    <h2 className="text-lg font-semibold py-2">Alertas</h2>
                    <Card className='p-4 min-h-full border-zinc-400/40'>
                        <div className="space-y-4">
                            <div className="flex items-center">

                                <p className="text-sm">Factura #1234 vence en 3 días</p>
                            </div>
                            <div className="flex items-center">

                                <p className="text-sm">Límite de crédito al 70% de uso</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
