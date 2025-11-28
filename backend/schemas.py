from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class CableInput(BaseModel):
	cable_number: Optional[str] = "TEST-001"
	load_kw: Optional[float] = 0
	load_kva: Optional[float] = 0
	current: Optional[float] = 0
	voltage: float
	pf: Optional[float] = 1.0
	eff: Optional[float] = 1.0
	length: float
	mv_per_a_m: Optional[float] = 0.44
	# Optional conductor parameters in ohm per km (preferred for accuracy)
	r_ohm_per_km: Optional[float] = None
	x_ohm_per_km: Optional[float] = None
	derating_factors: List[float]
	csa_options: List[float]  # available CSA sizes to pick from
	sc_current: Optional[float] = 0
	sc_time: Optional[float] = 1
	k_const: Optional[float] = 115
	# Motor starting method: 'DOL', 'star_delta', 'VFD' (default: DOL)
	motor_start_method: Optional[str] = "DOL"

	# Optional catalog rated currents (frontend may supply these)
	catalog_rated_current_air: Optional[float] = None
	catalog_rated_current_trench: Optional[float] = None
	catalog_rated_current_duct: Optional[float] = None

	# Optional per-request grouping threshold (0-1), default handled by routes
	grouping_threshold: Optional[float] = None


class CableOutput(BaseModel):
	cable_number: str
	flc: float
	derated_current: float
	selected_csa: float
	vdrop_percent: float
	sc_required_area: float
	sc_ok: bool
	vdrop_ok: bool
	# Optional compliance messages to drive UI badges and details
	class ComplianceItem(BaseModel):
		type: str
		ok: bool
		limit: Optional[float] = None
		value: Optional[float] = None
		margin: Optional[float] = None
		msg: Optional[str] = None

	compliance: Optional[List[ComplianceItem]] = None
	voltage_category: Optional[str] = None


from typing import Optional, Dict, Any


class CatalogEntry(BaseModel):
	csa_mm2: float
	conductor: str
	cores: int
	armour: str
	r_ohm_per_km: float
	x_ohm_per_km: float
	od_mm: float
	weight_kg_per_km: float
	vendor: str
	part_no: str
	rated_current_air: Optional[float] = None
	rated_current_trench: Optional[float] = None
	rated_current_duct: Optional[float] = None


class CatalogMatchSuggestion(BaseModel):
	score: float
	entry: CatalogEntry


class CatalogMatchPerRow(BaseModel):
	row_index: int
	cable_number: str
	suggestions: list[CatalogMatchSuggestion]


class CatalogMatchRequest(BaseModel):
	token: str
	rows: list[Dict[str, Any]]
	top_n: int = 3


class CatalogMatchResponse(BaseModel):
	matches: list[CatalogMatchPerRow]

