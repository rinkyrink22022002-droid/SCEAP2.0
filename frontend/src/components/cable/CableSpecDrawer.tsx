import React from 'react';
import type { BulkRow } from '../../types/cable';

interface Props {
  open: boolean;
  row: BulkRow | null;
  onClose: () => void;
}

interface ComplianceItem {
  type: string;
  ok: boolean;
  limit?: number;
  value?: number;
  margin?: number;
  msg: string;
}

const CoreVisualization: React.FC<{ coresLabel: string; cores: number; od: number }> = ({ coresLabel, cores, od }) => {
  // build an animated metallic core visualization (glossy copper + armour ring)
  const coreCount = Math.max(1, Math.round(cores || 1));

  const containerSize = 140;
  const maxCoreRadius = 14;

  return (
    <div className="flex flex-col items-center gap-3">
      <style>{`
        @keyframes lightSweep { from { background-position: -40% 0; } to { background-position: 140% 0; } }
        .copper-core { background: radial-gradient(circle at 30% 30%, #ffddb0, #d18a39, #5f3b09); border: 2px solid #c27a36; box-shadow: inset -3px -3px 8px rgba(0,0,0,0.6), 0 6px 16px rgba(0,0,0,0.7); }
        .copper-gloss { background-image: linear-gradient(110deg, rgba(255,255,255,0.08), rgba(255,255,255,0.22), rgba(255,255,255,0.04)); background-size: 200% 100%; animation: lightSweep 3s linear infinite; mix-blend-mode: overlay; }
        .od-scale { color: #9fb8bf; font-size: 11px; letter-spacing: 0.5px }
      `}</style>

      <div style={{ width: containerSize, height: containerSize, position: 'relative' }}>
        {/* Armour ring (gunmetal) */}
        <svg width={containerSize} height={containerSize} viewBox={`0 0 ${containerSize} ${containerSize}`} style={{ position: 'absolute', left: 0, top: 0 }}>
          <defs>
            <linearGradient id="armourGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6b6f70" />
              <stop offset="50%" stopColor="#42464a" />
              <stop offset="100%" stopColor="#2a2d30" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle cx={containerSize / 2} cy={containerSize / 2} r={54} stroke="url(#armourGrad2)" strokeWidth={6} fill="none" filter="url(#glow)" />
          <circle cx={containerSize / 2} cy={containerSize / 2} r={44} stroke="#4a4a4a" strokeWidth={6} fill="none" />
        </svg>

        {/* cores arranged in circle */}
        {[...Array(coreCount)].map((_, i) => {
          const angle = (i / coreCount) * Math.PI * 2 - Math.PI / 2;
          const cx = containerSize / 2 + Math.cos(angle) * 18;
          const cy = containerSize / 2 + Math.sin(angle) * 18;
          const size = maxCoreRadius * (1 - (i / Math.max(1, coreCount)) * 0.15);
          return (
            <div
              key={i}
              className={`absolute flex items-center justify-center rounded-full copper-core copper-gloss`}
              style={{ width: size * 2, height: size * 2, left: cx - size, top: cy - size }}
            />
          );
        })}

        {/* OD label / scale */}
        <div style={{ position: 'absolute', left: 8, bottom: 8 }} className="od-scale">
          <div>OD: {od ? `${od} mm` : '—'}</div>
        </div>
      </div>

      <div className="text-xs text-slate-300 mt-2">{coresLabel}</div>
    </div>
  );
};

