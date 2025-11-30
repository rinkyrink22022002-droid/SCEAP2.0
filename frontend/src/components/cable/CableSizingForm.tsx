// frontend/src/components/cable/CableSizingForm.tsx
import React, { useState } from 'react';
import type { CableInput } from '../../types/cable';

interface Props {
  onCalculate: (payload: CableInput) => void;
  loading: boolean;
}

const defaultCSAOptions = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240];

interface FormState {
  cable_number: string;
  load_kw: number;
  load_kva: number;
  current: number;
  voltage: number;
  pf: number;
  eff: number;
  length: number;
  mv_per_a_m: number;
  derating1: number;
  derating2: number;
  sc_current: number;
  sc_time: number;
  k_const: number;
}

interface FormErrors {
  [key: string]: string;
}

const validateForm = (form: FormState): FormErrors => {
  const errors: FormErrors = {};

  if (!form.cable_number.trim()) {
    errors.cable_number = 'Cable number is required';
  }

  if (form.voltage <= 0) {
    errors.voltage = 'Voltage must be positive';
  }

  if (form.load_kw < 0 && form.load_kva < 0 && form.current < 0) {
    errors.load = 'Enter at least one of: Load (kW), Load (kVA), or Current';
  }

  if (form.length < 0) {
    errors.length = 'Length cannot be negative';
  }

  if (form.mv_per_a_m < 0) {
    errors.mv_per_a_m = 'mV/A/m must be non-negative';
  }

  if (form.pf <= 0 || form.pf > 1) {
    errors.pf = 'Power factor must be between 0 and 1';
  }

  if (form.eff <= 0 || form.eff > 1) {
    errors.eff = 'Efficiency must be between 0 and 1';
  }

  if (form.derating1 <= 0 || form.derating2 <= 0) {
    errors.derating = 'Derating factors must be positive';
  }

  return errors;
};

const CableSizingForm: React.FC<Props> = ({ onCalculate, loading }) => {
  const [form, setForm] = useState<FormState>({
    cable_number: 'CBL-001',
    load_kw: 55,
    load_kva: 0,
    current: 0,
    voltage: 415,
    pf: 0.85,
    eff: 0.95,
    length: 100,
    mv_per_a_m: 0.44,
    derating1: 1.0,
    derating2: 0.9,
    sc_current: 8000,
    sc_time: 1,
    k_const: 115,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? 0 : Number(value);
    
    setForm((prev) => ({
      ...prev,
      [name]: Number.isNaN(numValue) ? value : numValue,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => new Set([...prev, name]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm(form);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const payload: CableInput = {
      cable_number: form.cable_number,
      load_kw: form.load_kw || 0,
      load_kva: form.load_kva || 0,
      current: form.current || 0,
      voltage: form.voltage,
      pf: form.pf || 1,
      eff: form.eff || 1,
      length: form.length,
      mv_per_a_m: form.mv_per_a_m,
      derating_factors: [form.derating1 || 1, form.derating2 || 1],
      csa_options: defaultCSAOptions,
      sc_current: form.sc_current || 0,
      sc_time: form.sc_time || 1,
      k_const: form.k_const || 115,
    };

    onCalculate(payload);
  };

  const inputClass = (fieldName: string) => {
    const hasError = touched.has(fieldName) && errors[fieldName];
    return `w-full px-2 py-1.5 rounded-lg bg-sceap-panel/70 border ${
      hasError ? 'border-rose-500/60' : 'border-sceap-border'
    } focus:outline-none focus:border-sceap-accent-soft text-xs transition-colors`;
  };

  const renderInputField = (label: string, name: keyof FormState, type: string = 'number', step?: string) => {
    const hasError = touched.has(name) && errors[name];
    return (
      <div>
        <label className="block text-[11px] text-slate-400 mb-1">
          {label}
          {hasError && <span className="text-rose-400 ml-1">*</span>}
        </label>
        <input
          name={name}
          type={type}
          step={step}
          value={form[name]}
          onChange={handleChange}
          onBlur={handleBlur}
          className={inputClass(name)}
        />
        {hasError && (
          <span className="text-[10px] text-rose-400 mt-0.5 block">{errors[name]}</span>
        )}
      </div>
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-black/30 border border-sceap-border rounded-2xl p-4 md:p-5 space-y-4 backdrop-blur-2xl"
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">Single Feeder Sizing</h2>
          <p className="text-xs text-slate-400">
            Enter load &amp; circuit details — engine will size, check Vdrop &amp; SC.
          </p>
        </div>
        <span className="rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-1 border border-emerald-500/30">
          Live • IEC style
        </span>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px]">
          Please fix the errors above before calculating.
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="col-span-2">
          {renderInputField('Cable Number', 'cable_number', 'text')}
        </div>

        <div>
          {renderInputField('Load (kW)', 'load_kw')}
        </div>

        <div>
          {renderInputField('Load (kVA)', 'load_kva')}
        </div>

        <div>
          {renderInputField('Current (A)', 'current')}
        </div>

        <div>
          {renderInputField('Voltage (V)', 'voltage')}
        </div>

        <div>
          {renderInputField('Power Factor', 'pf', 'number', '0.01')}
        </div>

        <div>
          {renderInputField('Efficiency', 'eff', 'number', '0.01')}
        </div>

        <div>
          {renderInputField('Length (m)', 'length')}
        </div>

        <div>
          {renderInputField('mV / A / m', 'mv_per_a_m', 'number', '0.001')}
        </div>

        <div>
          {renderInputField('Derating 1', 'derating1', 'number', '0.01')}
        </div>

        <div>
          {renderInputField('Derating 2', 'derating2', 'number', '0.01')}
        </div>

        <div>
          {renderInputField('SC Current (A)', 'sc_current')}
        </div>

        <div>
          {renderInputField('SC Time (s)', 'sc_time')}
        </div>

        <div>
          {renderInputField('k Constant', 'k_const')}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-1 py-2 rounded-xl bg-gradient-to-r from-sceap-accent-soft to-sky-500 text-xs font-semibold text-slate-950 shadow-soft-glow hover:opacity-95 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition"
      >
        {loading ? 'Calculating…' : '⚡ Run Cable Sizing Engine'}
      </button>
    </form>
  );
};

export default CableSizingForm;
