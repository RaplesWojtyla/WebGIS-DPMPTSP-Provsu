"use client";

import { useState } from "react";
import { FiClock, FiActivity, FiSave, FiTrendingUp, FiGrid, FiFastForward } from "react-icons/fi";
import Decimal from "decimal.js";
import { SECTORS, REGIONS } from "../pdrb/constants";

// Types
interface PendingInvestment {
    id: string;
    companyName: string;
    sector: string;
    subSector: string;
    location: string;
    district: string;
    date: string;
}

interface AnalysisResultLQ {
    lq: string;
    status: "Basis" | "Non-Basis";
    description: string;
}

interface AnalysisResultSSA {
    nij: string; // National Growth Effect
    mij: string; // Industry Mix Effect
    cij: string; // Competitive Effect
    dij: string; // Total Shift
}

interface AnalysisResultKlassen {
    quadrant: "Prima" | "Berkembang" | "Potensial" | "Terbelakang";
    growthRate: string; // r
    share: string; // y
}

interface AnalysisResultDLQ {
    dlq: string;
    status: "Potensial" | "Belum Potensial";
    description: string;
}

// Dummy Data
const pendingInvestments: PendingInvestment[] = [
    {
        id: "PEND-001",
        companyName: "PT. Sawit Makmur",
        sector: "Pertanian, Kehutanan dan Perikanan/Agriculture, Forestry, and Fishing",
        subSector: "Perkebunan",
        location: "KAB. ASAHAN",
        district: "Kisaran",
        date: "2024-01-20",
    },
    {
        id: "PEND-002",
        companyName: "CV. Nelayan Sejahtera",
        sector: "Pertanian, Kehutanan dan Perikanan/Agriculture, Forestry, and Fishing",
        subSector: "Tangkap",
        location: "KOTA SIBOLGA",
        district: "Sibolga Kota",
        date: "2024-01-22",
    },
    {
        id: "PEND-003",
        companyName: "UD. Tenun Toba",
        sector: "Industri Pengolahan/ Manufacturing",
        subSector: "Tekstil",
        location: "KAB. SAMOSIR",
        district: "Pangururan",
        date: "2024-01-25",
    },
    {
        id: "PEND-004",
        companyName: "PT. Toba Pulp Lestari",
        sector: "Industri Pengolahan/ Manufacturing",
        subSector: "Kertas",
        location: "KAB. TOBA SAMOSIR",
        district: "Porsea",
        date: "2024-02-01",
    },
    {
        id: "PEND-005",
        companyName: "CV. Berastagi Buah",
        sector: "Perdagangan Besar dan Eceran; Reparasi Mobil dan Sepeda Motor/Wholesale and RetailTrade; Repair of Motor Vehicles and Motorcycles",
        subSector: "Hortikultura",
        location: "KAB. KARO",
        district: "Berastagi",
        date: "2024-02-03",
    },
    {
        id: "PEND-006",
        companyName: "PT. Agincourt Resources",
        sector: "Pertambangan dan Penggalian/Mining and Quarrying",
        subSector: "Emas",
        location: "KAB. TAPANULI SELATAN",
        district: "Batang Toru",
        date: "2024-02-05",
    },
    {
        id: "PEND-007",
        companyName: "Grand City Hall Hotel",
        sector: "Penyediaan Akomodasi dan Makan Minum/ Accommodation and Food Service Activities",
        subSector: "Hotel",
        location: "KOTA MEDAN",
        district: "Medan Barat",
        date: "2024-02-08",
    },
    {
        id: "PEND-008",
        companyName: "PT. Kawasan Industri Medan",
        sector: "Jasa Perusahaan/Business Activities",
        subSector: "Kawasan Industri",
        location: "KAB. DELI SERDANG",
        district: "Percut Sei Tuan",
        date: "2024-02-10",
    },
    {
        id: "PEND-009",
        companyName: "RS. Columbia Asia",
        sector: "Jasa Kesehatan dan Kegiatan Sosial/Human Health and Social Work Activities",
        subSector: "Rumah Sakit",
        location: "KOTA MEDAN",
        district: "Medan Johor",
        date: "2024-02-12",
    },
    {
        id: "PEND-010",
        companyName: "Univ. Sumatera Utara",
        sector: "Jasa Pendidikan/Education",
        subSector: "Perguruan Tinggi",
        location: "KOTA MEDAN",
        district: "Medan Baru",
        date: "2024-02-15",
    }
];

