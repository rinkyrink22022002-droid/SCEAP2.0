"""Data models and cable catalog for SCEAP."""

from pydantic import BaseModel
from typing import List, Optional

# In-memory cable catalogue (can be extended to database later)
DEFAULT_CABLE_CATALOG = [
    {
        "csa": 1.5,
        "description": "1.5 mm² Cu",
        "current_rating": 17,
        "vd_mv_per_am": 1.44,
        "sc_rating": 1500,
        "od_mm": 5.5,
    },
    {
        "csa": 2.5,
        "description": "2.5 mm² Cu",
        "current_rating": 24,
        "vd_mv_per_am": 0.87,
        "sc_rating": 2500,
        "od_mm": 6.3,
    },
    {
        "csa": 4,
        "description": "4 mm² Cu",
        "current_rating": 32,
        "vd_mv_per_am": 0.54,
        "sc_rating": 4000,
        "od_mm": 7.4,
    },
    {
        "csa": 6,
        "description": "6 mm² Cu",
        "current_rating": 41,
        "vd_mv_per_am": 0.36,
        "sc_rating": 6000,
        "od_mm": 8.3,
    },
    {
        "csa": 10,
        "description": "10 mm² Cu",
        "current_rating": 57,
        "vd_mv_per_am": 0.23,
        "sc_rating": 10000,
        "od_mm": 10.0,
    },
    {
        "csa": 16,
        "description": "16 mm² Cu",
        "current_rating": 76,
        "vd_mv_per_am": 0.14,
        "sc_rating": 16000,
        "od_mm": 11.8,
    },
    {
        "csa": 25,
        "description": "25 mm² Cu",
        "current_rating": 106,
        "vd_mv_per_am": 0.092,
        "sc_rating": 25000,
        "od_mm": 13.9,
    },
    {
        "csa": 35,
        "description": "35 mm² Cu",
        "current_rating": 138,
        "vd_mv_per_am": 0.066,
        "sc_rating": 35000,
        "od_mm": 16.0,
    },
    {
        "csa": 50,
        "description": "50 mm² Cu",
        "current_rating": 173,
        "vd_mv_per_am": 0.047,
        "sc_rating": 50000,
        "od_mm": 18.3,
    },
    {
        "csa": 70,
        "description": "70 mm² Cu",
        "current_rating": 221,
        "vd_mv_per_am": 0.034,
        "sc_rating": 70000,
        "od_mm": 21.2,
    },
    {
        "csa": 95,
        "description": "95 mm² Cu",
        "current_rating": 269,
        "vd_mv_per_am": 0.025,
        "sc_rating": 95000,
        "od_mm": 24.5,
    },
    {
        "csa": 120,
        "description": "120 mm² Cu",
        "current_rating": 308,
        "vd_mv_per_am": 0.019,
        "sc_rating": 120000,
        "od_mm": 27.2,
    },
    {
        "csa": 150,
        "description": "150 mm² Cu",
        "current_rating": 354,
        "vd_mv_per_am": 0.0153,
        "sc_rating": 150000,
        "od_mm": 30.0,
    },
    {
        "csa": 185,
        "description": "185 mm² Cu",
        "current_rating": 397,
        "vd_mv_per_am": 0.0125,
        "sc_rating": 185000,
        "od_mm": 33.0,
    },
    {
        "csa": 240,
        "description": "240 mm² Cu",
        "current_rating": 470,
        "vd_mv_per_am": 0.0099,
        "sc_rating": 240000,
        "od_mm": 37.5,
    },
]


class CableSpec(BaseModel):
    """Cable specification from catalog."""

    csa: float
    description: str
    current_rating: float
    vd_mv_per_am: float
    sc_rating: float
    od_mm: float


class CableQueryFilter(BaseModel):
    """Filter parameters for cable queries."""

    min_csa: Optional[float] = None
    max_csa: Optional[float] = None
    min_current_rating: Optional[float] = None
    search: Optional[str] = None  # Search in description


def filter_catalog(params: CableQueryFilter) -> List[dict]:
    """Filter cable catalog by criteria."""
    result = DEFAULT_CABLE_CATALOG.copy()

    if params.min_csa:
        result = [c for c in result if c["csa"] >= params.min_csa]

    if params.max_csa:
        result = [c for c in result if c["csa"] <= params.max_csa]

    if params.min_current_rating:
        result = [c for c in result if c["current_rating"] >= params.min_current_rating]

    if params.search:
        search_lower = params.search.lower()
        result = [c for c in result if search_lower in c["description"].lower()]

    return result
