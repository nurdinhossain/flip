'use client';
import MapComponent from "@/components/Map";
import BarChartComponent from "@/components/BarChartComponent";
import ChartData from "@/components/ChartData";
import LineChartComponent from "@/components/LineChartComponent";

// Sample data for the chart
const data: ChartData[] = [
    { name: 'Cardboard', value: 3 },
    { name: 'Glass', value: 2 },
    { name: 'Paper', value: 1 },
    { name: 'Plastic', value: 3 },
    { name: 'Landfill', value: 5 }
];

export default function Monitor() {
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
                        <h1 className="text-xl font-bold mb-4">Filled: 60%</h1>
                    </div>
                    <BarChartComponent data={data} xAxisKey="name" yAxisKey="value" />
                    <LineChartComponent data={data} xAxisKey="name" yAxisKey="value" />
                </div>
            </div>
        </div>
    );
}