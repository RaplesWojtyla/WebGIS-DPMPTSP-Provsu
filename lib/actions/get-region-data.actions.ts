import { DUMMY_REGIONS } from "@/data/dummy";


export function getRegionData(address: string): RegionData {
  const lowerAddr = address.toLowerCase();
  
  if (lowerAddr.includes("deli serdang")) return DUMMY_REGIONS["deli serdang"];
  if (lowerAddr.includes("karo")) return DUMMY_REGIONS["karo"];
  
  return DUMMY_REGIONS["default"];
}