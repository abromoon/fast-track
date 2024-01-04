import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function ChartComponent({ data }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');

    const chart = new Chart(ctx, {
      type: 'bar',
      data: data,
    });

    return () => {
      chart.destroy();
    };
  }, [data]);

  return (
    <div>
      <canvas ref={chartRef} width="400" height="400" />
    </div>
  );
}