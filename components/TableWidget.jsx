"use client";

import React, { useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
    createColumnHelper,
} from "@tanstack/react-table";
import Panel from "@/components/Panel";
import { Button } from "@/components/ui/button";
import { ArrowDownWideNarrow, ArrowUpWideNarrow, ArrowUpDown, ArrowDownAZ, ArrowUpZA } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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

function PercentCell({ value, redThreshold, amberThreshold, neutral = false, textClass = "" }) {
    const v = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
    const barColor = neutral
        ? "bg-gray-400"
        : v >= redThreshold
            ? "bg-rose-400"
            : v >= amberThreshold
                ? "bg-amber-400"
                : "bg-gray-400";
    return (
        <div className="flex items-center gap-2 w-full">
            <div className="relative h-1.5 shrink-0 w-8 md:w-12 rounded bg-gray-200">
                <div className={`absolute inset-y-0 left-0 rounded ${barColor}`} style={{ width: `${v}%` }} />
            </div>
            <span className={`ml-auto tabular-nums ${textClass}`}>{Number.isFinite(value) ? value : ""}</span>
        </div>
    );
}

function Sparkline({ data, height = 14, color = "#9CA3AF", strokeWidth = 1.25 }) {
    const n = Array.isArray(data) ? data.length : 0;
    if (n < 2) {
        return <svg className="w-full" viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" />;
    }
    const stepX = 100 / (n - 1);
    const clamp01 = v => Math.max(0, Math.min(1, v));
    const y = v => (height - height * clamp01(v / 100));
    let d = `M 0 ${y(data[0])}`;
    for (let i = 1; i < n; i++) {
        d += ` L ${i * stepX} ${y(data[i])}`;
    }
    return (
        <svg className="w-full h-3" viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
            <path d={d} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function hashStringToInt(str) {
    let h = 2166136261 >>> 0; // FNV-like
    for (let i = 0; i < String(str).length; i++) {
        h ^= String(str).charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

function mulberry32(seed) {
    return function () {
        let t = (seed += 0x6D2B79F5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function generateUptimeSeries(seedKey, lastValue, length = 24) {
    const seed = hashStringToInt(seedKey ?? "seed");
    const rnd = mulberry32(seed);
    const series = [];
    const base = Math.max(90, Math.min(100, Number.isFinite(lastValue) ? lastValue : 99));
    let val = base - 0.5 + (rnd() - 0.5) * 1.0;
    for (let i = 0; i < length - 1; i++) {
        const drift = (rnd() - 0.5) * 0.8; // gentle variation
        const revert = (base - val) * 0.12; // mean reversion
        val = Math.max(90, Math.min(100, val + drift + revert));
        // occasional small dip
        if (rnd() < 0.08) {
            val = Math.max(92, val - (1.5 + rnd() * 1.5));
        }
        series.push(Number(val.toFixed(2)));
    }
    series.push(Number(Math.max(0, Math.min(100, base)).toFixed(2))); // end at lastValue
    return series;
}

function UptimeSparklineCell({ value, seedKey, textClass = "" }) {
    const series = generateUptimeSeries(seedKey, value, 24);
    return (
        <div className="flex items-center gap-2 w-full">
            <div className="shrink-0 w-16"><Sparkline data={series} /></div>
            <span className={`ml-auto tabular-nums ${textClass}`}>{Number.isFinite(value) ? value : ""}</span>
        </div>
    );
}

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

// Convert a ReactNode (including JSX) into plain text for subtitle display
function nodeToText(node) {
    if (node == null || node === false || node === true) return "";
    if (typeof node === "string" || typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(nodeToText).join("");
    if (React.isValidElement(node)) return nodeToText(node.props?.children);
    return "";
}

const defaultColumns = [
    columnHelper.accessor("service", {
        header: () => "Service",
        cell: info => <span className="font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor("host", {
        header: () => "Host",
        cell: info => info.getValue(),
    }),
    columnHelper.accessor("region", {
        header: () => "Region",
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
            return <PercentCell value={v} redThreshold={85} amberThreshold={65} textClass={cls} />;
        },
    }),
    columnHelper.accessor("memPct", {
        header: () => "Memory (%)",
        cell: info => {
            const v = info.getValue();
            const cls = v >= 85 ? "font-semibold text-rose-700" : v >= 65 ? "font-semibold text-amber-700" : "";
            return <PercentCell value={v} redThreshold={85} amberThreshold={65} textClass={cls} />;
        },
    }),
    columnHelper.accessor("diskPct", {
        header: () => "Disk (%)",
        cell: info => {
            const v = info.getValue();
            const cls = v >= 85 ? "font-semibold text-rose-700" : v >= 65 ? "font-semibold text-amber-700" : "";
            return <PercentCell value={v} redThreshold={85} amberThreshold={65} textClass={cls} />;
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
            return <PercentCell value={v} redThreshold={5} amberThreshold={1} textClass={cls} />;
        },
    }),
    columnHelper.accessor("uptimePct", {
        header: () => "Uptime (%)",
        cell: info => {
            const v = info.getValue();
            const seedKey = info.row?.original?.id ?? info.row?.id ?? "row";
            return <UptimeSparklineCell value={v} seedKey={seedKey} />;
        },
    }),
];

export default function TableWidget({
    title = "Table Widget",
    description = "A data table built with TanStack React Table.",
    data = defaultData,
    columns = defaultColumns,
    externalHref,
    subtitleEmphasisClassName = "text-gray-700 font-medium",
    // Back-compat: if provided, these will be ignored in favor of subtitleEmphasisClassName
    subtitleValueClassName,
    subtitleDirClassName,
}) {
    // Default sort: uptimePct descending
    const [sorting, setSorting] = useState([{ id: "uptimePct", desc: true }]);

    const table = useReactTable({
        data,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    // Build subtitle from current sorting state
    const subtitle = (function () {
        const emphCls = subtitleEmphasisClassName ?? subtitleValueClassName ?? subtitleDirClassName ?? "text-gray-800 font-semibold underline";
        if (!Array.isArray(sorting) || sorting.length === 0) {
            return (
                <span>
                    Table sorted by <span className={emphCls}>default order</span>
                </span>
            );
        }
        const s = sorting[0];
        if (!s?.id) return undefined;

        // Force header instances creation and build id->label map
        let headerText = s.id;
        try {
            const groups = table.getHeaderGroups();
            const idToText = new Map();
            groups.forEach(g => {
                g.headers.forEach(h => {
                    if (h.isPlaceholder) return;
                    try {
                        const node = flexRender(h.column.columnDef.header, h.getContext());
                        const txt = nodeToText(node).trim();
                        if (txt) idToText.set(h.column.id, txt);
                    } catch (_) { /* ignore */ }
                });
            });
            if (idToText.has(s.id)) headerText = idToText.get(s.id);
        } catch (_) { /* ignore */ }

        // Fallback: render from column def directly
        if (headerText === s.id) {
            const col = table.getAllLeafColumns().find(c => c.id === s.id);
            if (col?.columnDef?.header !== undefined) {
                try {
                    const rendered = typeof col.columnDef.header === 'string' ? col.columnDef.header : flexRender(col.columnDef.header, { column: col, table });
                    const txt = nodeToText(rendered).trim();
                    if (txt) headerText = txt;
                } catch (_) { /* ignore */ }
            }
        }

        // Extra fallback: look up header from original columns prop
        if (headerText === s.id) {
            try {
                const defs = Array.isArray(columns) ? columns : [];
                const def = defs.find(d => (d?.id ?? d?.accessorKey) === s.id);
                if (def?.header !== undefined) {
                    const rendered = typeof def.header === 'string'
                        ? def.header
                        : (typeof def.header === 'function' ? def.header({ column: table.getColumn(s.id), table }) : def.header);
                    const txt = nodeToText(rendered).trim();
                    if (txt) headerText = txt;
                }
            } catch (_) { /* ignore */ }
        }

        const dir = s.desc ? 'descending' : 'ascending';
        return (
            <span>
                Table sorted by <span className={emphCls}>{headerText}</span> in <span className={emphCls}>{dir}</span> order
            </span>
        );
    })();

    return (
        <Panel className="h-full" title={title} description={description} externalHref={externalHref} subtitle={subtitle} headerHeightClass="min-h-[52px]" contentClassName="p-0">
            <div className="overflow-x-auto overflow-y-auto max-h-80">
                <table className="w-full text-sm min-w-max">
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id} className="border-b border-gray-200">
                                {headerGroup.headers.map(header => {
                                    const isNumericHeader = ["cpuPct", "memPct", "diskPct", "p95Ms", "errorPct", "uptimePct"].includes(header.column.id);
                                    return (
                                        <th
                                            key={header.id}
                                            className={`${isNumericHeader ? "text-right" : "text-left"} font-semibold whitespace-nowrap px-3 py-2 text-gray-700 sticky top-0 z-10 bg-gray-200 overflow-hidden`}
                                            aria-sort={header.column.getIsSorted() === 'asc' ? 'ascending' : header.column.getIsSorted() === 'desc' ? 'descending' : 'none'}
                                        >
                                            <div className={`relative group min-w-0 ${isNumericHeader ? "text-right" : "text-left"}`}>
                                                <div className="truncate min-w-0 w-full max-w-full group-hover:max-w-[calc(100%-28px)]">
                                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                                </div>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            onClick={header.column.getToggleSortingHandler()}
                                                            variant="ghost"
                                                            size="icon-sm"
                                                            aria-label="Sort"
                                                            className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
                                                        >
                                                            {(function () {
                                                                const sorted = header.column.getIsSorted();
                                                                if (sorted === 'asc') {
                                                                    return isNumericHeader ? <ArrowUpWideNarrow /> : <ArrowDownAZ />;
                                                                } else if (sorted === 'desc') {
                                                                    return isNumericHeader ? <ArrowDownWideNarrow /> : <ArrowUpZA />;
                                                                }
                                                                return <ArrowUpDown />;
                                                            })()}
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        {(function () {
                                                            const sorted = header.column.getIsSorted();
                                                            if (isNumericHeader) {
                                                                if (sorted === 'asc') return 'Sorted ascending (click to clear sort)';
                                                                if (sorted === 'desc') return 'Sorted descending (click to sort ascending)';
                                                                return 'Unsorted (click to sort descending)';
                                                            } else {
                                                                if (sorted === 'asc') return 'Sorted A → Z (click to sort Z → A)';
                                                                if (sorted === 'desc') return 'Sorted Z → A (click to clear sort)';
                                                                return 'Unsorted (click to sort A → Z)';
                                                            }
                                                        })()}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
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


