"use client"
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Table from '../components/Table';
import AlertBadge from '../components/AlertBadge';
import { obtenerTodosMovimientos } from '../api/movimientos';
import { verCuentas } from '../api/cuentas';
import { DollarSign, Users, CornerDownRight, X } from 'lucide-react';
import Cookies from 'js-cookie';

export default function Dashboard() {
    const [movimientos, setMovimientos] = useState([]);
    const [cuentas, setCuentas] = useState([]);
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

        const fetchCuentas = async () => {
            try {
                const data = await verCuentas();
                setCuentas(Array.isArray(data) ? data : []);
            } catch (error) {
                setError('Error al obtener las cuentas');
                console.error('Error al obtener las cuentas:', error);
            }
        };

        fetchMovimientos();
        fetchCuentas();
    }, []);
    const userName = Cookies.get('name');
    const totalCuentas = cuentas.length;

    // Calcular el total de los movimientos (importeMovimiento y importePagado)
    const totalImporteMovimiento = movimientos.reduce(
        (total, movimiento) => total + movimiento.importeMovimiento,
        0
    );

    const totalImportePagado = movimientos.reduce(
        (total, movimiento) => total + movimiento.importePagado,
        0
    );

    // Agrupar las cuentas por la cantidad de movimientos
    const cuentasConMasMovimientos = Array.isArray(cuentas)
        ? cuentas.map((cuenta) => {
            const movimientosCuenta = movimientos.filter(
                (mov) => mov.cuentaId === cuenta.id
            );
            return {
                cuentaNombre: cuenta.name,
                cantidadMovimientos: movimientosCuenta.length,
            };
        })
        : [];

    // Ordenar las cuentas por la cantidad de movimientos de mayor a menor
    const cuentasOrdenadas = cuentasConMasMovimientos
        .sort((a, b) => b.cantidadMovimientos - a.cantidadMovimientos)
        .slice(0, 5);

    const columns = [
        { header: 'Cuenta', align: 'text-center' },
        { header: 'Cantidad de Movimientos', align: 'text-center' },
    ];


    return (
        <div className="container mx-auto">
            <div className="pb-5">
                <p className="font-semibold text-2xl">Hola, {userName}!</p>
                <p className="text-zinc-500 text-xs">Este es un resumen de la actividad</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Tarjeta de Total Movimiento */}
                <Card className="p-4 border-none bg-gradient-to-t from-monza-500 to-monza-900 text-monza-100">
                    <div className="flex flex-row items-center justify-between pb-2">
                        <span className="text-sm font-medium">Total Movimiento</span>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                        <div className="text-4xl font-bold py-3">
                            ${totalImporteMovimiento.toLocaleString()}
                        </div>
                        <Link to="/movimientos" className="text-xs font-semibold text-gray-100 flex items-center">
                            <CornerDownRight className="mr-2 w-5" />Ver movimientos
                        </Link>
                    </div>
                </Card>
                {/* Tarjeta de Total Pagado */}
                <Card className="p-4 border-none bg-gradient-to-t from-blue-500 to-blue-900 text-blue-100">
                    <div className="flex flex-row items-center justify-between pb-2">
                        <span className="text-sm font-medium">Total Pagado</span>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                        <div className="text-4xl font-bold py-3">
                            ${totalImportePagado.toLocaleString()}
                        </div>
                    </div>
                </Card>
                {/* Tarjeta de Cuentas Totales */}
                <Card className="p-4 border-zinc-400 bg-zinc-100">
                    <div className="flex flex-row items-center justify-between pb-2">
                        <span className="text-sm font-medium">Cuentas Totales</span>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                        <div className="text-3xl font-bold py-3">{totalCuentas}</div>
                        <Link to="/cuentas" className="text-xs font-semibold text-gray-700 flex items-center">
                            <CornerDownRight className="mr-2 w-5" />Ver cuentas
                        </Link>
                    </div>
                </Card>
            </div>

            {error &&
                <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
                    <div className="bg-monza-700/80 text-monza-200 rounded-lg shadow-lg px-4 py-2 flex items-center space-x-4">
                        <p className="text-sm">{error}</p>
                        <button
                            className="ml-auto flex items-center justify-center Ztext-white hover:bg-red-800 rounded-full px-1"
                            onClick={() => setError(null)}
                        >
                            <X className='w-4' />
                        </button>
                    </div>
                </div>
            }

            {/* Tabla de Cuentas con Más Movimientos */}
            <div className="mt-4 mb-10 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4">
                    <h2 className="text-lg font-semibold my-2">Cuentas con Más Movimientos</h2>
                    {cuentasOrdenadas.length > 0 ? (
                        <div className="overflow-y-auto max-h-[600px]">
                            <Table
                                columns={columns}
                                data={cuentasOrdenadas}
                                renderRow={(cuenta) => (
                                    <>
                                        <td className="px-4 py-3 text-center">{cuenta.cuentaNombre}</td>
                                        <td className="px-4 py-3 text-center">{cuenta.cantidadMovimientos}</td>
                                    </>
                                )}
                            />
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">No hay cuentas con movimientos disponibles.</p>
                    )}
                </div>

                {/* Lista de Alertas */}
                <div className="col-span-3">
                    <h2 className="text-lg font-semibold py-2">Alertas</h2>
                    <Card className="p-4 min-h-full border-zinc-400/40 bg-zinc-100">
                        <div className="space-y-4 h-full">
                            {movimientos.length > 0 ? (
                                movimientos
                                    .flatMap((mov) => ({
                                        ...mov,
                                        cuentaNombre: cuentas.find((c) => c.id === mov.cuentaId)?.name || 'Sin nombre',
                                    }))
                                    .sort((a, b) => {
                                        const estadoA = a.importeMovimiento === a.importePagado ? 1 : 0;
                                        const estadoB = b.importeMovimiento === b.importePagado ? 1 : 0;
                                        return estadoA - estadoB;
                                    })
                                    .slice(0, 6)
                                    .map((mov) => {
                                        const estado = mov.importeMovimiento === mov.importePagado ? 'Al día' : 'Pendiente';
                                        const color = estado === 'Pendiente' ? 'yellow' : 'green';
                                        return (
                                            <div key={mov.id} className="flex items-center justify-between">
                                                <p className="text-sm">
                                                    {mov.cuentaNombre} - Movimiento N°: {mov.numeroMovimiento}
                                                </p>
                                                <AlertBadge value={estado} color={color} />
                                            </div>
                                        );
                                    })
                            ) : (
                                <p className="text-center text-gray-500">No hay alertas disponibles.</p>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );

}
