# Backend WebSocket React App

This is the backend part of the WebSocket React application. It is built using Node.js and Express, and it utilizes WebSocket for real-time communication.

## Project Structure

- **src/**
  - **server.js**: Entry point for the backend server. Sets up the Express server and initializes WebSocket functionality.
  - **websocket.js**: Manages WebSocket connections and handles incoming messages.

## Installation

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install the dependencies:
   ```
   npm install
   ```

## Running the Server

To start the backend server, run the following command:
```
npm start
```

The server will be running on `http://localhost:5000` (or the port specified in your configuration).

## WebSocket Functionality

The backend uses WebSocket to allow real-time communication between clients. The `websocket.js` file contains the logic for handling connections and broadcasting messages to connected clients.

## API Endpoints

- **GET /**: Returns a simple message indicating the server is running.

## License

This project is licensed under the MIT License.