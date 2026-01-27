"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiActivity, FiTrendingUp, FiGrid, FiFastForward, FiLock, FiSave } from "react-icons/fi";

// Reusing Types from Operator for consistency
interface AnalysisResultLQ {
    lq: number;
    status: "Basis" | "Non-Basis";
    description: string;
}

interface AnalysisResultSSA {
    nij: number;
    mij: number;
    cij: number;
    dij: number;
}

interface AnalysisResultKlassen {
    quadrant: "Prima" | "Berkembang" | "Potensial" | "Terbelakang";
    growthRate: number;
    share: number;
}

interface AnalysisResultDLQ {
    dlq: number;
    status: "Potensial" | "Belum Potensial";
    description: string;
}

export default function UserSimulationPage() {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [simulationTab, setSimulationTab] = useState<"lq" | "ssa" | "klassen" | "dlq">("lq");

    // --- STATE MANAGEMENT (Matches Operator Dashboard Structure) ---

    // LQ State
    const [formDataLQ, setFormDataLQ] = useState({
        regency: "Medan",
        district: "",
        sector: "Pertanian",
        subSector: "",
        year: new Date().getFullYear().toString(),
        pdrbSector: "",
        totalPdrb: "",
        pdbSector: "",
        totalPdb: "",
    });
    const [resultLQ, setResultLQ] = useState<AnalysisResultLQ | null>(null);

    // SSA State
    const [formDataSSA, setFormDataSSA] = useState({
        regency: "Medan",
        sector: "Pertanian",
        startYear: (new Date().getFullYear() - 1).toString(),
        endYear: new Date().getFullYear().toString(),
        regionSectorStart: "",
        regionSectorEnd: "",
        provSectorStart: "",
        provSectorEnd: "",
        provTotalStart: "",
        provTotalEnd: "",
    });
    const [resultSSA, setResultSSA] = useState<AnalysisResultSSA | null>(null);

    // Klassen State
    const [formDataKlassen, setFormDataKlassen] = useState({
        regency: "Medan",
        sector: "Pertanian",
        startYear: (new Date().getFullYear() - 1).toString(),
        endYear: new Date().getFullYear().toString(),
        regionSectorStart: "",
        regionSectorEnd: "",
        refSectorStart: "",
        refSectorEnd: "",
        refAvgSectorValue: "",
    });
    const [resultKlassen, setResultKlassen] = useState<AnalysisResultKlassen | null>(null);

    // DLQ State
    const [formDataDLQ, setFormDataDLQ] = useState({
        regency: "Medan",
        sector: "Pertanian",
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
    const [resultDLQ, setResultDLQ] = useState<AnalysisResultDLQ | null>(null);

    // --- HELPERS ---
    const cleanNumber = (val: string) => parseFloat(val.replace(/[^0-9.]/g, ""));
    const formatNumberInput = (val: string) => val.replace(/[^0-9]/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");


    // --- HANDLERS (Matches Operator Logic) ---

    // Auth Check
    useEffect(() => {
        const saved = localStorage.getItem("userProfile");
        if (!saved || !JSON.parse(saved).isComplete) {
            alert("You must complete your profile first!");
            router.push("/dashboard/user/profile");
        } else {
            setIsAuthorized(true);
        }
    }, [router]);

    // Input Handlers
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


    // Calculation Logic (Identical to Operator)
    const calculateLQ = () => {
        const vi = cleanNumber(formDataLQ.pdrbSector);
        const vt = cleanNumber(formDataLQ.totalPdrb);
        const Vi = cleanNumber(formDataLQ.pdbSector);
        const Vt = cleanNumber(formDataLQ.totalPdb);

        if (vt === 0 || Vi === 0 || Vt === 0) { alert("Nilai pembagi tidak boleh 0!"); return; }

        const lq = (vi / vt) / (Vi / Vt);
        setResultLQ({
            lq: parseFloat(lq.toFixed(4)),
            status: lq > 1 ? "Basis" : "Non-Basis",
            description: lq > 1
                ? "Sektor ini memiliki keunggulan komparatif dan berpotensi untuk dikembangkan sebagai sektor unggulan."
                : "Sektor ini belum memiliki keunggulan komparatif dan produksinya belum mencukupi kebutuhan wilayah.",
        });
    };

    const calculateSSA = () => {
        const Eij_t0 = cleanNumber(formDataSSA.regionSectorStart);
        const Ei_t0 = cleanNumber(formDataSSA.provSectorStart);
        const Ei_t1 = cleanNumber(formDataSSA.provSectorEnd);
        const Et_t0 = cleanNumber(formDataSSA.provTotalStart);
        const Et_t1 = cleanNumber(formDataSSA.provTotalEnd);

        if (Et_t0 === 0 || Ei_t0 === 0) { alert("Nilai awal tidak boleh 0!"); return; }

        const Rn = (Et_t1 - Et_t0) / Et_t0;
        const Ri = (Ei_t1 - Ei_t0) / Ei_t0;

        const nij = Eij_t0 * Rn;
        const mij = Eij_t0 * (Ri - Rn);

        const Eij_t1 = cleanNumber(formDataSSA.regionSectorEnd);
        const cij = Eij_t1 - (Eij_t0 * (1 + Ri));
        const dij = nij + mij + cij;

        setResultSSA({
            nij: parseFloat(nij.toFixed(2)),
            mij: parseFloat(mij.toFixed(2)),
            cij: parseFloat(cij.toFixed(2)),
            dij: parseFloat(dij.toFixed(2)),
        });
    };

    const calculateKlassen = () => {
        const r_start = cleanNumber(formDataKlassen.regionSectorStart);
        const r_end = cleanNumber(formDataKlassen.regionSectorEnd);
        const R_start = cleanNumber(formDataKlassen.refSectorStart);
        const R_end = cleanNumber(formDataKlassen.refSectorEnd);
        const Y = cleanNumber(formDataKlassen.refAvgSectorValue);

        if (r_start === 0 || R_start === 0) { alert("Nilai awal tidak boleh 0!"); return; }

        const r = (r_end - r_start) / r_start;
        const R = (R_end - R_start) / R_start;
        const y = r_end;

        let quadrant: AnalysisResultKlassen["quadrant"] = "Terbelakang";

        if (r > R && y > Y) quadrant = "Prima";
        else if (r > R && y <= Y) quadrant = "Berkembang";
        else if (r <= R && y > Y) quadrant = "Potensial";
        else quadrant = "Terbelakang";

        setResultKlassen({
            quadrant,
            growthRate: parseFloat(r.toFixed(4)),
            share: parseFloat(y.toFixed(2)),
        });
    };

    const calculateDLQ = () => {
        const regSecStart = cleanNumber(formDataDLQ.regionSectorStart);
        const regSecEnd = cleanNumber(formDataDLQ.regionSectorEnd);
        const regTotStart = cleanNumber(formDataDLQ.regionTotalStart);
        const regTotEnd = cleanNumber(formDataDLQ.regionTotalEnd);
        const provSecStart = cleanNumber(formDataDLQ.provSectorStart);
        const provSecEnd = cleanNumber(formDataDLQ.provSectorEnd);
        const provTotStart = cleanNumber(formDataDLQ.provTotalStart);
        const provTotEnd = cleanNumber(formDataDLQ.provTotalEnd);

        if (regSecStart === 0 || regTotStart === 0 || provSecStart === 0 || provTotStart === 0) {
            alert("Nilai awal tidak boleh 0!"); return;
        }

        const g_ik = (regSecEnd - regSecStart) / regSecStart;
        const g_k = (regTotEnd - regTotStart) / regTotStart;
        const g_ip = (provSecEnd - provSecStart) / provSecStart;
        const g_p = (provTotEnd - provTotStart) / provTotStart;

        const numerator = (1 + g_ik) / (1 + g_k);
        const denominator = (1 + g_ip) / (1 + g_p);

        if (denominator === 0) return;

        const dlq = numerator / denominator;

        setResultDLQ({
            dlq: parseFloat(dlq.toFixed(4)),
            status: dlq > 1 ? "Potensial" : "Belum Potensial",
            description: dlq > 1
                ? "Sektor ini memiliki potensi untuk reposisi menjadi basis di masa depan."
                : "Sektor ini belum menunjukkan potensi pertumbuhan relatif yang signifikan."
        });
    };

    const handleSave = (type: string) => {
        alert(`Data analisis ${type.toUpperCase()} berhasil disimpan ke profil Anda!`);
        // In a real app, this would verify the profile ID and save to backend
    };



    if (!isAuthorized) return <div className="p-10 text-center"><FiLock className="mx-auto w-10 h-10 text-slate-400 mb-4" /> Checking Access...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Investment Simulation</h1>
                <p className="text-slate-500">Analyze potential using standard economic tools.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 min-h-[600px]">
                {/* Tabs */}
                <div className="flex flex-wrap gap-2 pb-6 border-b mb-6">
                    <button onClick={() => setSimulationTab('lq')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${simulationTab === 'lq' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}><FiActivity /> Analisis LQ</button>
                    <button onClick={() => setSimulationTab('ssa')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${simulationTab === 'ssa' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}><FiTrendingUp /> Analisis SSA</button>
                    <button onClick={() => setSimulationTab('dlq')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${simulationTab === 'dlq' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}><FiFastForward /> Analisis Tipologi Sektor (DLQ)</button>
                    <button onClick={() => setSimulationTab('klassen')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${simulationTab === 'klassen' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}><FiGrid /> Analisis Klassen</button>
                </div>

                {/* Content - Matches Operator Dashboard Layout Exactly */}

                {simulationTab === "lq" && (
                    <div className="animate-in fade-in duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800">Analisis Location Quotient (LQ)</h2>
                            <p className="text-xs text-slate-400">Identifikasi Sektor Basis/Non-Basis</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                            <div><label className="text-sm font-semibold text-slate-700">Kabupaten/Kota</label><select name="regency" value={formDataLQ.regency} onChange={handleInputLQ} className="w-full mt-1 p-2 border rounded-lg bg-white"><option>Medan</option><option>Deli Serdang</option></select></div>
                            <div><label className="text-sm font-semibold text-slate-700">Sektor</label><select name="sector" value={formDataLQ.sector} onChange={handleInputLQ} className="w-full mt-1 p-2 border rounded-lg bg-white"><option>Pertanian</option><option>Perikanan</option></select></div>
                            <div><label className="text-sm font-semibold text-slate-700">PDRB Sektor</label><input name="pdrbSector" value={formDataLQ.pdrbSector} onChange={handleInputLQ} className="w-full mt-1 p-2 border rounded-lg" placeholder="0" /></div>
                            <div><label className="text-sm font-semibold text-slate-700">Total PDRB</label><input name="totalPdrb" value={formDataLQ.totalPdrb} onChange={handleInputLQ} className="w-full mt-1 p-2 border rounded-lg" placeholder="0" /></div>
                            <div><label className="text-sm font-semibold text-slate-700">PDB Sektor (Ref)</label><input name="pdbSector" value={formDataLQ.pdbSector} onChange={handleInputLQ} className="w-full mt-1 p-2 border rounded-lg" placeholder="0" /></div>
                            <div><label className="text-sm font-semibold text-slate-700">Total PDB (Ref)</label><input name="totalPdb" value={formDataLQ.totalPdb} onChange={handleInputLQ} className="w-full mt-1 p-2 border rounded-lg" placeholder="0" /></div>
                        </div>
                        <button onClick={calculateLQ} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">Hitung LQ</button>

                        {resultLQ && (
                            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                                <p className="text-lg font-bold text-blue-900">Nilai LQ: {resultLQ.lq} <span className={`ml-2 text-sm px-2 py-0.5 rounded ${resultLQ.status === 'Basis' ? 'bg-green-200 text-green-800' : 'bg-amber-200 text-amber-800'}`}>{resultLQ.status}</span></p>
                                <p className="text-slate-600 mt-2">{resultLQ.description}</p>
                                <button onClick={() => handleSave('lq')} className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-700 hover:underline"><FiSave /> Simpan Hasil</button>
                            </div>
                        )}
                    </div>
                )}

                {simulationTab === "ssa" && (
                    <div className="animate-in fade-in duration-300">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">Analisis Shift Share (SSA)</h2>
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div><label className="text-sm font-semibold text-slate-700">Nilai Sek Wil (Awal)</label><input name="regionSectorStart" value={formDataSSA.regionSectorStart} onChange={handleInputSSA} className="w-full mt-1 p-2 border rounded-lg" placeholder="Eij t0" /></div>
                            <div><label className="text-sm font-semibold text-slate-700">Nilai Sek Wil (Akhir)</label><input name="regionSectorEnd" value={formDataSSA.regionSectorEnd} onChange={handleInputSSA} className="w-full mt-1 p-2 border rounded-lg" placeholder="Eij t1" /></div>
                            <div><label className="text-sm font-semibold text-slate-700">Nilai Sek Prov (Awal)</label><input name="provSectorStart" value={formDataSSA.provSectorStart} onChange={handleInputSSA} className="w-full mt-1 p-2 border rounded-lg" placeholder="Ei t0" /></div>
                            <div><label className="text-sm font-semibold text-slate-700">Nilai Sek Prov (Akhir)</label><input name="provSectorEnd" value={formDataSSA.provSectorEnd} onChange={handleInputSSA} className="w-full mt-1 p-2 border rounded-lg" placeholder="Ei t1" /></div>
                            <div><label className="text-sm font-semibold text-slate-700">Total Prov (Awal)</label><input name="provTotalStart" value={formDataSSA.provTotalStart} onChange={handleInputSSA} className="w-full mt-1 p-2 border rounded-lg" placeholder="Et t0" /></div>
                            <div><label className="text-sm font-semibold text-slate-700">Total Prov (Akhir)</label><input name="provTotalEnd" value={formDataSSA.provTotalEnd} onChange={handleInputSSA} className="w-full mt-1 p-2 border rounded-lg" placeholder="Et t1" /></div>
                        </div>
                        <button onClick={calculateSSA} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">Hitung SSA</button>

                        {resultSSA && (
                            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div><p className="text-xs text-slate-500 uppercase">National Share (Nij)</p><p className="font-bold text-slate-900">{new Intl.NumberFormat().format(resultSSA.nij)}</p></div>
                                <div><p className="text-xs text-slate-500 uppercase">Proportional Shift (Mij)</p><p className="font-bold text-slate-900">{new Intl.NumberFormat().format(resultSSA.mij)}</p></div>
                                <div><p className="text-xs text-slate-500 uppercase">Differential Shift (Cij)</p><p className={`font-bold ${resultSSA.cij >= 0 ? 'text-green-600' : 'text-red-600'}`}>{new Intl.NumberFormat().format(resultSSA.cij)}</p></div>
                                <div className="col-span-full"><button onClick={() => handleSave('ssa')} className="flex items-center gap-2 text-sm font-medium text-blue-700 hover:underline"><FiSave /> Simpan Hasil</button></div>
                            </div>
                        )}
                    </div>
                )}

                {simulationTab === "klassen" && (
                    <div className="animate-in fade-in duration-300">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">Analisis Klassen Typology</h2>
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div><label className="text-sm font-semibold text-slate-700">Nilai Sektor Wilayah (Awal)</label><input name="regionSectorStart" value={formDataKlassen.regionSectorStart} onChange={handleInputKlassen} className="w-full mt-1 p-2 border rounded-lg" /></div>
                            <div><label className="text-sm font-semibold text-slate-700">Nilai Sektor Wilayah (Akhir)</label><input name="regionSectorEnd" value={formDataKlassen.regionSectorEnd} onChange={handleInputKlassen} className="w-full mt-1 p-2 border rounded-lg" /></div>
                            <div><label className="text-sm font-semibold text-slate-700">Nilai Sektor Referensi (Awal)</label><input name="refSectorStart" value={formDataKlassen.refSectorStart} onChange={handleInputKlassen} className="w-full mt-1 p-2 border rounded-lg" /></div>
                            <div><label className="text-sm font-semibold text-slate-700">Nilai Sektor Referensi (Akhir)</label><input name="refSectorEnd" value={formDataKlassen.refSectorEnd} onChange={handleInputKlassen} className="w-full mt-1 p-2 border rounded-lg" /></div>
                            <div className="col-span-2"><label className="text-sm font-semibold text-slate-700">Rata-rata Nilai Sektor (Referensi)</label><input name="refAvgSectorValue" value={formDataKlassen.refAvgSectorValue} onChange={handleInputKlassen} className="w-full mt-1 p-2 border rounded-lg" placeholder="Untuk sumbu Y (Share/Kontribusi)" /></div>
                        </div>
                        <button onClick={calculateKlassen} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">Hitung Klassen</button>

                        {resultKlassen && (
                            <div className="mt-6 p-4 bg-purple-50 border border-purple-100 rounded-xl">
                                <p className="text-lg font-bold text-purple-900">Kuadran: {resultKlassen.quadrant}</p>
                                <div className="text-4xl mt-2 mb-2">
                                    {resultKlassen.quadrant === "Prima" && "🚀"}
                                    {resultKlassen.quadrant === "Berkembang" && "📈"}
                                    {resultKlassen.quadrant === "Potensial" && "💎"}
                                    {resultKlassen.quadrant === "Terbelakang" && "⚠️"}
                                </div>
                                <button onClick={() => handleSave('klassen')} className="mt-4 flex items-center gap-2 text-sm font-medium text-purple-700 hover:underline"><FiSave /> Simpan Hasil</button>
                            </div>
                        )}
                    </div>
                )}

                {simulationTab === "dlq" && (
                    <div className="animate-in fade-in duration-300">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">Analisis Tipologi Sektor (DLQ)</h2>
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
                        <button onClick={calculateDLQ} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">Hitung DLQ</button>

                        {resultDLQ && (
                            <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                                <p className="text-lg font-bold text-indigo-900">Nilai DLQ: {resultDLQ.dlq} <span className={`ml-2 text-sm px-2 py-0.5 rounded ${resultDLQ.status === 'Potensial' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>{resultDLQ.status}</span></p>
                                <p className="text-slate-600 mt-2">{resultDLQ.description}</p>
                                <button onClick={() => handleSave('dlq')} className="mt-4 flex items-center gap-2 text-sm font-medium text-indigo-700 hover:underline"><FiSave /> Simpan Hasil</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
