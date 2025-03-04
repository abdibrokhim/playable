# Random Tune Harmony

A web application that allows users to listen to music while chatting with random people, similar to Omegle but with music integration.

## Features

- Music player with curated tracks
- Real-time chat with randomly matched users
- Preference-based matching (match with male, female, or any user)
- Typing indicators
- Responsive design for mobile and desktop

## Project Structure

- `/src` - Frontend React application
- `/server` - WebSocket server for chat functionality

## Prerequisites

- Node.js (v14+ recommended)
- npm or yarn

## Setup & Installation

### Frontend

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory and add:
   ```
   VITE_SOCKET_SERVER_URL=http://localhost:3001
   ```

3. Start the development server:
   ```
   npm run dev
   ```

### Backend (WebSocket Server)

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

## Running the Application

1. Start the WebSocket server (in `/server` directory)
   ```
   npm start
   ```

2. In a separate terminal, start the frontend application (in root directory)
   ```
   npm run dev
   ```

3. Open your browser and navigate to the URL shown in your terminal (typically http://localhost:5173)

## Deployment

### Frontend

The frontend application can be built for production using:
```
npm run build
```

The resulting files in the `dist` directory can be deployed to any static hosting service like Vercel, Netlify, or GitHub Pages.

### Backend

The WebSocket server can be deployed to platforms like Heroku, Render, or any other Node.js hosting service.

Remember to update the `VITE_SOCKET_SERVER_URL` environment variable in your frontend deployment to point to your deployed WebSocket server.