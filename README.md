# SCEAP 2.0 — Smart Cable Engineering Automation Platform

A modern, full-stack web platform for power plant cable engineering automation. Replaces Excel-based workflows with intelligent, real-time calculations for cable sizing, voltage drop analysis, short-circuit verification, and bulk operations.

## 🎯 Features

### Current (MVP)
- **Cable Sizing** (Single & Bulk)
  - Full load current (FLC) calculation (kW, kVA, or Direct Current)
  - Derating factor support
  - Voltage drop calculation using mV/A/m method
  - Short-circuit duty verification
  - IEC 60287 & IEEE 80 compliance logic
  
- **Bulk Sizing & Export**
  - Add/edit multiple cable records
  - Excel/CSV import with column mapping wizard
  - Real-time sizing for all cables
  - Export results to CSV or Bill of Quantities (BOQ)

- **Cable Catalogue**
  - In-memory cable library (1.5 mm² to 240 mm²)
  - Queryable by CSA, current rating, and description

- **Modern Dark UI**
  - Gen-Z aesthetic with teal accents
  - Responsive design (mobile, tablet, desktop)
  - Smooth animations and accessibility

## 🏗️ Architecture

### Frontend
- React 19 + TypeScript
- Vite + Tailwind CSS v4
- Axios API client with smart base URL detection
- React hooks for state management

### Backend
- FastAPI (Python 3.12+)
- Uvicorn server
- Pure Python calculation engine
- pandas + openpyxl for Excel support
- Pydantic for validation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.12+
- Poetry

### Development

#### Backend (Terminal 1)
```bash
cd backend
poetry install
poetry run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API docs: http://localhost:8000/docs

#### Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

### API Endpoints

- `POST /cable/size` — Size a single cable
- `POST /cable/bulk-size` — Size multiple cables
- `POST /cable/upload` — Upload Excel file
- `POST /cable/map-upload` — Map columns and import
- `GET /cable/catalog` — Query cable catalogue
- `GET /` — Health check

## 🌐 Deployment

### Render

**Backend**:
- Runtime: Python 3.12
- Build: `pip install poetry && poetry install`
- Start: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`

**Frontend**:
- Build: `cd frontend && npm install && npm run build`
- Publish Dir: `frontend/dist`
- Env: `VITE_API_BASE=https://your-backend.onrender.com`

## 📖 Key Formulas

### Full Load Current
```
I = P(kW) / (√3 × V × pf × eff)
```

### Voltage Drop
```
Vd% = (√3 × I × L × mV/A/m) / V × 100
```

### Short-Circuit Check
```
A_required = Isc × √t / k
```

## 🎨 Design System

- **Colors**: Dark navy (#050814) with teal accents (#06b6d4)
- **Animations**: fadeIn, slideUp, pulseGlow
- **Focus States**: Full keyboard accessibility

## 📄 License

MIT License

---

**Current Version**: v0.1 (MVP)  
**Status**: Active Development  
**Last Updated**: November 2025
