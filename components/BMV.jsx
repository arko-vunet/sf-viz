"use client";

import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Big Metric Value (BMV) Widget Component
 * Displays a large metric value with color coding and historical data
 */
export default function BMV({
    value = "0.00%",
    label = "Metric",
    historicalData = [],
    thresholds = {
        good: 70,     // Above this is green
        warning: 40,  // Between warning and good is orange
        critical: 20  // Below critical is red
    },
    showHistorical = true,
    className,
    valueClassName,
    ...props
}) {
    // Determine color based on thresholds
    const getColorClass = (val) => {
        const numValue = parseFloat(val.replace('%', ''));
        if (numValue >= thresholds.good) return "text-green-600";
        if (numValue >= thresholds.warning) return "text-orange-500";
        return "text-red-600";
    };

    // Get trend icon for historical data
    const getTrendIcon = (currentVal, historicalVal) => {
        const currentNum = parseFloat(currentVal.replace('%', ''));
        const historicalNum = parseFloat(historicalVal.replace('%', ''));

        if (currentNum > historicalNum) {
            return <ArrowUp className="w-3 h-3 text-gray-500" />;
        } else if (currentNum < historicalNum) {
            return <ArrowDown className="w-3 h-3 text-gray-500" />;
        }
        return null;
    };

    // Calculate percentage change between current and historical values
    const calculatePercentageChange = (currentVal, historicalVal) => {
        const currentNum = parseFloat(currentVal.replace('%', ''));
        const historicalNum = parseFloat(historicalVal.replace('%', ''));

        if (historicalNum === 0) return 0;

        const change = ((currentNum - historicalNum) / historicalNum) * 100;
        return Math.round(change * 10) / 10; // Round to 1 decimal place
    };

    // Format percentage change for display
    const formatPercentageChange = (change) => {
        const sign = change >= 0 ? '+' : '';
        return `${sign}${change}%`;
    };

    // Get color class for percentage change (now neutral)
    const getChangeColorClass = (change) => {
        return "text-gray-500";
    };

    return (
        <div className={cn("flex flex-col items-center justify-center h-full text-center", className)} {...props}>
            {/* Main Metric Value */}
            <div className="mb-4">
                <div className={cn("text-5xl font-bold leading-none", getColorClass(value), valueClassName)}>
                    {value}
                </div>
                {label && (
                    <div className="text-sm text-gray-500 mt-1">
                        {label}
                    </div>
                )}
            </div>

            {/* Historical Data */}
            {showHistorical && historicalData.length > 0 && (
                <div className="w-full space-y-3">
                    {historicalData.map((item, index) => {
                        const percentageChange = calculatePercentageChange(value, item.value);
                        return (
                            <div key={index} className="flex justify-between text-sm">
                                <span className="text-gray-600">{item.label}</span>
                                <div className="flex flex-col items-end gap-0.5">
                                    <span className={cn("font-medium", getColorClass(item.value))}>
                                        {item.value}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        {getTrendIcon(value, item.value)}
                                        <span className={cn("text-xs font-medium", getChangeColorClass(percentageChange))}>
                                            ({formatPercentageChange(percentageChange)})
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
