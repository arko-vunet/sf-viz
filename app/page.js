"use client";

import { useEffect, useRef, useState } from "react";
import Panel from "@/components/Panel";
import TableWidget from "@/components/TableWidget";
import BMV from "@/components/BMV";
import { FilterPill } from "@/components/ui/filter-pill";
import ColumnChart from "@/components/charts/ColumnChart";
import PieChart from "@/components/charts/PieChart";
import LineChart from "@/components/charts/LineChart";
import MultiLineChart from "@/components/charts/MultiLineChart";
import RGLDashboard from "@/components/RGLDashboard";

export default function Home() {
  const [pillChecked, setPillChecked] = useState(true);

  return (
    <div className={`grid-ctr font-sans ${pillChecked ? "" : "no-stripes"}`}>
      <div className="col-span-full pb-1">
        <FilterPill checked={pillChecked} onCheckedChange={setPillChecked} aria-label="Toggle grid stripes">
          Grids
        </FilterPill>
      </div>
      <div className="col-span-full">
        <RGLDashboard />
      </div>
    </div>
  );
}
