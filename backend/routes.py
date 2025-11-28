from fastapi import APIRouter
from typing import List
from schemas import CableInput, CableOutput
from cable_engine import (
	full_load_current_kw,
	full_load_current_kva,
	derated_current,
	voltage_drop_percent,
	short_circuit_check,
)

router = APIRouter(prefix="/cable", tags=["Cable Sizing"])


@router.post("/size", response_model=CableOutput)
def size_cable(data: CableInput):

	# Determine base current
	if data.current > 0:
		i_base = data.current
	elif data.load_kw > 0:
		i_base = full_load_current_kw(data.load_kw, data.voltage, data.pf, data.eff)
	else:
		i_base = full_load_current_kva(data.load_kva, data.voltage)

	i_derated = derated_current(i_base, data.derating_factors)

	# Voltage drop
	vdrop = voltage_drop_percent(i_base, data.length, data.mv_per_a_m, data.voltage)

	# Select cable CSA by meeting derated current
	selected_csa = None
	for csa in sorted(data.csa_options):
		if csa >= i_derated:
			selected_csa = csa
			break

	if selected_csa is None:
		selected_csa = max(data.csa_options)

	# SC Check
	sc_ok, a_required = short_circuit_check(
		data.sc_current,
		data.sc_time,
		data.k_const,
		selected_csa,
	)

	vdrop_ok = vdrop <= 5  # default for LV

	return CableOutput(
		cable_number=data.cable_number,
		flc=round(i_base, 2),
		derated_current=round(i_derated, 2),
		selected_csa=selected_csa,
		vdrop_percent=round(vdrop, 3),
		sc_required_area=round(a_required, 2),
		sc_ok=sc_ok,
		vdrop_ok=vdrop_ok,
	)


@router.post("/bulk-size", response_model=List[CableOutput])
def bulk_size_cables(data: List[CableInput]):
	results: List[CableOutput] = []

	for cable in data:
		# Determine base current
		if cable.current and cable.current > 0:
			i_base = cable.current
		elif cable.load_kw and cable.load_kw > 0:
			i_base = full_load_current_kw(cable.load_kw, cable.voltage, cable.pf or 1.0, cable.eff or 1.0)
		else:
			i_base = full_load_current_kva(cable.load_kva or 0, cable.voltage)

		i_derated = derated_current(i_base, cable.derating_factors or [1.0])

		# Voltage drop
		vdrop = voltage_drop_percent(i_base, cable.length, cable.mv_per_a_m, cable.voltage)

		# Select cable CSA by meeting derated current
		selected_csa = None
		for csa in sorted(cable.csa_options or []):
			if csa >= i_derated:
				selected_csa = csa
				break

		if selected_csa is None and cable.csa_options:
			selected_csa = max(cable.csa_options)

		# SC Check
		sc_ok, a_required = short_circuit_check(
			cable.sc_current or 0,
			cable.sc_time or 1,
			cable.k_const or 115,
			selected_csa or 0,
		)

		vdrop_ok = vdrop <= 5  # for now LV default

		results.append(
			CableOutput(
				cable_number=cable.cable_number or "",
				flc=round(i_base, 2),
				derated_current=round(i_derated, 2),
				selected_csa=selected_csa or 0,
				vdrop_percent=round(vdrop, 3),
				sc_required_area=round(a_required, 2),
				sc_ok=bool(sc_ok),
				vdrop_ok=bool(vdrop_ok),
			)
		)

	return results

