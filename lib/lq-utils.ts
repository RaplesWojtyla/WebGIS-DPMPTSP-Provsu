
export interface InvestmentRecord {
    id: string;
    region: string;
    sector: string;
    value: number; // Investment value (e.g., in IDR or USD)
    year: number;
}

export interface LQResult {
    region: string;
    sector: string;
    lq: number;
    isReliable: boolean; // True if LQ > 1
}

/**
 * Calculates Location Quotient (LQ) for the given records.
 * LQ = (vi / vt) / (Vi / Vt)
 * vi = Investment in sector i in region j
 * vt = Total investment in region j
 * Vi = Total investment in sector i (all regions)
 * Vt = Total investment (all sectors, all regions)
 */
export function calculateLQ(records: InvestmentRecord[]): LQResult[] {
    const results: LQResult[] = [];

    // 1. Aggregates
    const regionTotals: Record<string, number> = {};
    const sectorTotals: Record<string, number> = {};
    const regionSectorValues: Record<string, Record<string, number>> = {};
    let totalInvestment = 0;

    records.forEach((record) => {
        // Region Total (vt)
        regionTotals[record.region] = (regionTotals[record.region] || 0) + record.value;

        // Sector Total (Vi)
        sectorTotals[record.sector] = (sectorTotals[record.sector] || 0) + record.value;

        // Grand Total (Vt)
        totalInvestment += record.value;

        // Region-Sector (vi)
        if (!regionSectorValues[record.region]) {
            regionSectorValues[record.region] = {};
        }
        regionSectorValues[record.region][record.sector] =
            (regionSectorValues[record.region][record.sector] || 0) + record.value;
    });

    // 2. Calculate LQ for each existing Region-Sector pair
    for (const region in regionSectorValues) {
        for (const sector in regionSectorValues[region]) {
            const vi = regionSectorValues[region][sector];
            const vt = regionTotals[region];
            const Vi = sectorTotals[sector];
            const Vt = totalInvestment;

            if (vt === 0 || Vi === 0 || Vt === 0) {
                results.push({ region, sector, lq: 0, isReliable: false });
                continue;
            }

            // Formula: (vi / vt) / (Vi / Vt)
            const lq = (vi / vt) / (Vi / Vt);

            results.push({
                region,
                sector,
                lq,
                isReliable: lq > 1,
            });
        }
    }

    return results;
}

