"use client";

import React from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from "@tanstack/react-table";
import Panel from "@/components/Panel";

const columnHelper = createColumnHelper();

const defaultData = [
    { id: "1", name: "Alice", role: "Analyst", status: "Active" },
    { id: "2", name: "Bob", role: "Engineer", status: "Active" },
    { id: "3", name: "Carol", role: "Manager", status: "On Leave" },
    { id: "4", name: "Dave", role: "Engineer", status: "Active" },
];

const defaultColumns = [
    columnHelper.accessor("name", {
        header: () => "Name",
        cell: info => info.getValue(),
    }),
    columnHelper.accessor("role", {
        header: () => "Role",
        cell: info => info.getValue(),
    }),
    columnHelper.accessor("status", {
        header: () => "Status",
        cell: info => info.getValue(),
    }),
];

export default function TableWidget({
    title = "Table Widget",
    description = "A data table built with TanStack React Table.",
    data = defaultData,
    columns = defaultColumns,
    externalHref,
}) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <Panel title={title} description={description} externalHref={externalHref} headerHeightClass="h-[37px]">
            <div className="overflow-x-auto p-2">
                <table className="w-full text-sm">
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id} className="border-b border-gray-200">
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className="text-left font-semibold px-3 py-2 text-gray-700">
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="px-3 py-2">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Panel>
    );
}


