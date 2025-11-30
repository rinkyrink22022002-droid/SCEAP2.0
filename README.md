# SCEAP 2.0 — Smart Cable Engineering Automation Platform

A modern, full-stack web platform for power plant cable engineering automation. Replaces Excel-based workflows with intelligent, real-time calculations for cable sizing, voltage drop analysis, short-circuit verification, and bulk operations.

## 🎯 Features

### Current (MVP) ✅
- **Cable Sizing** (Single & Bulk)
  - Full load current (FLC) calculation (kW, kVA, or Direct Current)
  - Derating factor support
  - Voltage drop calculation using mV/A/m method
  - Short-circuit duty verification
  - IEC 60287 & IEEE 80 compliance logic
  
- **Sizing Results Interface** ⭐ NEW
  - Split-view layout: Results table (3/4 width) + Specification panel (1/4 width)
  - Individual cable approval workflow with checkboxes
  - Bulk approve/reject buttons with progress tracking
  - Animated 3D-style cable visualization
  - Status indicators (Voltage Drop OK, Short-Circuit Check)
  - Export to Excel/PDF for approved cables only

- **Bulk Sizing & Export**
  - Add/edit multiple cable records in inline table
  - Excel/CSV import with advanced column mapping wizard
  - Real-time sizing for all cables
  - Export results to Excel or CSV (all records)
  - Bill of Quantities (BOQ) export by cable size

- **Cable Catalogue**
  - In-memory cable library (1.5 mm² to 240 mm²)
  - Queryable by CSA, current rating, and description
  - Advanced search and filtering

- **Gamified Dark UI** ✨
  - Gen-Z aesthetic with teal accents and glassy panels
  - Animated 3D core visualization with approval states
  - Compliance indicators with pulse animations
  - Progress bars and status badges
  - Responsive design (mobile, tablet, desktop)
  - Full keyboard accessibility
  - Smooth 0.3-0.5s animations throughout

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

### Production (Render) — Recommended

1. **Connect GitHub Repository**
   - Go to https://render.com
   - Create new Blueprint from this repository
   - Select `main` branch
   - Render will auto-deploy both services

2. **Services Deploy Automatically**
   - Backend: Python web service (uvicorn)
   - Frontend: Static site (Vite build)
   - Environment variables configured in `render.yaml`

3. **Live URLs**
   - Backend: `https://sceap-backend-xxxx.onrender.com`
   - Frontend: `https://sceap-frontend-xxxx.onrender.com`

### Manual Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed step-by-step instructions for:
- Render (one-click)
- Manual Render setup
- Vercel/Netlify (frontend)
- Docker deployment

### Environment Variables

**Frontend**:
- `VITE_API_BASE`: Backend API URL (auto-detected in dev, must be set in prod)

**Backend**:
- `PYTHONUNBUFFERED=1`: Real-time logging

### Testing After Deploy
```bash
# Health check
curl https://your-backend/

# Single cable sizing
curl -X POST https://your-backend/cable/size -H "Content-Type: application/json" \
  -d '{"cable_number":"TEST-001","load_kw":55,"voltage":415,...}'

# Catalogue query
curl "https://your-backend/cable/catalog?min_csa=10&max_csa=120"
```

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
