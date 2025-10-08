"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, SquareArrowOutUpRight } from "lucide-react";

function Panel({
    title,
    description,
    externalHref,
    className,
    children,
    showDescription = true,
    showExternalLink = true,
    actions,
    headerHeightClass = "h-[37px]",
    titleClassName,
}) {
    return (
        <div className={cn("widget rounded-md shadow-sm/3 bg-white border border-gray-300 bg-white flex flex-col", className)}>
            <div className={cn("flex flex-row gap-2 pl-2 pr-0.5 py-0.5 border-b border-gray-300 items-center justify-between", headerHeightClass)}>
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

                <div className="flex items-center gap-1">
                    {actions}
                    {showExternalLink ? (
                        externalHref ? (
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
                        )
                    ) : null}
                </div>
            </div>

            <div className="flex-1 min-h-0 p-2 pt-0">{children}</div>
        </div>
    );
}

export default Panel;


