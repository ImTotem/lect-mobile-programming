interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onChange: (time: number) => void;
}

export default function ProgressBar({
  currentTime,
  duration,
  onChange,
}: ProgressBarProps) {
  const progress = (currentTime / duration) * 100;

  return (
    <div className="relative w-full h-1 bg-gray-200">
      <div
        className="absolute top-0 left-0 h-full bg-red-500 transition-all"
        style={{ width: `${progress}%` }}
      />
      <input
        type="range"
        min="0"
        max={duration}
        value={currentTime}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
      />
      {/* Thumb */}
      <div
        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full shadow-md pointer-events-none transition-all"
        style={{ left: `calc(${progress}% - 6px)` }}
      />
    </div>
  );
}
