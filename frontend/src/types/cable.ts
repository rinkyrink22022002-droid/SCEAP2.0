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
  derating_factors: number[];
  csa_options: number[];
  sc_current?: number;
  sc_time?: number;
  k_const?: number;
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
  derating1: number;
  derating2: number;
  sc_current?: number;
  sc_time?: number;
  k_const?: number;
  result?: CableOutput;
}
