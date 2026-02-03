'use client'

import { useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"
import { ChevronDownIcon } from "lucide-react"
import MarkdownRenderer from "./MarkdownRenderer"
import { cn } from "@/lib/utils"

interface CollapsibleSectionProps {
    title: string
    content: string
    defaultOpen?: boolean
}

const CollapsibleSection = ({ title, content, defaultOpen = false }: CollapsibleSectionProps) => {
    const [open, setOpen] = useState<boolean>(defaultOpen)

    return (
        <Collapsible open={open} onOpenChange={setOpen} className="border border-blue-100 rounded-lg overflow-hidden">
            <CollapsibleTrigger className="w-full flex items-center justify-between p-3 bg-blue-50/50 hover:bg-blue-100/50 transition-colors">
                <h2 className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                    <span className="w-1 h-4 bg-blue-500 rounded-full" />
                    {title}
                </h2>
                <ChevronDownIcon className={cn("w-4 h-4 text-blue-600 transition-transform", open && "rotate-180")} />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-3 bg-white">
                <MarkdownRenderer content={content} />
            </CollapsibleContent>
        </Collapsible>
    )
}

export default CollapsibleSection