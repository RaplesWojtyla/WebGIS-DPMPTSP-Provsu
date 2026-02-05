"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { ArrowLeft} from "lucide-react";
import { SECTORS, REGIONS, STORAGE_KEY_PREFIX, PdrbValue } from "@/app/(protected)/(operator)/operator/pdrb/constants";

function PdrbDetailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const regionId = searchParams.get("regionId");
    const year = searchParams.get("year");

    const [dataValues, setDataValues] = useState<number[]>(new Array(SECTORS.length).fill(0));
    const [isLoading, setIsLoading] = useState(true);

    const region = REGIONS.find(r => r.id === regionId);

    // Initial DB (Mock) - Same as in admin/dashboard/pdrb/page.tsx
    // In a real app this would be in a consistent shared state or DB
    const INITIAL_DB: Record<string, PdrbValue[]> = {
        "2023-1275": SECTORS.map((_, idx) => ({ sectorIndex: idx, value: Math.random() * 1000000 }))
    };

    useEffect(() => {
        if (!regionId || !year) {
            toast.error("Data wilayah atau tahun tidak valid");
            router.push("/admin/dashboard/pdrb");
            return;
        }

        // Try to load from localStorage first (persistence)
        // If not found, fall back to INITIAL_DB for demo purposes if it matches
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
                setDataValues(values);
            } catch (e) {
                console.error("Failed to parse stored data", e);
            }
        } else {
            // Fallback to mock data if exists
            // Using the same key format as INITIAL_DB
            // We need to check if we can access the parent state logic, but here we just simulate read
            // For the purpose of this demo, we might not see the random data from the parent page unless it was saved.
            // But since the parent page creates random data on the fly if not persisted, 
            // we strictly rely on localStorage for "shared" state in this demo context, 
            // OR we default to 0.
            // Wait, the parent page has INITIAL_DB. We should probably replicate that logic or just show 0 if not saved.
            // Given the user instructions "kek yg di operator", likely they want to see what was input.

            // Check INITIAL_DB for demo consistency with default page load
            const mockKey = `${year}-${regionId}`;
            const mockData = INITIAL_DB[mockKey];
            if (mockData) {
                const values = new Array(SECTORS.length).fill(0);
                mockData.forEach(item => {
                    if (item.sectorIndex >= 0 && item.sectorIndex < SECTORS.length) {
                        values[item.sectorIndex] = item.value;
                    }
                });
                setDataValues(values);
            }
        }
        setIsLoading(false);
    }, [regionId, year, router]);

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
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-10 w-10">
                        <ArrowLeft className="h-6 w-6 text-gray-600" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                            Detail Data PDRB
                        </h1>
                        <p className="text-gray-500 mt-1 flex items-center gap-2">
                            <span className="font-medium text-gray-900">{region.name}</span>
                            <span className="text-gray-300">•</span>
                            <span>Tahun {year}</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{region.type}</span>
                        </p>
                    </div>
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
                                        <div className="text-right font-mono font-medium text-gray-900 pr-4">
                                            {formatCurrency(dataValues[index] || 0)}
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
                                {formatCurrency(dataValues.reduce((a, b) => a + b, 0))}
                            </span>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <Button variant="outline" size="lg" onClick={() => router.back()} className="flex-1 md:flex-none">
                                Kembali
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PdrbDetailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PdrbDetailContent />
        </Suspense>
    );
}
