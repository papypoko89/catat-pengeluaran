import { CalendarDays } from "lucide-react";
import { PeriodMode, PeriodPreset, PeriodState } from "../types";
import { applyPreset, derivePeriodRange, updatePeriodMode } from "../utils/period";

const presetOptions: Array<{ label: string; value: PeriodPreset }> = [
  { label: "Bulan ini", value: "this-month" },
  { label: "Bulan lalu", value: "last-month" },
  { label: "Tahun ini", value: "this-year" },
  { label: "7 hari terakhir", value: "last-7-days" },
  { label: "30 hari terakhir", value: "last-30-days" },
  { label: "Custom", value: "custom" },
];

const modeOptions: Array<{ label: string; value: PeriodMode }> = [
  { label: "Bulanan", value: "month" },
  { label: "Custom Range", value: "range" },
  { label: "Tahunan", value: "year" },
];

type PeriodSelectorProps = {
  period: PeriodState;
  onChange: (period: PeriodState) => void;
};

export function PeriodSelector({ period, onChange }: PeriodSelectorProps) {
  const activeRange = derivePeriodRange(period);

  function handlePresetChange(preset: PeriodPreset) {
    if (preset === "custom") {
      onChange(updatePeriodMode(period, "range"));
      return;
    }

    onChange(applyPreset(preset));
  }

  function handleModeChange(mode: PeriodMode) {
    onChange(updatePeriodMode(period, mode));
  }

  return (
    <section className="period-panel" aria-label="Pilih periode rekap">
      <div className="period-panel-heading">
        <div className="period-icon">
          <CalendarDays size={18} />
        </div>
        <div>
          <span>Periode aktif</span>
          <strong>{activeRange.label}</strong>
        </div>
      </div>

      <div className="preset-chips" aria-label="Preset periode cepat">
        {presetOptions.map((preset) => (
          <button
            key={preset.value}
            type="button"
            className={period.preset === preset.value ? "active" : ""}
            onClick={() => handlePresetChange(preset.value)}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="segmented mode-tabs" aria-label="Mode periode">
        {modeOptions.map((mode) => (
          <button
            key={mode.value}
            type="button"
            className={period.mode === mode.value ? "active" : ""}
            onClick={() => handleModeChange(mode.value)}
          >
            {mode.label}
          </button>
        ))}
      </div>

      <div className="period-input-grid">
        {period.mode === "month" && (
          <label>
            <span>Bulan dan tahun</span>
            <input
              type="month"
              value={period.month}
              onChange={(event) =>
                onChange({
                  ...period,
                  mode: "month",
                  month: event.target.value,
                  year: event.target.value.slice(0, 4),
                  preset: "custom",
                })
              }
            />
          </label>
        )}

        {period.mode === "range" && (
          <>
            <label>
              <span>Tanggal mulai</span>
              <input
                type="date"
                value={period.startDate}
                onChange={(event) =>
                  onChange({
                    ...period,
                    mode: "range",
                    startDate: event.target.value,
                    preset: "custom",
                  })
                }
              />
            </label>
            <label>
              <span>Tanggal selesai</span>
              <input
                type="date"
                value={period.endDate}
                onChange={(event) =>
                  onChange({
                    ...period,
                    mode: "range",
                    endDate: event.target.value,
                    preset: "custom",
                  })
                }
              />
            </label>
          </>
        )}

        {period.mode === "year" && (
          <label>
            <span>Tahun</span>
            <input
              type="number"
              min="2000"
              max="2100"
              value={period.year}
              onChange={(event) =>
                onChange({
                  ...period,
                  mode: "year",
                  year: event.target.value,
                  preset: "custom",
                })
              }
            />
          </label>
        )}
      </div>
    </section>
  );
}
