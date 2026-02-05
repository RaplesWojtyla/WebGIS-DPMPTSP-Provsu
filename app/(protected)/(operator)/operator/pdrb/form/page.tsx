"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Save, ArrowLeft } from "lucide-react";
import { SECTORS, REGIONS, STORAGE_KEY_PREFIX, PdrbValue } from "../constants";

function PdrbFormContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const regionId = searchParams.get("regionId");
    const year = searchParams.get("year");

    const [formValues, setFormValues] = useState<number[]>(new Array(SECTORS.length).fill(0));
    const [isLoading, setIsLoading] = useState(true);

    const region = REGIONS.find(r => r.id === regionId);

    useEffect(() => {
        if (!regionId || !year) {
            toast.error("Data wilayah atau tahun tidak valid");
            router.push("/operator/pdrb");
            return;
        }

        const key = `${STORAGE_KEY_PREFIX}${year}-${regionId}`;
        const storedData = localStorage.getItem(key);

        if (storedData) {
            try {
                const parsedData: PdrbValue[] = JSON.parse(storedData);
                const values = new Array(SECTORS.length).fill(0);
                parsedData.forEach(item => {
                    if (item.sectorIndex >= 0 && item.sectorIndex < SECTORS.length) {
                        values[item.sectorIndex] = item.value;
                    }
                });
                setFormValues(values);
            } catch (e) {
                console.error("Failed to parse stored data", e);
            }
        }
        setIsLoading(false);
    }, [regionId, year, router]);

    const handleValueChange = (index: number, valStr: string) => {
        const val = parseFloat(valStr);
        const newValues = [...formValues];
        newValues[index] = isNaN(val) ? 0 : val;
        setFormValues(newValues);
    };

    const handleSave = () => {
        if (!regionId || !year) return;

        const key = `${STORAGE_KEY_PREFIX}${year}-${regionId}`;
        const dataToSave: PdrbValue[] = formValues.map((v, i) => ({ sectorIndex: i, value: v }));

        localStorage.setItem(key, JSON.stringify(dataToSave));
        toast.success(`Data PDRB ${region?.name} (${year}) berhasil disimpan`);
        router.push("/operator/pdrb");
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 2 }).format(val);
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Memuat data...</div>;
    }

    if (!region) {
        return <div className="p-8 text-center text-red-500">Wilayah tidak ditemukan</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-10 w-10">
                    <ArrowLeft className="h-6 w-6 text-gray-600" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-gray-900 to-gray-600">
                        Input Data PDRB
                    </h1>
                    <p className="text-gray-500 mt-1 flex items-center gap-2">
                        <span className="font-medium text-gray-900">{region.name}</span>
                        <span className="text-gray-300">•</span>
                        <span>Tahun {year}</span>
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-1">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow>
                                <TableHead className="w-[60px] text-center">No</TableHead>
                                <TableHead className="min-w-[400px]">Sektor Lapangan Usaha</TableHead>
                                <TableHead className="w-[300px] text-right">Nilai PDRB (Juta RP)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {SECTORS.map((sector, index) => (
                                <TableRow key={index} className="hover:bg-gray-50/30 transition-colors">
                                    <TableCell className="text-center font-medium text-gray-500 bg-gray-50/30">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell className="font-medium text-gray-700 py-4">
                                        {sector}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">Rp</span>
                                            <Input
                                                type="number"
                                                step="any"
                                                className="text-right font-mono pl-10 pr-4 h-11 text-base bg-white focus:bg-blue-50/50 border-gray-200 focus:border-blue-500 transition-all font-medium text-gray-900"
                                                placeholder="0"
                                                value={formValues[index] || ""}
                                                onChange={(e) => handleValueChange(index, e.target.value)}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="border-t border-gray-100 p-6 bg-gray-50/30">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3 bg-blue-50 px-5 py-3 rounded-lg border border-blue-100 w-full md:w-auto">
                            <span className="text-blue-600 font-medium">Total PDRB:</span>
                            <span className="text-xl font-bold font-mono text-blue-700">
                                {formatCurrency(formValues.reduce((a, b) => a + b, 0))}
                            </span>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <Button variant="outline" size="lg" onClick={() => router.back()} className="flex-1 md:flex-none">
                                Batal
                            </Button>
                            <Button onClick={handleSave} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white gap-2 flex-1 md:flex-none shadow-sm shadow-blue-200">
                                <Save className="h-4 w-4" /> Simpan Data
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PdrbFormPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PdrbFormContent />
        </Suspense>
    );
}
