import React from "react";
import Card from "./Card";

const Table = ({ columns, data, renderRow, className }) => {
    return (
        <Card className={`border-none min-h-full ${className}`}>
            <div className="relative overflow-x-auto sm:rounded-md">
                <table className="w-full text-sm text-left rtl:text-right text-zinc-500 dark:text-gray-400">
                    <thead className="text-zinc-700 uppercase bg-zinc-300">
                        <tr>
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    scope="col"
                                    className={`${col.align} font-semibold text-xs px-6 py-3`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr
                                key={index}
                                className={`bg-zinc-100 text-zinc-800 ${
                                    index !== data.length - 1
                                        ? "border-b border-zinc-300"
                                        : ""
                                }`}
                            >
                                {renderRow(item, index)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default Table;