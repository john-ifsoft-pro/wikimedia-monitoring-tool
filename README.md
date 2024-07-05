# Wikimedia-Stream-Monitor

Design and implement an web-based user interface for monitoring the Wikimedia event stream. Client-Server setup where the client runs on port 3000 and the server on port 4000.

You receive json objects from `https://stream.wikimedia.org/v2/stream/recentchange` and show them in user interface. You can filter them and unpack each one.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Instructions to Build and Run Locally

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/wikimedia-stream-monitor.git
    cd wikimedia-stream-monitor
    ```

2. Install dependencies for the backend and start the server:

    ```bash
    cd server
    npm install
    node server.js
    ```

3. Install dependencies for the frontend and start the React application:

    ```bash
    cd client
    npm install
    npm start
    ```

4. Open your browser and navigate to `http://localhost:3000` to see the application running.

## Hypothetical Scenario: Tracking Edits When the Browser Window Isn’t Open
Now you want this tool to track these edits even when the browser
window isn’t open. How would you change the design of this tool? What would need to change in the
backend? How would the front-end design have to change? Are there scaling concerns if there are multiple
users?

To track edits when the browser window isn't open, we need to persist the edits on the backend into some database. To provide filtering on the frontend, we might need to store the entire stream without any filters applied to the database. On the backend, I would redesign the services:
- PersistService
- HttpService
- WikiService
- Event Filter/Transform Pipeline
- EventBus / EventQueue

**WikiService** will be running as a sepearte job and will constantly fetch the events and publish the stream to **EventQueue**. **PersistentService** will subscribe to the bus and will store the events into the db.
The **HttpService** will receive frontend requests and initiates SSE or WS connection. It will start subscribing to the EventQueue and construct the event fitler/transform pipeline using the filters received from client. 
And to furthur improve UX, we can implement PWA features (service workers, notification api) so that even when the browser is not open, it will receive notification from the server. Might need to add authentication and caching.