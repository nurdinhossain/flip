'use client';
import MapComponent from "@/components/Map";

export default function Monitor() {
    return (
        <div className="absolute top-0 z-[0] h-screen w-screen overflow-hidden bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]">
            <h1 className="text-white text-4xl underline m-4">Dashboard</h1>

            <div className="flex h-screen max-w-screen p-4 gap-4 box-border">
                {/* Map Container */}
                <div className="w-[50%] h-full p-4 bg-white border border-gray-300 rounded-lg shadow-md box-border">
                    <MapComponent />
                </div>

                {/* Content Container */}
                <div className="flex-grow p-4 bg-white border border-gray-300 rounded-lg shadow-md box-border">
                    <h1 className="text-xl font-bold mb-4">Dashboard Content</h1>
                    <p>Add your additional components or content here.</p>
                </div>
            </div>
        </div>
    );
}