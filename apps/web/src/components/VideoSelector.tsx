'use client';

export type VideoSelectorOption = {
  id: string;
  label: string;
  icon: string;
  duration: string;
  platform: string;
  color: string;
};

type VideoSelectorProps = {
  title: string;
  description?: string;
  options: VideoSelectorOption[];
  selectedId?: string | null;
  onSelect: (option: VideoSelectorOption) => void;
};

export default function VideoSelector({ title, description, options, selectedId, onSelect }: VideoSelectorProps) {
  return (
    <div>
      <div className="mb-6 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          {description && <p className="text-sm text-slate-400 mt-1">{description}</p>}
        </div>
        <div className="rounded-2xl px-4 py-3 text-xs text-slate-300" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)' }}>
          Coming soon: trim, subtitles, cover selection, brand presets
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {options.map((option) => {
          const selected = selectedId === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option)}
              className="card p-6 text-left transition-all duration-200 hover:scale-[1.02]"
              style={{ border: `1px solid ${selected ? option.color : 'var(--border)'}`, boxShadow: selected ? `0 0 0 1px ${option.color}33` : undefined }}
            >
              <div className="text-4xl mb-3">{option.icon}</div>
              <h3 className="text-white font-semibold text-lg">{option.label}</h3>
              <p className="text-gray-400 text-sm mt-1">{option.duration}</p>
              <div className="mt-3 text-xs font-medium px-2 py-1 rounded inline-block" style={{ background: `${option.color}20`, color: option.color, border: `1px solid ${option.color}40` }}>
                {option.platform}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}