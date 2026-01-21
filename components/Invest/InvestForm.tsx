"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InvestmentRecord } from "@/lib/lq-utils"

interface InvestFormProps {
  onAddRecord: (record: Omit<InvestmentRecord, "id">) => void
}

const REGIONS = [
  "Kota Medan",
  "Kota Binjai",
  "Kabupaten Deli Serdang",
  "Kabupaten Karo",
  "Kabupaten Langkat",
  "Kota Pematangsiantar",
  "Kabupaten Simalungun",
  "Kabupaten Asahan",
  "Kabupaten Batubara",
  "Kota Tebing Tinggi",
  "Kabupaten Serdang Bedagai",
  // Add more as needed
]

const SECTORS = [
  "Pertanian, Peternakan, Kehutanan, dan Perikanan",
  "Pertambangan dan Penggalian",
  "Industri Pengolahan",
  "Listrik, Gas, dan Air Bersih",
  "Konstruksi",
  "Perdagangan, Hotel, dan Restoran",
  "Transportasi dan Komunikasi",
  "Keuangan, Real Estat, dan Jasa Perusahaan",
  "Jasa-jasa",
]

export function InvestForm({ onAddRecord }: InvestFormProps) {
  const [region, setRegion] = React.useState(REGIONS[0])
  const [sector, setSector] = React.useState(SECTORS[0])
  const [value, setValue] = React.useState("")
  const [year, setYear] = React.useState(new Date().getFullYear().toString())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!region || !sector || !value) return

    onAddRecord({
      region,
      sector,
      value: Number(value),
      year: Number(year),
    })

    setValue("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Input Data Investasi</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Wilayah</label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Sektor</label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
            >
              {SECTORS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Nilai Investasi (Rp)</label>
            <Input
              type="number"
              placeholder="0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              min="0"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Tahun</label>
            <Input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full">Tambah</Button>
        </form>
      </CardContent>
    </Card>
  )
}
