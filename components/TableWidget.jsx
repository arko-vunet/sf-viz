"use client";

import React from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, SquareArrowOutUpRight } from "lucide-react";

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
        <div className="widget rounded-md shadow-sm/3 bg-white border border-gray-300">
            <div className="flex flex-row gap-2 h-[37px] pl-2 pr-0.5 py-0.5 border-b border-gray-300 items-center justify-between">
                <div className="flex flex-row gap-0.5 items-center min-w-0">
                    <div className="text-sm font-semibold truncate">{title}</div>
                    {description ? (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon-sm" className="cursor-pointer">
                                    <Info />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{description}</p>
                            </TooltipContent>
                        </Tooltip>
                    ) : null}
                </div>
                {externalHref ? (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <a href={externalHref} target="_blank" rel="noreferrer">
                                <Button variant="ghost" size="icon-sm" className="cursor-pointer text-blue-600 hover:text-blue-900">
                                    <SquareArrowOutUpRight />
                                </Button>
                            </a>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>External link</p>
                        </TooltipContent>
                    </Tooltip>
                ) : (
                    <div />
                )}
            </div>

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
        </div>
    );
}


