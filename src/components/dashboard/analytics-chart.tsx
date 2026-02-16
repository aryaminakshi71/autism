type ChartPoint = { name: string; value: number };

export function AnalyticsChart({ data }: { data: ChartPoint[] }) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 font-semibold text-lg">Activity This Week</h2>
      <div className="flex h-64 items-end gap-4">
        {data.map((day) => (
          <div key={day.name} className="flex flex-1 flex-col items-center">
            <div className="flex w-full flex-col items-center">
              <div
                className="w-full rounded-t bg-indigo-600"
                style={{ height: `${(day.value / maxValue) * 200}px` }}
              />
              <span className="mt-2 text-gray-600 text-xs">{day.value}</span>
            </div>
            <span className="mt-2 text-gray-500 text-xs">{day.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnalyticsChart;