export default function OperatorDashboard() {
    const [activeTab, setActiveTab] = useState<"pending" | "lq" | "ssa" | "klassen" | "dlq">("pending");

    // LQ Form State
    const [formDataLQ, setFormDataLQ] = useState({
        regency: REGIONS[0].name,
        district: "",
        sector: SECTORS[0],
        subSector: "",
        year: new Date().getFullYear().toString(),
        pdrbSector: "",
        totalPdrb: "",
        pdbSector: "",
        totalPdb: "",
    });

    // SSA Form State
    const [formDataSSA, setFormDataSSA] = useState({
        regency: REGIONS[0].name,
        sector: SECTORS[0],
        startYear: (new Date().getFullYear() - 1).toString(),
        endYear: new Date().getFullYear().toString(),
        regionSectorStart: "",
        regionSectorEnd: "",
        provSectorStart: "",
        provSectorEnd: "",
        provTotalStart: "",
        provTotalEnd: "",
    });

    // Klassen Form State
    const [formDataKlassen, setFormDataKlassen] = useState({
        regency: REGIONS[0].name,
        sector: SECTORS[0],
        startYear: (new Date().getFullYear() - 1).toString(),
        endYear: new Date().getFullYear().toString(),
        regionSectorStart: "",
        regionSectorEnd: "",
        refSectorStart: "",
        refSectorEnd: "",
        refAvgSectorValue: "",
    });

    // DLQ Form State
    const [formDataDLQ, setFormDataDLQ] = useState({
        regency: REGIONS[0].name,
        sector: SECTORS[0],
        startYear: (new Date().getFullYear() - 1).toString(),
        endYear: new Date().getFullYear().toString(),
        regionSectorStart: "",
        regionSectorEnd: "",
        regionTotalStart: "",
        regionTotalEnd: "",
        provSectorStart: "",
        provSectorEnd: "",
        provTotalStart: "",
        provTotalEnd: "",
    });


    const [resultLQ, setResultLQ] = useState<AnalysisResultLQ | null>(null);
    const [resultSSA, setResultSSA] = useState<AnalysisResultSSA | null>(null);
    const [resultKlassen, setResultKlassen] = useState<AnalysisResultKlassen | null>(null);
    const [resultDLQ, setResultDLQ] = useState<AnalysisResultDLQ | null>(null);

    // Helpers
    // Helper: Safely parse to Decimal, defaulting to 0 if invalid
    const toDecimal = (val: string) => {
        try {
            // Support Indonesian format: 1.000.000,50 -> 1000000.50
            // Remove dots (thousands separators)
            let normalized = val.replace(/\./g, "");
            // Replace comma with dot (decimal separator)
            normalized = normalized.replace(/,/g, ".");

            const cleaned = normalized.replace(/[^0-9.-]/g, "");
            if (!cleaned || cleaned === "." || cleaned === "-") return new Decimal(0);
            return new Decimal(cleaned);
        } catch {
            return new Decimal(0);
        }
    };

    const formatNumberInput = (val: string) => val.replace(/[^0-9.,-]/g, "");
    const formatDisplay = (val: string) => new Intl.NumberFormat("id-ID").format(parseFloat(val));

    // Handlers
    const handleInputLQ = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (["pdrbSector", "totalPdrb", "pdbSector", "totalPdb"].includes(name)) {
            setFormDataLQ(prev => ({ ...prev, [name]: formatNumberInput(value) }));
        } else {
            setFormDataLQ(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleInputSSA = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (["regionSectorStart", "regionSectorEnd", "provSectorStart", "provSectorEnd", "provTotalStart", "provTotalEnd"].includes(name)) {
            setFormDataSSA(prev => ({ ...prev, [name]: formatNumberInput(value) }));
        } else {
            setFormDataSSA(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleInputKlassen = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (["regionSectorStart", "regionSectorEnd", "refSectorStart", "refSectorEnd", "refAvgSectorValue"].includes(name)) {
            setFormDataKlassen(prev => ({ ...prev, [name]: formatNumberInput(value) }));
        } else {
            setFormDataKlassen(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleInputDLQ = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (["regionSectorStart", "regionSectorEnd", "regionTotalStart", "regionTotalEnd", "provSectorStart", "provSectorEnd", "provTotalStart", "provTotalEnd"].includes(name)) {
            setFormDataDLQ(prev => ({ ...prev, [name]: formatNumberInput(value) }));
        } else {
            setFormDataDLQ(prev => ({ ...prev, [name]: value }));
        }
    };


    const calculateLQ = () => {
        const vi = toDecimal(formDataLQ.pdrbSector); // PDRB Sektor Kab
        const vt = toDecimal(formDataLQ.totalPdrb);  // Total PDRB Kab
        const Vi = toDecimal(formDataLQ.pdbSector);  // PDRB Sektor Prov
        const Vt = toDecimal(formDataLQ.totalPdb);   // Total PDRB Prov

        if (vt.isZero() || Vi.isZero() || Vt.isZero()) { alert("Nilai pembagi tidak boleh 0!"); return; }

        // Region Share = vi / vt
        // Prov Share = Vi / Vt
        // LQ = (Region Share) / (Prov Share)

        const regionShare = vi.dividedBy(vt);
        const provShare = Vi.dividedBy(Vt);
        const lq = regionShare.dividedBy(provShare);

        setResultLQ({
            lq: lq.toFixed(4),
            status: lq.greaterThan(1) ? "Basis" : "Non-Basis",
            description: lq.greaterThan(1)
                ? "Sektor ini memiliki keunggulan komparatif dan berpotensi untuk dikembangkan sebagai sektor unggulan."
                : "Sektor ini belum memiliki keunggulan komparatif dan produksinya belum mencukupi kebutuhan wilayah.",
        });
    };

    const calculateSSA = () => {
        const Eij_t0 = toDecimal(formDataSSA.regionSectorStart);
        const Ei_t0 = toDecimal(formDataSSA.provSectorStart);
        const Ei_t1 = toDecimal(formDataSSA.provSectorEnd);
        const Et_t0 = toDecimal(formDataSSA.provTotalStart);
        const Et_t1 = toDecimal(formDataSSA.provTotalEnd);

        if (Et_t0.isZero() || Ei_t0.isZero()) { alert("Nilai awal tidak boleh 0!"); return; }

        // Rn (National Growth Rate) = (Et_t1 - Et_t0) / Et_t0
        const Rn = Et_t1.minus(Et_t0).dividedBy(Et_t0);

        // Ri (Industrial Mix Growth Rate) = (Ei_t1 - Ei_t0) / Ei_t0
        const Ri = Ei_t1.minus(Ei_t0).dividedBy(Ei_t0);

        // Nij (National Share) = Eij_t0 * Rn
        // Mij (Proportional Shift) = Eij_t0 * (Ri - Rn)
        const nij = Eij_t0.times(Rn);
        const mij = Eij_t0.times(Ri.minus(Rn));

        // Cij (Differential Shift)
        // Formula: Cij = Eij_t1 - (Eij_t0 * (1 + Ri))
        // Or sometimes: Cij = Eij_t0 * (rij - Ri) where rij is regional sector growth
        const Eij_t1 = toDecimal(formDataSSA.regionSectorEnd);
        const cij = Eij_t1.minus(Eij_t0.times(new Decimal(1).plus(Ri)));

        // Dij (Total Shift) = Nij + Mij + Cij
        const dij = nij.plus(mij).plus(cij);

        setResultSSA({
            nij: nij.toFixed(2),
            mij: mij.toFixed(2),
            cij: cij.toFixed(2),
            dij: dij.toFixed(2),
        });
    };

    const calculateKlassen = () => {
        const r_start = toDecimal(formDataKlassen.regionSectorStart);
        const r_end = toDecimal(formDataKlassen.regionSectorEnd);
        const R_start = toDecimal(formDataKlassen.refSectorStart);
        const R_end = toDecimal(formDataKlassen.refSectorEnd);
        const Y = toDecimal(formDataKlassen.refAvgSectorValue);

        if (r_start.isZero() || R_start.isZero()) { alert("Nilai awal tidak boleh 0!"); return; }

        // r (Laju pertumbuhan sektor di wilayah) = (End - Start) / Start
        const r = r_end.minus(r_start).dividedBy(r_start);

        // R (Laju pertumbuhan sektor di provinsi/ref) = (End - Start) / Start
        const R = R_end.minus(R_start).dividedBy(R_start);

        // y (Nilai/Kontribusi sektor wilayah saat ini)
        const y = r_end;

        // Quadrant Logic
        // I: r > R && y > Y (Prima)
        // II: r > R && y <= Y (Berkembang)
        // III: r <= R && y > Y (Potensial)
        // IV: r <= R && y <= Y (Terbelakang)

        let quadrant: AnalysisResultKlassen["quadrant"] = "Terbelakang";

        if (r.greaterThan(R) && y.greaterThan(Y)) quadrant = "Prima";
        else if (r.greaterThan(R) && y.lessThanOrEqualTo(Y)) quadrant = "Berkembang";
        else if (r.lessThanOrEqualTo(R) && y.greaterThan(Y)) quadrant = "Potensial";
        else quadrant = "Terbelakang";

        setResultKlassen({
            quadrant,
            growthRate: r.times(100).toFixed(2) + "%", // Show as percentage
            share: y.toFixed(2),
        });
    };

    const calculateDLQ = () => {
        // DLQ Formula (Matsuura / SLQ version often used)
        // DLQ = [ (1 + g_ik) / (1 + g_k) ] / [ (1 + g_ip) / (1 + g_p) ]

        const regSecStart = toDecimal(formDataDLQ.regionSectorStart);
        const regSecEnd = toDecimal(formDataDLQ.regionSectorEnd);
        const regTotStart = toDecimal(formDataDLQ.regionTotalStart);
        const regTotEnd = toDecimal(formDataDLQ.regionTotalEnd);

        const provSecStart = toDecimal(formDataDLQ.provSectorStart);
        const provSecEnd = toDecimal(formDataDLQ.provSectorEnd);
        const provTotStart = toDecimal(formDataDLQ.provTotalStart);
        const provTotEnd = toDecimal(formDataDLQ.provTotalEnd);

        if (regSecStart.isZero() || regTotStart.isZero() || provSecStart.isZero() || provTotStart.isZero()) {
            alert("Nilai awal tidak boleh 0!"); return;
        }

        // Growth Rates
        const g_ik = regSecEnd.minus(regSecStart).dividedBy(regSecStart);
        const g_k = regTotEnd.minus(regTotStart).dividedBy(regTotStart);
        const g_ip = provSecEnd.minus(provSecStart).dividedBy(provSecStart);
        const g_p = provTotEnd.minus(provTotStart).dividedBy(provTotStart);

        // Numerator = (1 + g_ik) / (1 + g_k)
        const num = new Decimal(1).plus(g_ik).dividedBy(new Decimal(1).plus(g_k));

        // Denominator = (1 + g_ip) / (1 + g_p)
        const den = new Decimal(1).plus(g_ip).dividedBy(new Decimal(1).plus(g_p));

        if (den.isZero()) return;

        const dlq = num.dividedBy(den);

        setResultDLQ({
            dlq: dlq.toFixed(4),
            status: dlq.greaterThan(1) ? "Potensial" : "Belum Potensial",
            description: dlq.greaterThan(1)
                ? "Sektor ini memiliki potensi untuk reposisi menjadi basis di masa depan."
                : "Sektor ini belum menunjukkan potensi pertumbuhan relatif yang signifikan."
        });
    };

    const handleSave = (type: string) => {
        alert(`Data analisis ${type.toUpperCase()} berhasil disimpan!`);
    };

    return (
        <div className="p-6 bg-slate-50 min-h-screen font-sans text-slate-900">
            <div className="max-w-7xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Dashboard Operator</h1>
                    <p className="text-slate-500 mt-1">Kelola data investasi dan lakukan analisis ekonomi.</p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 bg-white p-1 rounded-xl shadow-sm border border-slate-100 w-fit">
                    <button onClick={() => setActiveTab("pending")} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "pending" ? "bg-blue-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-50"}`}><FiClock /> Menunggu</button>
                    <button onClick={() => setActiveTab("lq")} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "lq" ? "bg-blue-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-50"}`}><FiActivity /> Analisis LQ</button>
                    <button onClick={() => setActiveTab("ssa")} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "ssa" ? "bg-blue-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-50"}`}><FiTrendingUp /> Analisis SSA</button>
                    <button onClick={() => setActiveTab("dlq")} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "dlq" ? "bg-blue-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-50"}`}><FiFastForward /> Analisis Tipologi Sektor (DLQ)</button>
                    <button onClick={() => setActiveTab("klassen")} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "klassen" ? "bg-blue-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-50"}`}><FiGrid /> Analisis Klassen</button>
                </div>

                {/* Content */}
                {activeTab === "pending" && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100"><h2 className="text-lg font-bold text-slate-800">Menunggu Persetujuan & Input</h2></div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="p-5 font-semibold text-slate-600 text-sm">ID</th>
                                        <th className="p-5 font-semibold text-slate-600 text-sm">Perusahaan</th>
                                        <th className="p-5 font-semibold text-slate-600 text-sm">Lokasi</th>
                                        <th className="p-5 font-semibold text-slate-600 text-sm">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingInvestments.map((item) => (
                                        <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                            <td className="p-5 text-slate-500 font-mono text-xs">{item.id}</td>
                                            <td className="p-5 font-medium text-slate-900">{item.companyName}</td>
                                            <td className="p-5 text-slate-600">{item.location}</td>
                                            <td className="p-5">
                                                <button onClick={() => {
                                                    setActiveTab("lq");
                                                    setFormDataLQ(prev => ({ ...prev, sector: item.sector, regency: item.location }));
                                                }} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100">
                                                    Proses
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === "lq" && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">Analisis Location Quotient (LQ)</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Kabupaten/Kota</label>
                                <select name="regency" value={formDataLQ.regency} onChange={handleInputLQ} className="w-full mt-1 p-2 border rounded-lg bg-white">
                                    {REGIONS.map(r => (
                                        <option key={r.id} value={r.name}>{r.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm font-semibold text-slate-700">Sektor</label>
                                <select name="sector" value={formDataLQ.sector} onChange={handleInputLQ} className="w-full mt-1 p-2 border rounded-lg bg-white overflow-hidden text-ellipsis">
                                    {SECTORS.map(s => (
                                        <option key={s} value={s}>{s.split('/')[0]}</option>
                                    ))}
                                </select>
                            </div>
                            <div><label className="text-sm font-semibold text-slate-700">PDRB Sektor</label><input name="pdrbSector" value={formDataLQ.pdrbSector} onChange={handleInputLQ} className="w-full mt-1 p-2 border rounded-lg" placeholder="0" /></div>
                            <div><label className="text-sm font-semibold text-slate-700">Total PDRB</label><input name="totalPdrb" value={formDataLQ.totalPdrb} onChange={handleInputLQ} className="w-full mt-1 p-2 border rounded-lg" placeholder="0" /></div>
                            <div><label className="text-sm font-semibold text-slate-700">PDB Sektor (Ref)</label><input name="pdbSector" value={formDataLQ.pdbSector} onChange={handleInputLQ} className="w-full mt-1 p-2 border rounded-lg" placeholder="0" /></div>
                            <div><label className="text-sm font-semibold text-slate-700">Total PDB (Ref)</label><input name="totalPdb" value={formDataLQ.totalPdb} onChange={handleInputLQ} className="w-full mt-1 p-2 border rounded-lg" placeholder="0" /></div>
                        </div>
                        <button onClick={calculateLQ} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">Hitung LQ</button>

                        {resultLQ && (
                            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                                <p className="text-lg font-bold text-blue-900">Nilai LQ: {resultLQ.lq} <span className={`ml-2 text-sm px-2 py-0.5 rounded ${resultLQ.status === 'Basis' ? 'bg-green-200 text-green-800' : 'bg-amber-200 text-amber-800'}`}>{resultLQ.status}</span></p>
                                <p className="text-slate-600 mt-2">{resultLQ.description}</p>
                                <button onClick={() => handleSave('lq')} className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-700 hover:underline"><FiSave /> Simpan</button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "ssa" && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">Analisis Shift Share (SSA)</h2>
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div><label className="text-sm font-semibold text-slate-700">Nilai Sek Wil (Awal)</label><input name="regionSectorStart" value={formDataSSA.regionSectorStart} onChange={handleInputSSA} className="w-full mt-1 p-2 border rounded-lg" placeholder="Eij t0" /></div>
                            <div><label className="text-sm font-semibold text-slate-700">Nilai Sek Wil (Akhir)</label><input name="regionSectorEnd" value={formDataSSA.regionSectorEnd} onChange={handleInputSSA} className="w-full mt-1 p-2 border rounded-lg" placeholder="Eij t1" /></div>
                            <div><label className="text-sm font-semibold text-slate-700">Nilai Sek Prov (Awal)</label><input name="provSectorStart" value={formDataSSA.provSectorStart} onChange={handleInputSSA} className="w-full mt-1 p-2 border rounded-lg" placeholder="Ei t0" /></div>
                            <div><label className="text-sm font-semibold text-slate-700">Nilai Sek Prov (Akhir)</label><input name="provSectorEnd" value={formDataSSA.provSectorEnd} onChange={handleInputSSA} className="w-full mt-1 p-2 border rounded-lg" placeholder="Ei t1" /></div>
                            <div><label className="text-sm font-semibold text-slate-700">Total Prov (Awal)</label><input name="provTotalStart" value={formDataSSA.provTotalStart} onChange={handleInputSSA} className="w-full mt-1 p-2 border rounded-lg" placeholder="Et t0" /></div>
                            <div><label className="text-sm font-semibold text-slate-700">Total Prov (Akhir)</label><input name="provTotalEnd" value={formDataSSA.provTotalEnd} onChange={handleInputSSA} className="w-full mt-1 p-2 border rounded-lg" placeholder="Et t1" /></div>
                        </div>
                        <button onClick={calculateSSA} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">Hitung SSA</button>

                        {resultSSA && (
                            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div><p className="text-xs text-slate-500 uppercase">National Share (Nij)</p><p className="font-bold text-slate-900">{formatDisplay(resultSSA.nij)}</p></div>
                                <div><p className="text-xs text-slate-500 uppercase">Proportional Shift (Mij)</p><p className="font-bold text-slate-900">{formatDisplay(resultSSA.mij)}</p></div>
                                <div><p className="text-xs text-slate-500 uppercase">Differential Shift (Cij)</p><p className={`font-bold ${parseFloat(resultSSA.cij) >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatDisplay(resultSSA.cij)}</p></div>
                                <div className="col-span-full"><button onClick={() => handleSave('ssa')} className="flex items-center gap-2 text-sm font-medium text-blue-700 hover:underline"><FiSave /> Simpan</button></div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "klassen" && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">Klassen Typology</h2>
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div><label className="text-sm font-semibold text-slate-700">Nilai Sektor Wilayah (Awal)</label><input name="regionSectorStart" value={formDataKlassen.regionSectorStart} onChange={handleInputKlassen} className="w-full mt-1 p-2 border rounded-lg" /></div>
                            <div><label className="text-sm font-semibold text-slate-700">Nilai Sektor Wilayah (Akhir)</label><input name="regionSectorEnd" value={formDataKlassen.regionSectorEnd} onChange={handleInputKlassen} className="w-full mt-1 p-2 border rounded-lg" /></div>
                            <div><label className="text-sm font-semibold text-slate-700">Nilai Sektor Referensi (Awal)</label><input name="refSectorStart" value={formDataKlassen.refSectorStart} onChange={handleInputKlassen} className="w-full mt-1 p-2 border rounded-lg" /></div>
                            <div><label className="text-sm font-semibold text-slate-700">Nilai Sektor Referensi (Akhir)</label><input name="refSectorEnd" value={formDataKlassen.refSectorEnd} onChange={handleInputKlassen} className="w-full mt-1 p-2 border rounded-lg" /></div>
                            <div className="col-span-2"><label className="text-sm font-semibold text-slate-700">Rata-rata Nilai Sektor (Referensi)</label><input name="refAvgSectorValue" value={formDataKlassen.refAvgSectorValue} onChange={handleInputKlassen} className="w-full mt-1 p-2 border rounded-lg" placeholder="Untuk sumbu Y (Share/Kontribusi)" /></div>
                        </div>
                        <button onClick={calculateKlassen} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">Hitung Klassen</button>

                        {resultKlassen && (
                            <div className="mt-6 p-4 bg-purple-50 border border-purple-100 rounded-xl">
                                <p className="text-lg font-bold text-purple-900">Kuadran: {resultKlassen.quadrant}</p>
                                <div className="mt-2 text-sm text-purple-800">
                                    <p>Growth Rate (r): {resultKlassen.growthRate}</p>
                                    <p>Share (y): {formatDisplay(resultKlassen.share)}</p>
                                </div>
                                <button onClick={() => handleSave('klassen')} className="mt-4 flex items-center gap-2 text-sm font-medium text-purple-700 hover:underline"><FiSave /> Simpan</button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "dlq" && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">Dynamic Location Quotient (DLQ)</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                            <div><label className="text-sm font-semibold text-slate-700">Tahun Awal</label><input name="startYear" value={formDataDLQ.startYear} readOnly className="w-full mt-1 p-2 border rounded-lg bg-slate-50" /></div>
                            <div><label className="text-sm font-semibold text-slate-700">Tahun Akhir</label><input name="endYear" value={formDataDLQ.endYear} readOnly className="w-full mt-1 p-2 border rounded-lg bg-slate-50" /></div>

                            <div className="md:col-span-2"></div>

                            <div><label className="text-sm font-semibold text-slate-700">Sektor Wilayah (Awal)</label><input name="regionSectorStart" value={formDataDLQ.regionSectorStart} onChange={handleInputDLQ} className="w-full mt-1 p-2 border rounded-lg" /></div>
                            <div><label className="text-sm font-semibold text-slate-700">Sektor Wilayah (Akhir)</label><input name="regionSectorEnd" value={formDataDLQ.regionSectorEnd} onChange={handleInputDLQ} className="w-full mt-1 p-2 border rounded-lg" /></div>
                            <div><label className="text-sm font-semibold text-slate-700">Total PDRB Wilayah (Awal)</label><input name="regionTotalStart" value={formDataDLQ.regionTotalStart} onChange={handleInputDLQ} className="w-full mt-1 p-2 border rounded-lg" /></div>
                            <div><label className="text-sm font-semibold text-slate-700">Total PDRB Wilayah (Akhir)</label><input name="regionTotalEnd" value={formDataDLQ.regionTotalEnd} onChange={handleInputDLQ} className="w-full mt-1 p-2 border rounded-lg" /></div>

                            <div><label className="text-sm font-semibold text-slate-700">Sektor Provinsi (Awal)</label><input name="provSectorStart" value={formDataDLQ.provSectorStart} onChange={handleInputDLQ} className="w-full mt-1 p-2 border rounded-lg" /></div>
                            <div><label className="text-sm font-semibold text-slate-700">Sektor Provinsi (Akhir)</label><input name="provSectorEnd" value={formDataDLQ.provSectorEnd} onChange={handleInputDLQ} className="w-full mt-1 p-2 border rounded-lg" /></div>
                            <div><label className="text-sm font-semibold text-slate-700">Total PDRB Prov (Awal)</label><input name="provTotalStart" value={formDataDLQ.provTotalStart} onChange={handleInputDLQ} className="w-full mt-1 p-2 border rounded-lg" /></div>
                            <div><label className="text-sm font-semibold text-slate-700">Total PDRB Prov (Akhir)</label><input name="provTotalEnd" value={formDataDLQ.provTotalEnd} onChange={handleInputDLQ} className="w-full mt-1 p-2 border rounded-lg" /></div>
                        </div>
                        <button onClick={calculateDLQ} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">Hitung DLQ</button>

                        {resultDLQ && (
                            <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                                <p className="text-lg font-bold text-indigo-900">Nilai DLQ: {resultDLQ.dlq} <span className={`ml-2 text-sm px-2 py-0.5 rounded ${resultDLQ.status === 'Potensial' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>{resultDLQ.status}</span></p>
                                <p className="text-slate-600 mt-2">{resultDLQ.description}</p>
                                <button onClick={() => handleSave('dlq')} className="mt-4 flex items-center gap-2 text-sm font-medium text-indigo-700 hover:underline"><FiSave /> Simpan</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
