// frontend/src/components/cable/SizingResultsTable.tsx
import React, { useState } from 'react';
import type { CableOutput, BulkRow } from '../../types/cable';

interface ApprovedCable extends CableOutput {
  approvedAt?: string;
  notes?: string;
}

interface Props {
  results: (BulkRow & { result?: CableOutput })[];
  onSelectCable: (result: CableOutput) => void;
  onApproveCable: (cableNumber: string, approved: boolean) => void;
  onExport: (format: 'excel' | 'pdf') => void;
}

const SizingResultsTable: React.FC<Props> = ({ results, onSelectCable, onApproveCable, onExport }) => {
  const [approvedCables, setApprovedCables] = useState<Set<string>>(new Set());
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});

  const toggleApproval = (cableNumber: string) => {
    setApprovedCables((prev) => {
      const next = new Set(prev);
      if (next.has(cableNumber)) {
        next.delete(cableNumber);
      } else {
        next.add(cableNumber);
      }
      return next;
    });
    onApproveCable(cableNumber, !approvedCables.has(cableNumber));
  };

  const toggleAllApprovals = (approve: boolean) => {
    if (approve) {
      const all = new Set(results.map((r) => r.cable_number));
      setApprovedCables(all);
      results.forEach((r) => onApproveCable(r.cable_number, true));
    } else {
      setApprovedCables(new Set());
      results.forEach((r) => onApproveCable(r.cable_number, false));
    }
  };

  const statusChip = (ok?: boolean, approved?: boolean) => {
    if (approved) {
      return (
        <span className="px-2 py-1 rounded-full text-[10px] font-semibold border bg-emerald-500/10 text-emerald-300 border-emerald-500/40 flex items-center gap-1">
          <span className="text-xs">✓</span> Approved
        </span>
      );
    }
    if (ok === undefined) return <span className="text-[10px] text-slate-500">—</span>;
    return (
      <span
        className={`px-2 py-1 rounded-full text-[10px] font-semibold border ${
          ok
            ? 'bg-blue-500/10 text-blue-300 border-blue-500/40'
            : 'bg-rose-500/10 text-rose-300 border-rose-500/40'
        }`}
      >
        {ok ? '✓ Pass' : '✗ Check'}
      </span>
    );
  };

  const approvalPercentage = Math.round((approvedCables.size / results.length) * 100) || 0;

  return (
    <div className="space-y-3">
      {/* Approval Summary Bar */}
      <div className="bg-gradient-to-r from-sceap-panel/70 to-sceap-panel/40 border border-sceap-border rounded-xl p-3 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-slate-100">
              Approval Progress: {approvedCables.size} of {results.length} cables
            </p>
            <div className="mt-1 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sceap-accent-soft to-sky-500 transition-all duration-300"
                style={{ width: `${approvalPercentage}%` }}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => toggleAllApprovals(true)}
              className="px-3 py-1 rounded-lg text-xs font-semibold border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 transition"
            >
              ✓ Approve All
            </button>
            <button
              onClick={() => toggleAllApprovals(false)}
              className="px-3 py-1 rounded-lg text-xs font-semibold border border-slate-500/40 bg-slate-500/10 text-slate-300 hover:bg-slate-500/20 transition"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto rounded-xl border border-sceap-border/70 bg-black/20">
        <table className="min-w-full text-[10px] md:text-[11px]">
          <thead className="bg-sceap-panel/90 border-b border-sceap-border/80 sticky top-0">
            <tr className="text-slate-300">
              <th className="px-3 py-2 text-left w-8">
                <input
                  type="checkbox"
                  checked={approvedCables.size === results.length && results.length > 0}
                  onChange={(e) => toggleAllApprovals(e.target.checked)}
                  className="cursor-pointer"
                />
              </th>
              <th className="px-3 py-2 text-left">Cable No</th>
              <th className="px-3 py-2 text-left">From</th>
              <th className="px-3 py-2 text-left">To</th>
              <th className="px-3 py-2 text-right">Load (kW)</th>
              <th className="px-3 py-2 text-right">V</th>
              <th className="px-3 py-2 text-right">Length (m)</th>
              <th className="px-3 py-2 text-right">FLC (A)</th>
              <th className="px-3 py-2 text-right">Derated (A)</th>
              <th className="px-3 py-2 text-right">CSA (mm²)</th>
              <th className="px-3 py-2 text-center">Vdrop %</th>
              <th className="px-3 py-2 text-center">Status</th>
              <th className="px-3 py-2 text-center">Approval</th>
              <th className="px-3 py-2 text-center">View</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row, idx) => {
              const r = row.result;
              const isApproved = approvedCables.has(row.cable_number);
              const bg = isApproved
                ? 'bg-emerald-950/30'
                : r && !r.vdrop_ok
                  ? 'bg-rose-950/30'
                  : r && r.vdrop_ok
                    ? 'bg-slate-950/20'
                    : 'bg-slate-950/10';

              return (
                <tr key={row.id} className={`${bg} border-b border-sceap-border/40 hover:bg-sceap-panel/30 transition`}>
                  <td className="px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={isApproved}
                      onChange={() => toggleApproval(row.cable_number)}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="px-3 py-2 font-semibold text-sceap-accent-soft">{row.cable_number}</td>
                  <td className="px-3 py-2 text-slate-300">{row.from_equipment || '—'}</td>
                  <td className="px-3 py-2 text-slate-300">{row.to_equipment || '—'}</td>
                  <td className="px-3 py-2 text-right text-slate-300">{row.load_kw || 0}</td>
                  <td className="px-3 py-2 text-right text-slate-300">{row.voltage}</td>
                  <td className="px-3 py-2 text-right text-slate-300">{row.length}</td>
                  <td className="px-3 py-2 text-right text-sky-300 font-semibold">
                    {r ? r.flc.toFixed(1) : '—'}
                  </td>
                  <td className="px-3 py-2 text-right text-indigo-300 font-semibold">
                    {r ? r.derated_current.toFixed(1) : '—'}
                  </td>
                  <td className="px-3 py-2 text-right text-sceap-accent-soft font-bold text-base">
                    {r ? r.selected_csa : '—'}
                  </td>
                  <td className="px-3 py-2 text-center text-slate-300">
                    {r ? r.vdrop_percent.toFixed(2) : '—'}
                  </td>
                  <td className="px-3 py-2 text-center">{statusChip(r?.vdrop_ok)}</td>
                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() => toggleApproval(row.cable_number)}
                      className={`px-2 py-1 rounded-full text-[10px] font-semibold border transition ${
                        isApproved
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30'
                          : 'bg-slate-500/10 border-slate-500/30 text-slate-300 hover:bg-slate-500/20'
                      }`}
                    >
                      {isApproved ? '✓ Yes' : 'No'}
                    </button>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      disabled={!r}
                      onClick={() => r && onSelectCable(r)}
                      className="px-2 py-1 rounded-full text-[10px] border border-sceap-border/70 text-slate-300 hover:border-sceap-accent-soft hover:text-sceap-accent-soft disabled:opacity-40 transition"
                    >
                      👁 View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Export Section */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <div className="text-xs text-slate-400">
          {approvedCables.size > 0 && (
            <span className="text-emerald-300">
              {approvedCables.size} cable(s) ready for export
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            disabled={approvedCables.size === 0}
            onClick={() => onExport('excel')}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/40 text-blue-300 disabled:opacity-40 hover:from-blue-500/30 hover:to-cyan-500/30 transition"
          >
            📊 Export Excel
          </button>
          <button
            disabled={approvedCables.size === 0}
            onClick={() => onExport('pdf')}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-rose-500/20 to-orange-500/20 border border-rose-500/40 text-rose-300 disabled:opacity-40 hover:from-rose-500/30 hover:to-orange-500/30 transition"
          >
            📄 Export PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default SizingResultsTable;
