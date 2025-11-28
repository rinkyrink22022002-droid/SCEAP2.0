// frontend/src/types/cable.ts
export interface CableInput {
  cable_number?: string;
  load_kw?: number;
  load_kva?: number;
  current?: number;
  voltage: number;
  pf?: number;
  eff?: number;
  length: number;
  mv_per_a_m: number;
  r_ohm_per_km?: number;
  x_ohm_per_km?: number;
  derating_factors: number[];
  csa_options: number[];
  sc_current?: number;
  sc_time?: number;
  k_const?: number;
  // Optional fields sent from frontend/catalog
  catalog_rated_current_air?: number;
  catalog_rated_current_trench?: number;
  catalog_rated_current_duct?: number;
  grouping_threshold?: number;
}

export interface ComplianceMessage {
  type: string;
  ok: boolean;
  msg: string;
  limit?: number;
  value?: number;
  margin?: number;
}
export interface CableOutput {
  cable_number: string;
  flc: number;
  derated_current: number;
  selected_csa: number;
  vdrop_percent: number;
  sc_required_area: number;
  sc_ok: boolean;
  vdrop_ok: boolean;
  compliance?: ComplianceMessage[];
  voltage_category?: string;
}

export interface BulkRow {
  id: string;
  cable_number: string;
  from_equipment?: string;
  to_equipment?: string;
  load_kw?: number;
  load_kva?: number;
  current?: number;
  voltage: number;
  pf?: number;
  eff?: number;
  length: number;
  mv_per_a_m: number;
  r_ohm_per_km?: number;
  x_ohm_per_km?: number;
  derating1: number;
  derating2: number;
  sc_current?: number;
  sc_time?: number;
  k_const?: number;
  result?: CableOutput;
  // Optional catalog metadata applied from catalog matches
  catalog_vendor?: string;
  catalog_part_no?: string;
  catalog_od_mm?: number;
  catalog_weight_kg_per_km?: number;
  catalog_csa_mm2?: number;
  catalog_rated_current_air?: number;
  catalog_rated_current_trench?: number;
  catalog_rated_current_duct?: number;
}
