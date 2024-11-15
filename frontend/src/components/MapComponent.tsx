import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from 'axios';

// Make sure to define the Mapbox Access Token type
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || "";

interface MillData {
  millName: string;
  latitude: number;
  longitude: number;
  p1Amount: number;
  numTransactions: number;
  p1PriceTon: number;
  lastTransactionDate: string;
}

interface MapComponentProps {}

const MapComponent: React.FC<MapComponentProps> = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [pksMarkers, setPksMarkers] = useState<mapboxgl.Marker[]>([]);
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [capacity, setCapacity] = useState<string>("");
  const [status, setStatus] = useState<string>("active");
  const [mills, setMills] = useState<MillData[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchMills = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/mills');
        console.log(response.data)
        setMills(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching mills data:', error);
        setLoading(false);
      }
    };

    fetchMills();
  }, []);

  useEffect(() => {
    if (mapContainerRef.current) {
      // Initialize the map
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [8.183427, 5.609851], // Center on the approximate location of the mills
        zoom: 10,
      });

      mapRef.current.on("load", () => {
        // Plot mills on the map
mills.forEach((mill: MillData) => {
          const {
            millName,
            latitude,
            longitude,
            p1Amount,
            numTransactions,
            p1PriceTon,
            lastTransactionDate,
          } = mill;

          // Determine the color based on the transaction date
          const lastDate = new Date(lastTransactionDate);
          const daysAgo =
            (Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
          let color = "red"; // older than two weeks
          if (daysAgo <= 7) color = "green";
          else if (daysAgo <= 14) color = "yellow";

          // Create a marker with the color
          const marker = new mapboxgl.Marker({ color }).setLngLat([
            longitude,
            latitude,
          ]);

          // Add the marker to the map only if mapRef.current is not null
          if (mapRef.current) {
            marker.addTo(mapRef.current);
          }

          // Set the popup content directly on the marker
          const popup = new mapboxgl.Popup().setHTML(`
            <strong>${millName}</strong>
            <p>P1 Amount: ${p1Amount} tons</p>
            <p>Price per Ton: ${p1PriceTon}</p>
            <p>Transactions: ${numTransactions}</p>
            <p>Last Transaction: ${lastTransactionDate}</p>
          `);

          marker.setPopup(popup); // Associate the popup with the marker
          if (mapRef.current) {
            marker.addTo(mapRef.current); // Add marker to the map
          }
        });
      });
    }

    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, [mills]);

  // Function to add PKS dumpsite
  const addPKSDumpsite = (
    latitude: string,
    longitude: string,
    capacity: number,
    status: string
  ) => {
    const marker = new mapboxgl.Marker({
      color: status === "active" ? "blue" : "gray",
    })
      .setLngLat([parseFloat(longitude), parseFloat(latitude)])
      .addTo(mapRef.current!);
    marker.setPopup(
      new mapboxgl.Popup().setHTML(`
        <strong>PKS Dumpsite</strong>
        <p>Capacity: ${capacity} tons</p>
        <p>Status: ${status}</p>
      `)
    );
    setPksMarkers([...pksMarkers, marker]);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (latitude && longitude && capacity) {
      addPKSDumpsite(longitude, latitude, parseInt(capacity), status);
      // Reset form
      setLatitude("");
      setLongitude("");
      setCapacity("");
      setStatus("active");
    } else {
      alert("Please fill in all the fields!");
    }
  };

  return (
    <div>
      <div ref={mapContainerRef} style={{ height: "100vh", width: "100%" }} />

      {/* Form to Add PKS Dumpsite */}
      <form
        onSubmit={handleSubmit}
        className="absolute top-10 left-1/2 transform -translate-x-1/2 lg:left-10 lg:transform-none bg-white p-6 rounded-lg shadow-lg max-w-md lg:w-[30%] mx-auto w-11/12 z-10"
      >
        <h2 className="text-xl font-semibold mb-4">Add PKS Dumpsite</h2>

        {/* Latitude Input */}
        <div className="mb-4">
          <label htmlFor="latitude" className="block text-gray-700">
            Latitude:
          </label>
          <input
            type="text"
            id="latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md mt-1"
          />
        </div>

        {/* Longitude Input */}
        <div className="mb-4">
          <label htmlFor="longitude" className="block text-gray-700">
            Longitude:
          </label>
          <input
            type="text"
            id="longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md mt-1"
          />
        </div>

        {/* Capacity Input */}
        <div className="mb-4">
          <label htmlFor="capacity" className="block text-gray-700">
            Capacity (tons):
          </label>
          <input
            type="number"
            id="capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md mt-1"
          />
        </div>

        {/* Status Dropdown */}
        <div className="mb-6">
          <label htmlFor="status" className="block text-gray-700">
            Status:
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mt-1"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
        >
          Add PKS Dumpsite
        </button>
      </form>
    </div>
  );
};

export default MapComponent;
