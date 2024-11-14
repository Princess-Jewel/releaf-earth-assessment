# Map Markers for Mills and PKS Dumpsites

This project displays markers on a map for mills and Palm Kernel Shell (PKS) dumpsites. It uses **Mapbox GL** for interactive map rendering, **TailwindCSS** for styling, and **TypeScript** for type safety and improved development experience. The project allows users to visualize mill data and PKS dumpsites with color-coded markers and popups that contain relevant information about each location.

## Features

- **Map Markers for Mills:** Display mills with information such as mill name, transaction data, and status.
- **PKS Dumpsites:** Users can add PKS dumpsites to the map, with custom data fields for location, capacity, and status.
- **Color-Coded Markers:** Markers are color-coded based on the last transaction date of the mill (Green for recent, Yellow for older than one week, Red for older than two weeks).
- **Interactive Map:** Click on markers to view popups with detailed information about each mill or dumpsite.

## Technologies Used

- **Mapbox GL:** A powerful library for rendering interactive maps.
- **TailwindCSS:** A utility-first CSS framework for rapidly building custom designs.
- **TypeScript:** A statically typed superset of JavaScript, providing type safety and reducing runtime errors.

## Installation

To get the project up and running locally, follow these steps:

### 1. Clone the repository

git clone [https://github.com/Princess-Jewel/releaf-earth-assessment](https://github.com/Princess-Jewel/releaf-earth-assessment) 

### 2. Install dependencies

cd releaf_earth

npm install

### 3. Set up environment variables

Make sure to create a .env file in the root of the frontend folder and add your Mapbox access token.
You can use my access token:
REACT_APP_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoicHJpbmNlc3MtamV3ZWwiLCJhIjoiY20zZ2N1MDM2MDJ3eDJxc2Q2MTNzbzdoeSJ9.EQTDAJbtCb0cMZrQDsNOhw


### 4. Run the project

Start the development server:

run npm start 

This will start the project on http://localhost:3000, where you can interact with the map and add PKS dumpsites.
