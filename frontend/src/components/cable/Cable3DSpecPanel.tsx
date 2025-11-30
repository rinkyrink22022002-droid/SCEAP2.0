// frontend/src/components/cable/Cable3DSpecPanel.tsx
import React, { useMemo } from 'react';
import type { CableOutput } from '../../types/cable';

interface Props {
  result?: CableOutput;
  isApproved?: boolean;
}

const Cable3DSpecPanel: React.FC<Props> = ({ result, isApproved }) => {
  if (!result) {
    return (
      <div className="h-full min-h-96 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-sceap-border rounded-2xl flex flex-col items-center justify-center text-center p-4">
        <div className="text-6xl mb-3">🔌</div>
        <p className="text-xs text-slate-400">Select a cable from the table to view</p>
        <p className="text-xs text-slate-500 mt-1">3D specifications & visualization</p>
      </div>
    );
  }

  // Calculate animated core positions for 3D effect
  const cores = 4;
  const corePositions = useMemo(() => {
    return Array.from({ length: cores }).map((_, i) => ({
      id: i,
      angle: (360 / cores) * i,
      delay: i * 0.1,
    }));
  }, []);

  const statusColor = isApproved
    ? 'from-emerald-500 to-teal-500'
    : result.vdrop_ok && result.sc_ok
      ? 'from-blue-500 to-cyan-500'
      : 'from-orange-500 to-rose-500';

  return (
    <div className="h-full min-h-96 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-sceap-border rounded-2xl p-4 md:p-5 space-y-4 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-sceap-accent-soft/5 blur-3xl animate-pulse-glow" />
      <div className="absolute -left-12 -bottom-12 h-32 w-32 rounded-full bg-blue-500/5 blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 space-y-3">
        {/* Status Badge */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
              Cable Specification
            </h3>
            <p className="text-lg font-bold text-slate-100 mt-1">{result.cable_number}</p>
          </div>
          {isApproved && (
            <div className="px-2 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-[10px] font-semibold">
              ✓ APPROVED
            </div>
          )}
        </div>

        {/* 3D-style Core Visualization */}
        <div className="flex items-center justify-center py-6">
          <div className="relative h-32 w-32">
            {/* Outer cable sheath (simplified 3D effect) */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-slate-700 to-slate-800 shadow-lg opacity-80" />
            <div className="absolute inset-1 rounded-full bg-gradient-to-br from-slate-600 to-slate-700" />

            {/* Cable cores arranged in 2x2 grid */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-2">
                {corePositions.map((core) => (
                  <div
                    key={core.id}
                    className={`h-10 w-10 rounded-full bg-gradient-to-br ${statusColor} shadow-lg transform transition-all duration-300 hover:scale-110 cursor-pointer`}
                    style={{
                      animation: `slideUp 0.5s ease-out ${core.delay}s both`,
                      boxShadow: isApproved
                        ? '0 0 20px rgba(16, 185, 129, 0.6)'
                        : 'inset 0 2px 4px rgba(255,255,255,0.1), 0 0 20px rgba(6, 182, 212, 0.4)',
                    }}
                  >
                    <div className="h-full w-full rounded-full flex items-center justify-center text-[10px] font-bold text-slate-950">
                      {core.id + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cable outer sheath glow */}
            <div className="absolute -inset-2 rounded-full border border-sceap-accent-soft/30 animate-pulse-glow" />
          </div>
        </div>

        {/* Key Specifications in Grid */}
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <div className="p-2 rounded-lg bg-sceap-panel/60 border border-sceap-border/50">
            <span className="text-slate-400">CSA</span>
            <div className="text-sm font-bold text-sceap-accent-soft">{result.selected_csa} mm²</div>
          </div>
          <div className="p-2 rounded-lg bg-sceap-panel/60 border border-sceap-border/50">
            <span className="text-slate-400">FLC</span>
            <div className="text-sm font-bold text-sky-300">{result.flc.toFixed(1)} A</div>
          </div>
          <div className="p-2 rounded-lg bg-sceap-panel/60 border border-sceap-border/50">
            <span className="text-slate-400">Derated</span>
            <div className="text-sm font-bold text-indigo-300">{result.derated_current.toFixed(1)} A</div>
          </div>
          <div className="p-2 rounded-lg bg-sceap-panel/60 border border-sceap-border/50">
            <span className="text-slate-400">Vdrop</span>
            <div
              className={`text-sm font-bold ${result.vdrop_ok ? 'text-emerald-300' : 'text-rose-300'}`}
            >
              {result.vdrop_percent.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Compliance Indicators */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px]">
            <div
              className={`h-2 w-2 rounded-full ${result.vdrop_ok ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}
            />
            <span className={result.vdrop_ok ? 'text-emerald-300' : 'text-rose-300'}>
              Voltage Drop {result.vdrop_ok ? 'within limit' : 'exceeds limit'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <div
              className={`h-2 w-2 rounded-full ${result.sc_ok ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}
            />
            <span className={result.sc_ok ? 'text-emerald-300' : 'text-rose-300'}>
              Short-Circuit {result.sc_ok ? 'duty OK' : 'duty failed'}
            </span>
          </div>
        </div>

        {/* Recommendation */}
        {isApproved ? (
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] leading-relaxed">
            ✓ This cable specification has been <strong>approved</strong> and is ready for export.
          </div>
        ) : result.vdrop_ok && result.sc_ok ? (
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[10px] leading-relaxed">
            This cable meets all engineering requirements. Review and approve to proceed with export.
          </div>
        ) : (
          <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[10px] leading-relaxed">
            ⚠ This cable <strong>does not meet</strong> all requirements. Review and adjust parameters.
          </div>
        )}
      </div>
    </div>
  );
};

export default Cable3DSpecPanel;
