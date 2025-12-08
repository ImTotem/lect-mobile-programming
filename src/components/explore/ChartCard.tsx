import { FiTrendingUp } from 'react-icons/fi';
import type { Chart } from '../../types/explore';

interface ChartCardProps {
  chart: Chart;
  onClick?: () => void;
}

export default function ChartCard({ chart, onClick }: ChartCardProps) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-4 bg-white hover:bg-gray-50 rounded-lg p-4 transition-all hover:scale-[1.02] shadow-sm hover:shadow-md border border-gray-200"
    >
      <img
        src={chart.thumbnail}
        alt={chart.title}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          e.currentTarget.parentElement?.querySelector('.flex-1')?.classList.add('pl-2'); // Add padding if image gone? Or just hide it.
          // Actually, hiding the image is fine, the text will shift left or stay.
          // In this flex layout, hiding img (w-16) will shift text left.
        }}
        className="w-16 h-16 rounded-lg object-cover shadow-sm"
      />
      <div className="flex-1 text-left">
        <h3 className="font-semibold text-gray-900 mb-1">{chart.title}</h3>
        <p className="text-sm text-gray-600">{chart.country}</p>
      </div>
      <div className="flex items-center gap-2 text-gray-500">
        <FiTrendingUp className="w-5 h-5" />
        <span className="text-sm font-medium">{chart.songs}곡</span>
      </div>
    </button>
  );
}
