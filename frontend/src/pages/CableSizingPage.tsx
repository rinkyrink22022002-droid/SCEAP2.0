// frontend/src/pages/CableSizingPage.tsx
import React, { useState } from 'react';
import LayoutShell from '../components/layout/LayoutShell';
import CableSizingForm from '../components/cable/CableSizingForm';
import CableResultsPanel from '../components/cable/CableResultsPanel';
import CableVisualizationCard from '../components/cable/CableVisualizationCard';
import Cable3DSpecPanel from '../components/cable/Cable3DSpecPanel';
import SizingResultsTable from '../components/cable/SizingResultsTable';
import type { CableInput, CableOutput, BulkRow } from '../types/cable';
import CableBulkTable from '../components/cable/CableBulkTable';
import { api } from '../api/client';

type PageState = 'input' | 'results';

const CableSizingPage: React.FC = () => {
  const [pageState, setPageState] = useState<PageState>('input');
  const [loading, setLoading] = useState(false);
  const [singleResult, setSingleResult] = useState<CableOutput | undefined>();
  const [bulkResults, setBulkResults] = useState<(BulkRow & { result?: CableOutput })[]>([]);
  const [selectedResult, setSelectedResult] = useState<CableOutput | undefined>();
  const [approvedCables, setApprovedCables] = useState<Set<string>>(new Set());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBulkMode, setIsBulkMode] = useState(false);

  const handleSingleCalculate = async (payload: CableInput) => {
    try {
      setLoading(true);
      setErrorMessage(null);
      console.debug('[API] Posting to', api.defaults.baseURL + '/cable/size', payload);
      const res = await api.post<CableOutput>('/cable/size', payload);
      setSingleResult(res.data);
      setSelectedResult(res.data);
      setPageState('results');
      setIsBulkMode(false);
    } catch (err: unknown) {
      console.error('[API] Request failed', err);
      let message = 'Unknown error';
      if (err && typeof err === 'object' && 'message' in err) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        message = (err as any).message || message;
      }
      setErrorMessage(`Error: ${message}. Check backend & CORS.`);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkCalculate = (rows: (BulkRow & { result?: CableOutput })[]) => {
    setBulkResults(rows);
    setSelectedResult(rows[0]?.result);
    setPageState('results');
    setIsBulkMode(true);
  };

  const handleApproveCable = (cableNumber: string, approved: boolean) => {
    setApprovedCables((prev) => {
      const next = new Set(prev);
      if (approved) {
        next.add(cableNumber);
      } else {
        next.delete(cableNumber);
      }
      return next;
    });
  };

  const handleExport = (format: 'excel' | 'pdf') => {
    const exportData = isBulkMode
      ? bulkResults.filter((r) => approvedCables.has(r.cable_number))
      : singleResult
        ? [{ cable_number: singleResult.cable_number, result: singleResult }]
        : [];

    if (format === 'excel') {
      exportToExcel(exportData);
    } else {
      exportToPDF(exportData);
    }
  };

  const exportToExcel = (data: any[]) => {
    const headers = [
      'Cable No',
      'From',
      'To',
      'Voltage',
      'Load kW',
      'Length m',
      'FLC A',
      'Derated A',
      'CSA mm2',
      'Vdrop %',
      'Vdrop OK',
      'SC OK',
    ];

    const rows = data.map((row) => {
      const r = row.result;
      return [
        row.cable_number,
        row.from_equipment || '',
        row.to_equipment || '',
        row.voltage || '',
        row.load_kw || '',
        row.length || '',
        r?.flc || '',
        r?.derated_current || '',
        r?.selected_csa || '',
        r?.vdrop_percent || '',
        r?.vdrop_ok ? 'YES' : 'NO',
        r?.sc_ok ? 'YES' : 'NO',
      ];
    });

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sceap_cable_sizing_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = (data: any[]) => {
    // Simplified PDF export (can be enhanced with jsPDF library)
    const content = data
      .map((row) => {
        const r = row.result;
        return `Cable: ${row.cable_number} | CSA: ${r?.selected_csa} mm² | FLC: ${r?.flc} A | Vdrop: ${r?.vdrop_percent}% | Status: ${r?.vdrop_ok ? 'PASS' : 'FAIL'}`;
      })
      .join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sceap_cable_sizing_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Input State
  if (pageState === 'input') {
    return (
      <LayoutShell>
        <div className="flex flex-col gap-4 md:gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-100">Cable Sizing Engine</h1>
              <p className="text-sm text-slate-400 mt-1">IEC 60287 & IEEE 80 Compliant Calculations</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30">
              <div className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
              <span className="text-xs text-sky-300 font-semibold">Ready</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
            <div className="lg:col-span-1">
              <CableSizingForm onCalculate={handleSingleCalculate} loading={loading} />
            </div>
            <div className="lg:col-span-2">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-900/60 border border-rose-800 text-rose-100 text-xs mb-3 animate-fade-in">
                  {errorMessage}
                </div>
              )}
              <CableVisualizationCard result={singleResult} />
              <CableResultsPanel result={singleResult} />
            </div>
          </div>

          <div className="pt-2">
            <CableBulkTable
              onSelectResult={(r) => {
                setSingleResult(r);
              }}
            />
          </div>
        </div>
      </LayoutShell>
    );
  }

  // Results State
  return (
    <LayoutShell>
      <div className="flex flex-col gap-4 md:gap-6 h-full">
        {/* Header with Navigation */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-100">
              {isBulkMode ? 'Bulk Cable Sizing Results' : 'Cable Sizing Result'}
            </h1>
            <p className="text-sm text-slate-400 mt-1">Review, approve, and export</p>
          </div>
          <button
            onClick={() => {
              setPageState('input');
              setBulkResults([]);
              setSingleResult(undefined);
              setApprovedCables(new Set());
            }}
            className="px-4 py-2 rounded-lg border border-sceap-border bg-sceap-panel/70 text-sm text-slate-300 hover:border-sceap-accent-soft hover:text-sceap-accent-soft transition"
          >
            ← Back to Input
          </button>
        </div>

        {/* Main Results Layout: 3D Panel (right) + Results Table (left) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1 min-h-0">
          {/* Results Table - 3/4 width on desktop */}
          <div className="lg:col-span-3 flex flex-col overflow-hidden">
            {isBulkMode ? (
              <SizingResultsTable
                results={bulkResults}
                onSelectCable={setSelectedResult}
                onApproveCable={handleApproveCable}
                onExport={handleExport}
              />
            ) : (
              <div className="space-y-3">
                <CableResultsPanel result={singleResult} />
                <CableVisualizationCard result={singleResult} />
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleExport('excel')}
                    className="flex-1 px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/40 text-blue-300 hover:from-blue-500/30 hover:to-cyan-500/30 transition"
                  >
                    📊 Export Excel
                  </button>
                  <button
                    onClick={() => handleExport('pdf')}
                    className="flex-1 px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-rose-500/20 to-orange-500/20 border border-rose-500/40 text-rose-300 hover:from-rose-500/30 hover:to-orange-500/30 transition"
                  >
                    📄 Export PDF
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3D Cable Spec Panel - 1/4 width on desktop */}
          <div className="lg:col-span-1 flex flex-col">
            <Cable3DSpecPanel
              result={selectedResult}
              isApproved={selectedResult ? approvedCables.has(selectedResult.cable_number) : false}
            />
          </div>
        </div>
      </div>
    </LayoutShell>
  );
};

export default CableSizingPage;
