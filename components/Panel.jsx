"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Info, MoreHorizontal } from "lucide-react";

function Panel({
    title,
    description,
    subtitle,
    externalHref,
    className,
    children,
    showDescription = true,
    showExternalLink = true,
    actions,
    headerHeightClass = "h-[37px]",
    titleClassName,
    contentClassName,
    menuItems = [],
    menuLabel,
}) {
    const normalizedMenuItems = (Array.isArray(menuItems) ? menuItems : []).filter(Boolean);
    const derivedItems = normalizedMenuItems.length > 0 ? normalizedMenuItems : (externalHref ? [{ label: "Open link", href: externalHref }] : []);
    const items = derivedItems.slice(0, 5);

    return (
        <div className={cn("widget rounded-md shadow-sm/3 bg-white border border-gray-300 bg-white flex flex-col", className)}>
            <div className={cn(
                "flex flex-col gap-0 pl-2 pr-0.5 pt-0.5 border-b border-gray-300",
                subtitle ? "pb-2.5" : "pb-0.5 justify-center",
                headerHeightClass
            )}>
                <div className={cn("flex flex-row gap-2 items-center justify-between")}>
                    {/* title+info-icon */}
                    <div className="flex flex-row gap-0.5 items-center min-w-0">
                        {title ? (
                            <div className={cn("text-sm font-semibold truncate", titleClassName)}>{title}</div>
                        ) : null}
                        {showDescription && description ? (
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
                    {/* actions */}
                    <div className="flex items-center gap-1">
                        {actions}
                        {showExternalLink ? (
                            items.length ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon-sm" className="cursor-pointer" aria-label="Open menu">
                                            <MoreHorizontal />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {menuLabel ? (
                                            <>
                                                <DropdownMenuLabel>{menuLabel}</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                            </>
                                        ) : null}
                                        {items.map((item, idx) => (
                                            <DropdownMenuItem key={`${item.href}-${idx}`} asChild>
                                                <a href={item.href} target="_blank" rel="noopener noreferrer">{item.label}</a>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <div />
                            )
                        ) : null}
                    </div>
                </div>
                {subtitle ? (
                    <div className="text-xs text-gray-500 truncate leading-tight">{subtitle}</div>
                ) : null}
            </div>

            <div className={cn("flex-1 min-h-0 p-2 pt-0", contentClassName)}>{children}</div>
        </div>
    );
}

export default Panel;


