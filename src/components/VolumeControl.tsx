import { FiVolume2 } from 'react-icons/fi';

interface VolumeControlProps {
  volume: number;
  onChange: (volume: number) => void;
}

export default function VolumeControl({ volume, onChange }: VolumeControlProps) {
  return (
    <div className="hidden lg:flex items-center gap-2 flex-1 max-w-xs justify-end">
      <FiVolume2 className="text-gray-600 w-5 h-5 flex-shrink-0" />
      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-600 hover:[&::-webkit-slider-thumb]:bg-gray-700"
        style={{
          background: `linear-gradient(to right, #4b5563 0%, #4b5563 ${volume}%, #e5e7eb ${volume}%, #e5e7eb 100%)`,
        }}
      />
    </div>
  );
}
