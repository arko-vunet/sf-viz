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

const seedData = [
    {
        id: "srv-1",
        service: "api-gateway",
        host: "gw-01",
        region: "us-east-1",
        status: "Healthy",
        cpuPct: 34,
        memPct: 58,
        diskPct: 41,
        p95Ms: 112,
        errorPct: 0.2,
        uptimePct: 99.99,
    },
    {
        id: "srv-2",
        service: "payments",
        host: "pay-02",
        region: "us-east-1",
        status: "Degraded",
        cpuPct: 76,
        memPct: 69,
        diskPct: 72,
        p95Ms: 384,
        errorPct: 1.7,
        uptimePct: 99.92,
    },
    {
        id: "srv-3",
        service: "search",
        host: "srch-03",
        region: "eu-west-1",
        status: "Healthy",
        cpuPct: 21,
        memPct: 45,
        diskPct: 35,
        p95Ms: 89,
        errorPct: 0.05,
        uptimePct: 99.995,
    },
    {
        id: "srv-4",
        service: "worker-queue",
        host: "wrk-07",
        region: "ap-south-1",
        status: "Down",
        cpuPct: 0,
        memPct: 12,
        diskPct: 15,
        p95Ms: 0,
        errorPct: 100,
        uptimePct: 96.2,
    },
];

const services = [
    "api-gateway",
    "payments",
    "search",
    "worker-queue",
    "auth",
    "inventory",
    "orders",
    "notifications",
    "analytics",
    "catalog",
];

const regions = ["us-east-1", "us-west-2", "eu-west-1", "ap-south-1", "ap-southeast-1"];

const generatedData = Array.from({ length: 40 }, (_, i) => {
    const service = services[i % services.length];
    const region = regions[i % regions.length];
    const load = (i * 13) % 100; // deterministic spread
    const cpuPct = (load + 20) % 100;
    const memPct = (load + 35) % 100;
    const diskPct = (load + 50) % 100;
    const p95Ms = 60 + ((load * 7) % 700);
    const errorPct = Number(((load / 55) ** 2).toFixed(2));
    const uptimePct = Number(Math.max(95, 99.9 - load * 0.03).toFixed(3));
    const status = load >= 90 ? "Down" : load >= 70 ? "Degraded" : "Healthy";
    const hostPrefix = service.replace(/[^a-z]/g, "").slice(0, 4) || "srv";
    return {
        id: `srv-${i + 5}`,
        service,
        host: `${hostPrefix}-${String(i + 5).padStart(2, "0")}`,
        region,
        status,
        cpuPct,
        memPct,
        diskPct,
        p95Ms,
        errorPct,
        uptimePct,
    };
});

const defaultData = [...seedData, ...generatedData];

function StatusBadge({ status }) {
    const colorClass =
        status === "Healthy"
            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
            : status === "Degraded"
                ? "bg-amber-100 text-amber-800 border-amber-200"
                : "bg-rose-100 text-rose-800 border-rose-200";
    return (
        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${colorClass}`}>
            {status}
        </span>
    );
}

const defaultColumns = [
    columnHelper.accessor("service", {
        header: () => "Service",
        cell: info => (
            <div className="flex flex-col">
                <span className="font-medium">{info.getValue()}</span>
                <span className="text-xs text-gray-500">{info.row.original.region}</span>
            </div>
        ),
    }),
    columnHelper.accessor("host", {
        header: () => "Host",
        cell: info => info.getValue(),
    }),
    columnHelper.accessor("status", {
        header: () => "Status",
        cell: info => <StatusBadge status={info.getValue()} />,
    }),
    columnHelper.accessor("cpuPct", {
        header: () => "CPU (%)",
        cell: info => {
            const v = info.getValue();
            const cls = v >= 85 ? "font-semibold text-rose-700" : v >= 65 ? "font-semibold text-amber-700" : "";
            return <span className={`tabular-nums ${cls}`}>{v}</span>;
        },
    }),
    columnHelper.accessor("memPct", {
        header: () => "Memory (%)",
        cell: info => {
            const v = info.getValue();
            const cls = v >= 85 ? "font-semibold text-rose-700" : v >= 65 ? "font-semibold text-amber-700" : "";
            return <span className={`tabular-nums ${cls}`}>{v}</span>;
        },
    }),
    columnHelper.accessor("diskPct", {
        header: () => "Disk (%)",
        cell: info => {
            const v = info.getValue();
            const cls = v >= 85 ? "font-semibold text-rose-700" : v >= 65 ? "font-semibold text-amber-700" : "";
            return <span className={`tabular-nums ${cls}`}>{v}</span>;
        },
    }),
    columnHelper.accessor("p95Ms", {
        header: () => "p95 Latency (ms)",
        cell: info => {
            const v = info.getValue();
            const cls = v >= 500 ? "font-semibold text-rose-700" : v >= 250 ? "font-semibold text-amber-700" : "";
            return <span className={`tabular-nums ${cls}`}>{v}</span>;
        },
    }),
    columnHelper.accessor("errorPct", {
        header: () => "Error Rate (%)",
        cell: info => {
            const v = info.getValue();
            const cls = v >= 5 ? "font-semibold text-rose-700" : v >= 1 ? "font-semibold text-amber-700" : "";
            return <span className={`tabular-nums ${cls}`}>{v}</span>;
        },
    }),
    columnHelper.accessor("uptimePct", {
        header: () => "Uptime (%)",
        cell: info => <span className="tabular-nums">{info.getValue()}</span>,
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
        <Panel className="h-full" title={title} description={description} externalHref={externalHref} headerHeightClass="h-[37px]">
            <div className="overflow-x-auto overflow-y-auto max-h-80 pt-0">
                <table className="w-full text-sm min-w-max">
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id} className="border-b border-gray-200">
                                {headerGroup.headers.map(header => {
                                    const isNumericHeader = ["cpuPct", "memPct", "diskPct", "p95Ms", "errorPct", "uptimePct"].includes(header.column.id);
                                    return (
                                        <th
                                            key={header.id}
                                            className={`${isNumericHeader ? "text-right" : "text-left"} font-semibold whitespace-nowrap px-3 py-2 text-gray-700 sticky top-0 z-10 bg-gray-200`}
                                        >
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                                {row.getVisibleCells().map(cell => {
                                    const isNumericCell = ["cpuPct", "memPct", "diskPct", "p95Ms", "errorPct", "uptimePct"].includes(cell.column.id);
                                    return (
                                        <td key={cell.id} className={`${isNumericCell ? "text-right" : "text-left"} px-3 py-2`}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Panel>
    );
}


