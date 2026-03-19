"use client";

interface DurationPickerProps {
  value: number;
  onChange: (days: number) => void;
}

export function DurationPicker({ value, onChange }: DurationPickerProps) {
  return (
    <div className="flex items-center gap-2">
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={5}>5</option>
        <option value={7}>7</option>
        <option value={14}>14</option>
        <option value={30}>30</option>
      </select>
      <span className="text-sm text-gray-600">Days</span>
    </div>
  );
}
