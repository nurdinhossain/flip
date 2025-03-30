import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';

const MapComponent: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);

  const INITIAL_CENTER: [number, number] = [
    -78.507980,
    38.033554
  ]
  const RICE_HALL: [number, number] = [
    -78.5108,
    38.0316
  ]
  const INITIAL_ZOOM = 13
  const [currentCenter, setCenter] = useState(INITIAL_CENTER)
  const [currentZoom, setZoom] = useState(INITIAL_ZOOM)

  useEffect(() => {
    mapboxgl.accessToken = process.env.mapbox_key;

    if (mapContainer.current) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/standard",
        center: currentCenter,
        zoom: currentZoom,
        maxZoom: 15
      });

      // Add zoom controls
      map.addControl(new mapboxgl.NavigationControl(), "top-left");

      // Update state
      map.on('move', () => {
        // get the current center coordinates and zoom level from the map
        const mapCenter = map.getCenter()
        const mapZoom = map.getZoom()

        // update state
        setCenter([mapCenter.lng, mapCenter.lat])
        setZoom(mapZoom)
      })

      // Add marker
      const marker1 = new mapboxgl.Marker()
        .setLngLat(RICE_HALL)
        .addTo(map);

      // Resize the map when its container changes size
      setTimeout(() => {
        map.resize();
      }, 200);

      // Clean up on unmount
      return () => map.remove();
    }
  }, []);

  return (
    <>
      <div className="border rounded p-2 mb-2 bg-gray-700 text-white text-md">
        Longitude: {currentCenter[0].toFixed(4)} | Latitude: {currentCenter[1].toFixed(4)} | Zoom: {currentZoom.toFixed(2)}
      </div>
      <div
        ref={mapContainer}
        className="h-full w-full rounded-lg"
      />
    </>
  );
};

export default MapComponent;