export function exportToCSV(records: InvestmentRecord[], filename = 'investment-data.csv') {
    if (!records || !records.length) return;

    const headers = ['Region', 'Sector', 'Value', 'Year'];
    const csvContent = [
        headers.join(','),
        ...records.map(r => `${r.region},${r.sector},${r.value},${r.year}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// --- SHIFT SHARE ANALYSIS (SSA) ---

export interface SSAResult {
    region: string;
    sector: string;
    nij: number; // National Growth Effect
    mij: number; // Industry Mix Effect
    cij: number; // Competitive Effect
    dij: number; // Total Shift
}

export function calculateSSA(records: InvestmentRecord[], startYear: number, endYear: number): SSAResult[] {
    const startRecords = records.filter(r => r.year === startYear);
    const endRecords = records.filter(r => r.year === endYear);

    // Helper to get value
    const getValue = (recs: InvestmentRecord[], region: string, sector: string) =>
        recs.find(r => r.region === region && r.sector === sector)?.value || 0;

    // Calculate Totals for Start Year
    let totalStart = 0;
    const sectorTotalStart: Record<string, number> = {};
    startRecords.forEach(r => {
        totalStart += r.value;
        sectorTotalStart[r.sector] = (sectorTotalStart[r.sector] || 0) + r.value;
    });

    // Calculate Totals for End Year
    let totalEnd = 0;
    const sectorTotalEnd: Record<string, number> = {};
    endRecords.forEach(r => {
        totalEnd += r.value;
        sectorTotalEnd[r.sector] = (sectorTotalEnd[r.sector] || 0) + r.value;
    });

    // National Growth Rate (Rn)
    const Rn = totalStart === 0 ? 0 : (totalEnd - totalStart) / totalStart;

    const results: SSAResult[] = [];

    // Iterate through unique regions and sectors
    const regions = Array.from(new Set(records.map(r => r.region)));
    const sectors = Array.from(new Set(records.map(r => r.sector)));

    regions.forEach(region => {
        sectors.forEach(sector => {
            const Eij_t0 = getValue(startRecords, region, sector);
            // const Eij_t1 = getValue(endRecords, region, sector);

            if (Eij_t0 === 0) return; // Skip if no initial investment

            // Sector Growth Rate (Ri)
            const Ei_t0 = sectorTotalStart[sector] || 0;
            const Ei_t1 = sectorTotalEnd[sector] || 0;
            const Ri = Ei_t0 === 0 ? 0 : (Ei_t1 - Ei_t0) / Ei_t0;

            // Region-Sector Growth Rate (rij) -> Not strictly needed for formulas but useful context
            // const eij_t1 = getValue(endRecords, region, sector);
            // const rij = (eij_t1 - Eij_t0) / Eij_t0;

            // Components
            // 1. National Growth Effect (Nij) = Eij_t0 * Rn
            const nij = Eij_t0 * Rn;

            // 2. Industry Mix Effect (Mij) = Eij_t0 * (Ri - Rn)
            const mij = Eij_t0 * (Ri - Rn);

            // 3. Competitive Effect (Cij) = Eij_t1 - (Eij_t0 * (1 + Ri))
            // Simplified: Actual change - (National + Industry)
            // Or formula: Eij_t0 * (rij - Ri)
            const Eij_t1 = getValue(endRecords, region, sector);
            // const cij = Eij_t1 - (Eij_t0 + nij + mij); 
            // Calculated strictly: Cij = Eij_t1 - (Eij_t0 * (1 + Ri))
            const cij = Eij_t1 - (Eij_t0 * (1 + Ri));


            results.push({
                region,
                sector,
                nij,
                mij,
                cij,
                dij: nij + mij + cij // Total Shift
            });
        });
    });

    return results;
}

// --- KLASSEN TYPOLOGY ---

export interface KlassenResult {
    region: string;
    sector: string;
    quadrant: "Prima" | "Berkembang" | "Potensial" | "Terbelakang";
    growthRate: number; // r
    share: number; // y (contribution/value) relative to avg
}

export function calculateKlassen(records: InvestmentRecord[], startYear: number, endYear: number): KlassenResult[] {
    const results: KlassenResult[] = [];
    const startRecords = records.filter(r => r.year === startYear);
    const endRecords = records.filter(r => r.year === endYear);

    const regions = Array.from(new Set(records.map(r => r.region)));
    const sectors = Array.from(new Set(records.map(r => r.sector)));

    // Calculate Reference Growth (Total Province/National) -> R
    const totalStart = startRecords.reduce((acc, r) => acc + r.value, 0);
    const totalEnd = endRecords.reduce((acc, r) => acc + r.value, 0);
    const R = totalStart === 0 ? 0 : (totalEnd - totalStart) / totalStart;

    // Calculate Reference Average Share/Value (Average Sector Value across all regions) -> Y
    // Or simpler: Total Value of Sector / Num Regions?
    // Let's use: Y = (Total Sector Investment) / (Total Investment)
    // Actually Klassen usually compares (Growth Region vs Growth Ref) and (Income Region vs Income Ref).
    // For Investment Semicolon:
    // r = Growth of Sector X in Region A
    // R = Growth of Sector X in All Regions (Reference)
    // y = Value/Share of Sector X in Region A
    // Y = Average Value/Share of Sector X across All Regions

    // We'll compute calculating R and Y per SECTOR.

    sectors.forEach(sector => {
        // Sector Totals (Reference)
        const sectorStart = startRecords.filter(r => r.sector === sector).reduce((a, b) => a + b.value, 0);
        const sectorEnd = endRecords.filter(r => r.sector === sector).reduce((a, b) => a + b.value, 0);
        const R_sector = sectorStart === 0 ? 0 : (sectorEnd - sectorStart) / sectorStart;

        // Average Value of this sector per region (Y_sector)
        const avgValue_sector = sectorEnd / regions.length;

        regions.forEach(region => {
            const recStart = startRecords.find(r => r.region === region && r.sector === sector);
            const recEnd = endRecords.find(r => r.region === region && r.sector === sector);

            if (!recEnd) return; // Need at least current data

            const valStart = recStart ? recStart.value : 0;
            const valEnd = recEnd.value;

            // r (Growth of sector in region)
            const r_sector_region = valStart === 0 ? 0 : (valEnd - valStart) / valStart;

            // y (Value of sector in region)
            const y_sector_region = valEnd;

            // Classification
            let quadrant: "Prima" | "Berkembang" | "Potensial" | "Terbelakang" = "Terbelakang";

            if (r_sector_region > R_sector && y_sector_region > avgValue_sector) {
                quadrant = "Prima"; // Kuadran I
            } else if (r_sector_region > R_sector && y_sector_region <= avgValue_sector) {
                quadrant = "Berkembang"; // Kuadran II
            } else if (r_sector_region <= R_sector && y_sector_region > avgValue_sector) {
                quadrant = "Potensial"; // Kuadran III
            } else {
                quadrant = "Terbelakang"; // Kuadran IV
            }

            results.push({
                region,
                sector,
                quadrant,
                growthRate: r_sector_region,
                share: y_sector_region
            });
        });
    });

    return results;
}