const ComplianceRule: React.FC<{ rule: ComplianceItem }> = ({ rule }) => {
  const statusIcon = rule.ok ? '✔' : '✕';
  const statusColorClass = rule.ok ? 'text-emerald-400' : 'text-rose-400';
  const bgColorClass = rule.ok ? 'bg-emerald-600/6' : 'bg-rose-600/6';
  const borderClass = rule.ok ? 'border-slate-700/30' : 'border-rose-500/80';
  const borderWidth = rule.ok ? 'border' : 'border-2';

  const displayNameMap: Record<string, string> = {
    vdrop_run: 'Vdrop (Running)',
    vdrop_start: 'Vdrop (Starting)',
    sc: 'Short-Circuit (SC) Check',
    derating: 'Derating / Thermal',
  };

  const display = displayNameMap[rule.type] || rule.type.replace('_', ' ');

  return (
    <div className={`${borderWidth} ${borderClass} rounded-lg p-3 ${bgColorClass}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`${statusColorClass} font-bold text-sm w-6 text-center`}>{statusIcon}</div>
          <div>
            <div className="text-sm font-medium text-slate-100">{display}</div>
            <div className="text-xs text-slate-400 mt-1">{rule.msg}</div>
          </div>
        </div>
        <div className="text-right">
          {rule.value !== undefined && rule.limit !== undefined ? (
            <div className="text-xs text-slate-300">{Number(rule.value).toFixed(2)} / {Number(rule.limit).toFixed(2)}</div>
          ) : null}
          {rule.margin !== undefined && (
            <div className="text-xs text-slate-400">Margin: {rule.margin}%</div>
          )}
        </div>
      </div>
    </div>
  );
};

const CableSpecDrawer: React.FC<Props> = ({ open, row, onClose }) => {
  if (!open || !row) return null;

  const r = row.result;
  const vendor = row.catalog_vendor ?? '—';
  const part = row.catalog_part_no ?? '—';
  const od = row.catalog_od_mm ?? 0;
  const weight = row.catalog_weight_kg_per_km ?? '—';
  const csa = row.catalog_csa_mm2 ?? r?.selected_csa ?? '—';
  // derive cores label: try parsing part number (e.g. "3.5C"), fall back to catalog_csa or selected_csa
  const extractCoresFromPart = (partNo: string | undefined): string | null => {
    if (!partNo) return null;
    const m = partNo.match(/(\d+(?:\.\d+)?)\s*C/i);
    if (m) return `${m[1]}C`;
    return null;
  };

  const coresLabel = extractCoresFromPart(row.catalog_part_no) || extractCoresFromPart(String(r?.selected_csa)) || (row.catalog_csa_mm2 ? `${row.catalog_csa_mm2}C` : '1C');
  const cores = parseFloat((coresLabel || '1C').replace(/C/i, '')) || 1;

  // Parse compliance data
  const complianceItems: ComplianceItem[] = r?.compliance?.map((c: any) => ({
    type: c.type || 'unknown',
    ok: c.ok ?? false,
    limit: c.limit,
    value: c.value,
    margin: c.margin,
    msg: c.msg || '',
  })) || [];

  const allPass = complianceItems.length > 0 && complianceItems.every((c) => c.ok === true);
  const failCount = complianceItems.filter((c) => !c.ok).length;

  let statusChip = '🟩 VERIFIED';
  if (failCount >= 2) statusChip = '🟥 FAIL';
  else if (failCount === 1) statusChip = '🟧 NEED REVIEW';

  return (
    <div className="fixed right-0 top-4 bottom-4 w-[520px] bg-[#071426]/95 border-l border-cyan-600/25 z-50 shadow-2xl overflow-auto rounded-l-2xl animate-in slide-in-from-right-96 duration-300">
      <div className="p-5 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-cyan-500/20 pb-4">
          <div>
            <h3 className="text-base font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
              Cable Specification
            </h3>
            <p className="text-xs text-slate-400 mt-1">{row.cable_number} • {csa} mm² • {row.voltage} V</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-xl px-2 py-1 rounded hover:bg-slate-800/50"
          >
            ✕
          </button>
        </div>

        {/* Status Overview Chip */}
        <div className={`px-3 py-2 rounded-lg font-semibold text-sm text-center ${
          allPass && failCount === 0
            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
            : failCount === 1
            ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
            : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
        }`}>
          {statusChip}
        </div>

        {/* 3D Core Visualization */}
        <div className="flex flex-col items-center p-4 bg-gradient-to-br from-slate-900/20 to-slate-800/10 rounded-xl border border-cyan-700/10">
          <CoreVisualization coresLabel={coresLabel} cores={cores} od={od} />
        </div>

        {/* Conductor & Specs Card */}
        <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50 space-y-3">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Conductor & Physical</div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-xs text-slate-400">CSA (mm²)</div>
              <div className="font-semibold text-slate-100">{csa}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Cores</div>
              <div className="font-semibold text-slate-100">{cores}C</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">OD (mm)</div>
              <div className="font-semibold text-slate-100">{od || '—'}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Weight (kg/km)</div>
              <div className="font-semibold text-slate-100">{weight}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">R (Ω/km)</div>
              <div className="font-semibold text-slate-100">{row.r_ohm_per_km ? row.r_ohm_per_km.toFixed(4) : '—'}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">X (Ω/km)</div>
              <div className="font-semibold text-slate-100">{row.x_ohm_per_km ? row.x_ohm_per_km.toFixed(4) : '—'}</div>
            </div>
          </div>
        </div>

        {/* Calculated Fields */}
        <div className="bg-slate-800/20 p-4 rounded-lg border border-slate-700/50 space-y-3">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Electrical</div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-xs text-slate-400">FLC (A)</div>
              <div className="font-semibold text-slate-100">{r?.flc ? r.flc.toFixed(2) : '—'}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Derated (A)</div>
              <div className="font-semibold text-slate-100">{r?.derated_current ? r.derated_current.toFixed(2) : '—'}</div>
            </div>
          </div>
        </div>

        {/* Compliance Panel */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Compliance & Rules</div>
          <div className="space-y-2">
            {complianceItems.length === 0 ? (
              <div className="text-xs text-slate-500 text-center py-4">No compliance data</div>
            ) : (
              complianceItems.map((item, i) => <ComplianceRule key={i} rule={item} />)
            )}
          </div>
        </div>

        {/* Procurement Block */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-4 rounded-lg border border-cyan-500/30 space-y-3">
          <div className="text-sm font-semibold text-slate-100">Procurement</div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-xs text-slate-400">Vendor:</span>
              <div className="font-semibold text-slate-100">{vendor}</div>
            </div>
            <div>
              <span className="text-xs text-slate-400">Part Number:</span>
              <div className="font-semibold text-slate-100">{part}</div>
            </div>
          </div>
          <button className="w-full mt-3 px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-semibold text-sm hover:from-cyan-400 hover:to-blue-400 transition-all">
            + Add to BOQ
          </button>
        </div>
      </div>
    </div>
  );
};

export default CableSpecDrawer;
