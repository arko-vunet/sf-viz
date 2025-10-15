"use client";

import { useEffect, useRef, useState } from "react";
import Panel from "@/components/Panel";
import TableWidget from "@/components/TableWidget";
import { FilterPill } from "@/components/ui/filter-pill";
import ColumnChart from "@/components/charts/ColumnChart";
import PieChart from "@/components/charts/PieChart";
import LineChart from "@/components/charts/LineChart";
import MultiLineChart from "@/components/charts/MultiLineChart";

export default function Home() {
  const [pillChecked, setPillChecked] = useState(true);

  return (
    <div className={`grid-ctr font-sans ${pillChecked ? "" : "no-stripes"}`}>
      <div className="col-span-full pb-1">
        <FilterPill checked={pillChecked} onCheckedChange={setPillChecked} aria-label="Toggle grid stripes">
          Grids
        </FilterPill>
      </div>
      <div className="col-span-4 lg:col-span-6">
        <TableWidget
          title="Resource Utilization"
          description="Example table powered by TanStack React Table."
          externalHref="https://tanstack.com/table/latest"
        />
      </div>
      <Panel
        className="col-span-4"
        title="Widget Title"
        description="A description of the widget; can be fairly long, wrapping to multiple lines, if needed."
        externalHref="https://example.com"
      >
        <ColumnChart />
      </Panel>
      <Panel
        className="col-span-2"
        title="Regions Share"
        description="Category breakdown as a pie chart."
        showExternalLink={false}
        headerHeightClass="h-[37px]"
      >
        <PieChart />
      </Panel>
      <Panel
        className="col-span-4"
        title="CPU Utilization—Breaches"
        description="A description of the widget; can be fairly long, wrapping to multiple lines, if needed."
        externalHref="https://example.com"
        headerHeightClass="h-[37px]"
      >
        <LineChart />
      </Panel>
      <Panel
        className="col-span-4"
        title="Widget Title"
        showDescription={false}
        showExternalLink={false}
        headerHeightClass="h-[37px]"
      >
        <MultiLineChart />
      </Panel>
    </div>
  );
}
