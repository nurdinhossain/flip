'use client';
import MapComponent from "@/components/Map";
import BarChartComponent from "@/components/BarChartComponent";
import LineChartComponent from "@/components/LineChartComponent";
import { useState, useEffect } from 'react';

interface TrashcanData {
  lastObjects: string[];
  capacity: number;
  lastTime: string[];
}

interface ChartData {
  name: string;
  value: number;
}

export default function Monitor() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [lineChartData, setLineChartData] = useState<ChartData[]>([]);
  const [trashcanData, setTrashcanData] = useState<TrashcanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filled, setFilled] = useState<number>(0);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/trashcans');
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const result = await response.json();

      let count = 0;
      if (result.success && result.data) {
        // Process the lastObjects data
        const objectCounts = result.data.lastObjects.reduce((acc: Record<string, number>, obj: string) => {
          acc[obj] = (acc[obj] || 0) + 1; // Ensure value is always a number
          count += 1;
          return acc;
        }, {});

        const capacity = result.data.capacity;
        const numToBeRounded = count / capacity;
        setFilled(Math.round(numToBeRounded * 100) / 100);

        // Convert to chart data format for bar chart
        const processedBarChartData: ChartData[] = Object.entries(objectCounts).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize name
          value: value as number, // Ensure value is typed as number
        }));

        setChartData(processedBarChartData);

        // Process data for line chart (time-based aggregation)
        const dateTimes = result.data.lastTime.map((dt: string) => new Date(dt));
        const startTime = Math.min(...dateTimes.map((dt: Date) => dt.getTime()));
        const buckets: Record<number, number> = {};

        dateTimes.forEach((dt: Date) => {
          const minutesSinceStart = Math.floor((dt.getTime() - startTime) / (1000 * 60));
          const bucketKey = Math.floor(minutesSinceStart / 2); // Group into 2-minute buckets
          buckets[bucketKey] = (buckets[bucketKey] || 0) + 1; // Increment trash count for this bucket
        });

        const processedLineChartData: ChartData[] = Object.entries(buckets).map(([bucket, value]) => ({
          name: `${Number(bucket) * 2} min`, // Convert bucket to readable time interval
          value: value as number,
        }));

        setLineChartData(processedLineChartData);
        setTrashcanData(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data from the API
  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(), 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (loading) return <p className="text-white text-center mt-4">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;
  
  return (
    <div className="absolute top-0 z-[0] h-screen w-screen overflow-hidden bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]">
      <h1 className="text-white font-bold text-4xl underline m-4">Dashboard</h1>

      <div className="flex h-screen max-w-screen p-4 gap-4 box-border">
        {/* Map Container */}
        <div className="w-[50%] h-full p-4 bg-white border border-gray-300 rounded-lg shadow-md box-border">
          <MapComponent />
        </div>

        {/* Content Container */}
        <div className="flex-grow p-4 mb-8 bg-white border border-gray-300 rounded-lg shadow-md box-border overflow-auto">
          <div className="flex flex-row justify-between">
            <h1 className="text-xl font-bold mb-4">FlipCan #1942</h1>
            <h1 className="text-xl font-bold mb-4">Location: Rice Hall</h1>
            <h1 className="text-xl font-bold mb-4">Filled: {filled}%</h1>
          </div>
          <BarChartComponent data={chartData} xAxisKey="name" yAxisKey="value" />
          <LineChartComponent data={lineChartData} xAxisKey="name" yAxisKey="value" />
        </div>
      </div>
    </div>
  );
}