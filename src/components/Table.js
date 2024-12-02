import React from 'react';
import Card from './Card';

const Table = ({ columns, data, renderRow, className }) => {
    return (
        <Card className={`border-zinc-400/40 min-h-full ${className}`}>
            <table className="min-w-full">
                <thead className="text-xs">
                    <tr>
                        {columns.map((col, index) => (
                            <th
                                key={index}
                                className={`px-4 pb-2 pt-4 ${col.align} font-light`}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {data.map((item, index) => (
                        <tr
                            key={index}
                            className="shadow-sm rounded-lg hover:bg-monza-200/40 transition-colors text-sm odd:bg-zinc-300/50"
                        >
                            {renderRow(item, index)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    );
};

export default Table;
