# WebSocket React App

This project is a simple WebSocket application built with Node.js for the backend and React for the frontend. It allows users to input their username through a popup modal and establishes a WebSocket connection to communicate with the server.

## Project Structure

```
websocket-react-app
├── backend
│   ├── src
│   │   ├── server.js          # Entry point for the backend server
│   │   └── websocket.js       # Manages WebSocket connections
│   ├── package.json           # Backend dependencies and scripts
│   └── README.md              # Documentation for the backend
├── frontend
│   ├── public
│   │   └── index.html         # Main HTML file for the React app
│   ├── src
│   │   ├── App.js             # Main component of the React application
│   │   ├── components
│   │   │   └── Popup.js       # Popup component for username input
│   │   ├── index.js           # Entry point for the React application
│   │   └── websocket.js       # Manages WebSocket connections from the frontend
│   ├── package.json           # Frontend dependencies and scripts
│   └── README.md              # Documentation for the frontend
└── README.md                  # Overall documentation for the project
```

## Getting Started

### Prerequisites

- Node.js
- npm (Node Package Manager)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd websocket-react-app
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   node src/server.js
   ```

2. Start the frontend application:
   ```
   cd frontend
   npm start
   ```

### Usage

- Open your browser and navigate to `http://localhost:3000`.
- A popup will appear prompting you to enter your username.
- After entering your username, you can interact with the WebSocket server.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes. 

## License

This project is licensed under the MIT License.