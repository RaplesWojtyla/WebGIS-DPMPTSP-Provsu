// Years for filter dropdown
export const YEARS = ["2024", "2023", "2022", "2021", "2020"]

// Legacy types - kept for reference, data now comes from database
export type PdrbValue = {
    sectorIndex: number
    value: number
}

export type RegionPdrbData = {
    year: string
    regionId: string
    values: PdrbValue[]
}

// Legacy storage key - no longer used
export const STORAGE_KEY_PREFIX = "pdrb-data-"
