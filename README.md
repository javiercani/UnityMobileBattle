# Street Clash: Battleground

Street Clash: Battleground is an arcade fighting game designed for mobile platforms. It offers fast-paced matches (3-5 minutes) with accessible yet strategic gameplay. Players choose from multiple characters with unique abilities, and each attack consumes the opponent's energy, requiring tactical resource management.

## Key Features

*   **Tactile Controls:** Intuitive mobile controls with a virtual joystick for movement and on-screen buttons for attacks.
*   **Strategic Gameplay:** Manage an energy bar for attacks; successful combos drain opponent's energy faster.
*   **Unique Characters:** Choose from a diverse roster of characters, each with unique abilities and fighting styles.
*   **Multiple Game Modes:**
    *   Real-time online multiplayer (1v1 or 2v2).
    *   Offline mode against AI for practice.
    *   Competitive events with global leaderboards.
*   **Vibrant Visuals:** Engaging 3D low-poly art style with colorful characters and dynamic environments.

## Target Audience

This game is designed for kids and teenagers (ages 6-16), featuring family-friendly content with a colorful and vibrant art style.

## Technology Stack

This project utilizes a modern web-based technology stack, wrapped with Capacitor for mobile deployment.

*   **Frontend (Client):**
    *   React
    *   Vite
    *   TypeScript
    *   Three.js (with `@react-three/fiber` and `@react-three/drei` for 3D graphics)
    *   Tailwind CSS
    *   Zustand (State Management)
    *   React Query (Data Fetching & Caching)
*   **Backend (Server):**
    *   Node.js
    *   Express.js
    *   TypeScript
    *   Drizzle ORM (for PostgreSQL)
    *   Passport.js (Authentication)
*   **Mobile Deployment:**
    *   Capacitor (to build native mobile applications for iOS and Android)
*   **Database:**
    *   PostgreSQL (compatible with Neon serverless Postgres)

## Project Structure

The project is organized into the following main directories:

*   `client/`: Contains the frontend React application built with Vite.
    *   `client/public/`: Static assets for the client (images, 3D models, sounds, fonts).
    *   `client/src/`: Source code for the React application.
*   `server/`: Houses the backend Express.js API.
*   `shared/`: Includes code intended to be used by both the client and server, such as data schemas or type definitions.
*   `android/`: The Android native project generated and managed by Capacitor. (An `ios/` directory would appear here if iOS was added as a target).
*   `attached_assets/`: Contains supplementary materials like game design documents.

## Getting Started

Follow these instructions to get a local copy of the project up and running for development and testing.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm (comes with Node.js) or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd <repository-folder>
    ```
2.  Install dependencies for both client and server:
    ```bash
    npm install
    ```
    (Or `yarn install` if you prefer yarn)

### Database Setup

This project uses PostgreSQL as its database, managed with Drizzle ORM. For development, you can use a local PostgreSQL instance or a cloud-based service like Neon.

1.  **Set up your PostgreSQL database.**
2.  **Configure the database connection:**
    Create a `.env` file in the `server/` directory (if not already present from a `.env.example` or similar) and add your database connection string:
    ```env
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"
    ```
    Replace `USER`, `PASSWORD`, `HOST`, `PORT`, and `DATABASE_NAME` with your actual database credentials.
3.  **Apply database schema:**
    Run the Drizzle Kit push command to synchronize your database schema with the one defined in the project:
    ```bash
    npm run db:push
    ```

### Running the Development Server

To start the development server (which typically runs both the client and server concurrently with hot-reloading):

```bash
npm run dev
```

This will usually start the client on a port like `http://localhost:5173` (Vite default) and the server on a different port (e.g., `http://localhost:3000`). Check the console output for the exact URLs.

### Building for Production

To build the application for production:

```bash
npm run build
```
This command will compile the frontend and backend into an optimized format, usually in a `dist/` directory.

### Running in Production

To start the production server after a successful build:

```bash
npm run start
```
Ensure your environment variables (especially `DATABASE_URL` and `NODE_ENV=production`) are correctly set in your production environment.

## Mobile Development (with Capacitor)

Capacitor is used to bundle the web application into native mobile apps for Android and iOS.

### Initial Setup

If you haven't already, add your target platforms:

```bash
# For Android
npx cap add android

# For iOS (requires a macOS environment and Xcode)
# npx cap add ios
```

### Syncing Web Build with Native Projects

After making changes to your web app (client code), you need to build it and then sync it with your native projects:

1.  Build the web application:
    ```bash
    # This usually runs `vite build` or similar for the client
    # Ensure your `capacitor.config.ts` has the correct `webDir` (e.g., 'dist', 'build', or 'client/dist')
    # If the main `npm run build` script handles the client build correctly, that's sufficient.
    # Otherwise, you might need a specific client build script.
    ```
    *(Developer Note: The current `npm run build` script builds both client and server. The `webDir` in `capacitor.config.ts` should point to the client's build output, e.g., `dist/client` or similar if the build script places it there, or just `dist` if the client output is at the root of `dist`)*

2.  Sync the changes with Capacitor:
    ```bash
    npx cap sync
    ```

### Running on Devices/Emulators

*   **Android:**
    ```bash
    npx cap open android
    ```
    This will open the Android project in Android Studio, where you can build and run the app on an emulator or connected device.

*   **iOS:**
    ```bash
    npx cap open ios
    ```
    This will open the iOS project in Xcode, where you can build and run the app on an emulator or connected device.

*(Note: You'll need the respective native development environments set up: Android Studio for Android, and Xcode (on macOS) for iOS.)*

## Contributing

Contributions are welcome! If you have suggestions for improvements or bug fixes, please consider the following:

1.  **Open an Issue:** For significant changes or new features, please open an issue first to discuss what you would like to change.
2.  **Fork the Repository:** Create your own fork of the project.
3.  **Create a Branch:** Make your changes in a dedicated branch.
4.  **Submit a Pull Request:** Once your changes are ready, submit a pull request for review.

Please ensure your code adheres to the existing style and that any new features are appropriately documented.
