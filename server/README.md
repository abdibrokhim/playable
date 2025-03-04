# Random Tune Harmony Chat Server

This is the WebSocket server implementation for the Random Tune Harmony chat feature. It handles real-time communication between users and preference-based matching.

## Features

- WebSocket-based real-time chat
- Preference-based user matching (male, female, or no preference)
- Typing indicators
- Automatic disconnection handling

## Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   npm start
   ```

   For development with auto-restart:
   ```
   npm run dev
   ```

## Environment Variables

- `PORT`: The port on which the server will run (default: 3001)

## Client Integration

Make sure to set the WebSocket server URL in your client application. By default, the client will connect to `http://localhost:3001`.

In production, you should set the `VITE_SOCKET_SERVER_URL` environment variable in your client application to point to your deployed server. 