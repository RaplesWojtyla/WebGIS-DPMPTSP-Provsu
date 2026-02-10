"use client"

import React from "react"
import { Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TableActionsProps {
    onEdit: () => void
    onDelete: () => void
    disabled?: boolean
}

const TableActions = ({ onEdit, onDelete, disabled }: TableActionsProps) => (
    <div className="flex gap-2">
        <Button variant="ghost" size="icon" onClick={onEdit} disabled={disabled} className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onDelete} disabled={disabled} className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
            <Trash className="h-4 w-4" />
        </Button>
    </div>
)

interface WilayahTableProps<T> {
    columns: string[]
    data: (React.ReactNode | T)[][]
    renderActions?: (item: T) => React.ReactNode // Optional custom action renderer
    onEdit?: (item: T) => void
    onDelete?: (id: string) => void
    isPending?: boolean
    startIndex?: number
}

export function WilayahTable<T extends { id: string }>({ columns, data, onEdit, onDelete, isPending, startIndex = 0 }: WilayahTableProps<T>) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                    <tr>
                        {columns.map((col, idx) => (
                            <th key={idx} className="px-6 py-4 font-semibold text-gray-600 tracking-wider whitespace-nowrap">{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {data.length > 0 ? (
                        data.map((row, rIdx) => {
                            // The last item in the row is the actual data item object for actions
                            const item = row[row.length - 1] as T
                            // The display cells are all except the last one
                            const cells = row.slice(0, row.length - 1)

                            return (
                                <tr key={rIdx} className="hover:bg-gray-50/50 transition-colors">
                                    {cells.map((cell, cIdx) => (
                                        <td key={cIdx} className="px-6 py-4 text-gray-700 whitespace-nowrap">{cell as React.ReactNode}</td>
                                    ))}
                                    <td className="px-6 py-4">
                                        {onEdit && onDelete && (
                                            <TableActions
                                                onEdit={() => onEdit(item)}
                                                onDelete={() => onDelete(item.id)}
                                                disabled={isPending}
                                            />
                                        )}
                                    </td>
                                </tr>
                            )
                        })
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                                Tidak ada data
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
