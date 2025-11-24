import ChartCard from './ChartCard';
import type { Chart } from '../../types/explore';

interface TopChartsSectionProps {
  charts: Chart[];
  onChartClick?: (chart: Chart) => void;
}

export default function TopChartsSection({
  charts,
  onChartClick,
}: TopChartsSectionProps) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">인기 차트</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {charts.map((chart) => (
          <ChartCard
            key={chart.id}
            chart={chart}
            onClick={() => onChartClick?.(chart)}
          />
        ))}
      </div>
    </section>
  );
}
