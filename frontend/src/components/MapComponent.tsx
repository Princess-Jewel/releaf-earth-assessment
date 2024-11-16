import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";
import LoadingSpinner from "../helpers/Loader";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || "";

interface MillData {
  id?: string;
  millName: string;
  latitude: number;
  longitude: number;
  capacity?: number;
  p1Amount?: number;
  numTransactions?: number;
  p1PriceTon?: number;
  lastTransactionDate?: Date;
  status?: string;
}

interface MapComponentProps {}

const MapComponent: React.FC<MapComponentProps> = () => {

  const BASEURL = process.env.REACT_APP_BASE_URL

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
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [editMarkerId, setEditMarkerId] = useState<string | null>(null); // Stores marker ID for updates
  const [pksDumpsites, setPksDumpsites] = useState<
    {
      id: string;
      latitude: number;
      longitude: number;
      capacity: number;
      status: string;
    }[]
  >([]);

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  const fetchMills = async () => {
    try {
  
      const response = await axios.get(`${BASEURL}/mills`
      );

      setMills(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching mills data:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
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
            id,
            millName,
            latitude,
            longitude,
            p1Amount,
            numTransactions,
            p1PriceTon,
            lastTransactionDate,
          } = mill;

          // Determine the color based on the transaction date
          const lastDate = new Date(
            lastTransactionDate ?? new Date().toISOString()
          );
          const daysAgo =
            (Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
          let color = "red"; // older than two weeks
          if (daysAgo <= 7) color = "blue";
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
             <p>Id: ${id}</p>
         
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
  const addPKSDumpsite = async (
    // millName: string,
    latitude: number,
    longitude: number,
    capacity: number,
    status: string
  ) => {
    try {
      // Prepare the data to be sent to the backend
      const dumpsiteData = {
        millName: "PKS Dumpsite",
        latitude,
        longitude,
        capacity,
        status,
      };

      // Call the backend API to create a new dumpsite
      const response = await fetch(`${BASEURL}/mills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dumpsiteData),
      });

      if (!response.ok) {
        throw new Error("Failed to save dumpsite to the backend");
      }

      // Parse the response to get the newly created dumpsite, including its ID
      const createdDumpsite = await response.json();

      const {
        _id: newId,
        latitude: newLatitude,
        longitude: newLongitude,
        capacity: newCapacity,
        status: newStatus,
      } = createdDumpsite.data;

      // Add the marker on the map
      const marker = new mapboxgl.Marker({})
        .setLngLat([longitude, latitude])
        .addTo(mapRef.current!);

      const popupHTML = `
        <strong>PKS Dumpsite</strong>
        <p>Capacity: ${capacity} tons</p>
        <p>Status: ${status}</p>
      `;

      const popup = new mapboxgl.Popup().setHTML(popupHTML);

      marker.setPopup(popup);

      popup.on("open", () => {
        setIsPopupOpen(true);
      });

      popup.on("close", () => {
        setIsPopupOpen(false);
      });

      // Save the dumpsite details, including the ID, to state
      setPksDumpsites((prevDumpsites) => [
        ...prevDumpsites,
        {
          id: newId, // Use the id from the backend
          latitude: newLatitude,
          longitude: newLongitude,
          capacity: newCapacity,
          status: newStatus,
        },
      ]);

      setPksMarkers([...pksMarkers, marker]);
    } catch (error) {
      console.error("Error adding dumpsite:", error);
      // alert("Failed to add the dumpsite. Please try again.");
    }
  };

  const updatePKSDumpsite = (editMarkerId: string, markerData: any) => {
    // const marker = pksDumpsites.find((marker) => marker.id === editMarkerId);

    // Add the marker on the map
    const marker = new mapboxgl.Marker({})
      .setLngLat([markerData.longitude, markerData.latitude])
      .addTo(mapRef.current!);

    const popupHTML = `
      <strong>PKS Dumpsite</strong>
      <p>Capacity: ${markerData.capacity} tons</p>
      <p>Status: ${markerData.status}</p>
    `;

    const popup = new mapboxgl.Popup().setHTML(popupHTML);

    marker.setPopup(popup);

    popup.on("open", () => {
      setIsPopupOpen(true);
    });

    popup.on("close", () => {
      setIsPopupOpen(false);
    });
  };

  const startEditing = (dumpsiteData: {
    id: string;
    millName: string;
    latitude: string;
    longitude: string;
    capacity: string;
    status: string;
  }) => {
    setLatitude(dumpsiteData.latitude.toString());
    setLongitude(dumpsiteData.longitude.toString());
    setCapacity(dumpsiteData.capacity.toString());
    setStatus(dumpsiteData.status ?? "active");
    toggleFormVisibility(); // Show the form for editing
  };

  // Assuming you want to edit a dumpsite by its `id`
  const editDumpsite = (id: string) => {
    setEditMarkerId(id);

    // Find the dumpsite by id in the array
    const dumpsiteToEdit = pksDumpsites.find((dumpsite) => dumpsite.id === id);

    if (dumpsiteToEdit) {
      // Call startEditing with the dumpsite data
      startEditing({
        id: dumpsiteToEdit.id,
        millName: "PKS Dumpsite",
        latitude,
        longitude,
        capacity,
        status,
      });
    } else {
      console.error(`Dumpsite with id ${id} not found`);
    }
  };

  // Function to handle the form submission for adding a new marker (POST request)
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (latitude && longitude && capacity) {
      try {
        // Call the addPKSDumpsite function to handle the backend POST and frontend marker update
        await addPKSDumpsite(
          parseFloat(latitude),
          parseFloat(longitude),
          parseFloat(capacity),
          status
        );

        // Reset form after successful submission
        setLatitude("");
        setLongitude("");
        setCapacity("");
        setStatus("active");
        setLoading(false);
        setIsPopupOpen(false);
        setIsFormVisible(false);
      } catch (error) {
        console.error("Error during submission:", error);
        setLoading(false);
        alert("Failed to add the dumpsite. Please try again.");
      }
    } else {
      alert("Please fill in all fields");
    }
  };

  // Function to handle the form submission for updating an existing marker (PUT request)
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setLoading(true);
    // Check if all required fields are filled out
    if (!latitude || !longitude || !capacity) {
      alert("Please fill in all fields");
      return;
    }

    const markerData = {
      millName: "PKS Dumpsite", // Keep the millName static, or change if needed
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      capacity: parseFloat(capacity),
      status,
    };

    try {
      // Send the PUT request to update the existing marker
      const response = await fetch(
        `${BASEURL}/mills/${editMarkerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(markerData), // Send the updated data
        }
      );

      // Check if the response is successful
      if (!response.ok) {
        throw new Error("Error updating the marker. Please try again.");
      }

      // Parse the response JSON to get the updated dumpsite data
      await response.json();

      // Update the UI and map marker after the PUT request succeeds

      updatePKSDumpsite(editMarkerId as string, markerData);

      // Update the dumpsite in state (if needed)
      setPksDumpsites((prevDumpsites) =>
        prevDumpsites.map((dumpsite) =>
          dumpsite.id === editMarkerId
            ? { ...dumpsite, ...markerData } // Update the specific dumpsite with the new data
            : dumpsite
        )
      );

      // Reset form inputs and state
      setLatitude("");
      setLongitude("");
      setCapacity("");
      setStatus("active"); // Reset status to default
      setIsPopupOpen(false);
      setIsFormVisible(false);
      setEditMarkerId(null);
      setLoading(false);
    } catch (error) {
      // Handle any errors that occur during the request
      console.error("Request error during update:", error);
      setLoading(false);
      alert("An error occurred while updating the marker. Please try again.");
    }
  };

  return (
    <div>
      <div ref={mapContainerRef} style={{ height: "100vh", width: "100%" }} />
      {/* Toggle Button for Mobile Only */}

      <button
        onClick={() => {
          toggleFormVisibility();
        }}
        className="lg:hidden bg-blue-500 text-white px-4 py-2 rounded-md fixed bottom-10 right-5 z-20"
      >
        {isPopupOpen
          ? "Close PKS Dumpsite Form"
          : isFormVisible
          ? "Close PKS Dumpsite Form"
          : "Add PKS Dumpsite"}
      </button>

      {/* Form to Add PKS Dumpsite */}
      {(isFormVisible || window.innerWidth >= 1024) && (
        <form
          onSubmit={handleAddSubmit}
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
            {loading ? <LoadingSpinner /> : "Add PKS Dumpsite"}
          </button>
        </form>
      )}

      {/* Form to Edit PKS Dumpsite */}
      {isPopupOpen && pksDumpsites.length > 0 && (
        <form
          onSubmit={handleUpdateSubmit}
          className="absolute top-10 left-1/2 transform -translate-x-1/2 lg:left-10 lg:transform-none bg-white p-6 rounded-lg shadow-lg max-w-md lg:w-[30%] mx-auto w-11/12 z-10"
        >
          <h2 className="text-xl font-semibold mb-4">Edit PKS Dumpsite</h2>

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

          {pksDumpsites.map((dumpsite) => (
            <button
              // type='submit'
              key={dumpsite.id}
              onClick={() => {
                editDumpsite(dumpsite.id); // Trigger the editDumpsite function with the specific dumpsite's id
              }}
              className="bg-blue-500 w-full text-white py-2 rounded-md hover:bg-blue-600"
            >
              {loading ? <LoadingSpinner /> : "Update PKS Dumpsite"}
            </button>
          ))}
        </form>
      )}
    </div>
  );
};

export default MapComponent;
