"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { InvestmentRecord, exportToCSV } from "@/lib/lq-utils"
import { Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface InvestTableProps {
  records: InvestmentRecord[]
  onDeleteRecord: (id: string) => void
}

export function InvestTable({ records, onDeleteRecord }: InvestTableProps) {
  if (records.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          Belum ada data investasi. Silakan input data.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Data Investasi</CardTitle>
        <Button variant="outline" size="sm" onClick={() => exportToCSV(records)}>
          Export CSV
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border mt-4">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Wilayah</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Sektor</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tahun</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Nilai Investasi</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {records.map((record) => (
                  <tr key={record.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle">{record.region}</td>
                    <td className="p-4 align-middle">{record.sector}</td>
                    <td className="p-4 align-middle">{record.year}</td>
                    <td className="p-4 align-middle text-right">
                      {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(record.value)}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteRecord(record.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
