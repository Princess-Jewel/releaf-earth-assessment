
# **PKS Dumpsite Management System**

The PKS Dumpsite Management System is a full-stack application designed to manage, display, and update dumpsite information. The system includes a dynamic map-based frontend interface using React and Mapbox and a robust backend powered by Node.js and Express. It uses **Mapbox GL** for interactive map rendering, **TailwindCSS** for styling, and **TypeScript** for type safety and improved development experience. The project allows users to visualize mill data and PKS dumpsites with color-coded markers and popups that contain relevant information about each location.

## Features

- **Map Markers for Mills:** Display mills with information such as mill name, transaction data, and status.
- **PKS Dumpsites:** Users can add PKS dumpsites to the map, with custom data fields for location, capacity, and status.
- **Color-Coded Markers:** Markers are color-coded based on the last transaction date of the mill (Green for recent, Yellow for older than one week, Red for older than two weeks).
- **Interactive Map:** Click on markers to view popups with detailed information about each mill or dumpsite.

## **Features**

### **Frontend**
- Interactive map with dynamic markers and popups (Mapbox).
- Add new dumpsites with details such as latitude, longitude, capacity, and status.
- Edit existing dumpsite information.
- Responsive forms for adding and editing dumpsites.
- Real-time updates with smooth UI interactions.

### **Backend**
- RESTful API to handle CRUD operations for dumpsites.
- Secure data handling with validation.
- Integration with a database (MongoDB or any preferred DB).
- Error handling and meaningful API responses.

---

## Tech Stack


### **Frontend**
- **React**: For building the user interface.
- **Mapbox GL**: For interactive maps.
- **TailwindCSS**: For styling components.

### **Backend**
- **Node.js**: Runtime environment.
- **Express.js**: Backend framework.
- **MongoDB**: Database for persisting dumpsite data.
- **Mongoose**: ODM for MongoDB.

---

## Setup Instructions

To get the project up and running locally, follow these steps:

### 1. Clone the repository

git clone [https://github.com/Princess-Jewel/releaf-earth-assessment](https://github.com/Princess-Jewel/releaf-earth-assessment) 

### FRONTEND

cd frontend


### 1. Set up environment variables

Make sure to create a .env file in the root of the frontend folder and add your Mapbox access token.
You can use my access token:
REACT_APP_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoicHJpbmNlc3MtamV3ZWwiLCJhIjoiY20zZ2N1MDM2MDJ3eDJxc2Q2MTNzbzdoeSJ9.EQTDAJbtCb0cMZrQDsNOhw


npm install

### 2. Run the project

Start the development server:

run npm start 

This will start the project on http://localhost:3000, where you can interact with the map and add, fetch and update PKS dumpsites.

### BACKEND

cd backend



### 1. Set up environment variables

Make sure to create a .env file in the root of the backend folder and add the following 


DB_HOST=

DB_USER=

DB_PASSWORD=

DB_NAME=

DB_PORT=

PORT=

MONGO_URI=



run npm install

### 2. Run the project

Start the development server:

npm run dev


### API Endpoints
Base URL: http://localhost:4000/api

1. Get All Dumpsites
Method: GET
Endpoint: /mills

Response Data

[
  {
    "_id": "id123",
    "millName": "PKS Dumpsite",
    "latitude": 12.34,
    "longitude": 56.78,
    "capacity": 100,
    "status": "active"
  }
]


2. Add a New Dumpsite
Method: POST
Endpoint: /mills

Request Body

{
  "millName": "PKS Dumpsite",
  "latitude": 12.34,
  "longitude": 56.78,
  "capacity": 100,
  "status": "active"
}

3. Update a Dumpsite
Method: PUT
Endpoint: mills/:id

Request Body

{
  "latitude": 12.34,
  "longitude": 56.78,
  "capacity": 150,
  "status": "inactive"
}



### How to Use
Open the application in the browser.

Add a new dumpsite using the "Add PKS Dumpsite" form.

View added dumpsites as markers on the map.

Click on any marker to edit the dumpsite's details.


### Development Workflow

Run both servers concurrently:

Frontend: npm start (in frontend/)

Backend: npm run dev (in backend/)



###  Database Schema
The backend of this project leverages Mongoose, a powerful and flexible ODM (Object Data Modeling) library for MongoDB. The schema was carefully designed to handle the specific requirements of the application. The schema enforces required fields and unique constraints where applicable.
Default values and enumerations (like status) ensure data integrity.


### Code changes:

React components for frontend UI updates.

Node.js routes and controllers for backend API changes.

Database integration:

Ensure MongoDB is running locally or use a cloud-based MongoDB instance.

### Deployment Workflow

Backend is deployed on Railway[https://railway.app/](https://railway.app/) 

Frontend is deployed on Vercel[https://vercel.com/](https://vercel.com/) 

### Deployment Link Backend

[https://profound-strength-production.up.railway.app/api](https://profound-strength-production.up.railway.app/api) 


### Deployment Link Frontend

[https://releaf-earth-assessment.vercel.app/](https://releaf-earth-assessment.vercel.app/) 


