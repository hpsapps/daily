# Daily Changes - Teacher Absence Management System

This project is a Teacher Absence Management System, developed as a Single Page Application (SPA) using React, designed to help schools manage teacher absences, RFF (Release From Face-to-Face) allocations, duty assignments, and casual teacher instructions.

## Purpose

The primary goal of "Daily Changes" is to streamline the process of managing teacher absences and the subsequent re-allocation of duties and classes to casual teachers or other staff. It aims to provide a user-friendly interface for uploading school data, tracking RFF debts, managing casual teacher information, and generating essential daily instructions.

## Tech Stack

*   **Frontend:** React 18+ with functional components and hooks
*   **Styling:** Tailwind CSS + shadcn/ui components
*   **State Management:** React Context + useReducer for complex state
*   **File Processing:** ExcelJS for advanced Excel parsing and generation
*   **Backend & Storage:** Firebase (Firestore for database and Firebase Storage for file uploads)
*   **Routing:** React Router for multi-page navigation
*   **Build:** Vite for development and build process
*   **TypeScript:** For type safety and improved developer experience

## Project Structure

The application follows a modular project structure, centered around features:

```
src/
├── components/
│   ├── features/
│   │   ├── home-dashboard/
│   │   ├── manual-duty/
│   │   └── ... (other feature-specific components)
│   ├── layout/ (e.g., Navbar)
│   ├── settings/
│   ├── rff-payback/
│   └── ui/ (shadcn components)
├── contexts/ (e.g., AppContext)
├── hooks/
├── utils/ (e.g., excelParser, storage, termCalculator)
├── types/ (TypeScript interfaces)
└── pages/ (Main application pages: DailyCasualHome, SettingsPage, etc.)
```

## Key Features

*   **Centralized Dashboard:** A new `DailyCasualHome` page provides a central hub for managing daily schedules, absences, and assignments.
*   **Firebase Integration:** Utilizes Firestore for real-time data persistence and Firebase Storage for handling file uploads, replacing the previous `localStorage` solution.
*   **Advanced Data Handling:** Switched to `ExcelJS` for more robust and flexible parsing of uploaded school rosters and schedules.
*   **Dynamic Schedule Management:** Enhanced calendar components that understand school term dates and allow for easy navigation between weeks and days.
*   **Modular & Scalable Architecture:** Refactored component structure to be more feature-oriented, improving maintainability.
*   **Comprehensive Settings:** Manage school information, casual teacher lists, and application data through a dedicated settings page.
*   **RFF Payback Tracking:** Tools to monitor and manage RFF debts and payments.

## Getting Started

To run the application locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/hpsapps/daily.git daily-changes
    cd daily-changes
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up Firebase:**
    *   Create a `firebase.ts` configuration file in the `src` directory with your Firebase project credentials.
    *   Ensure your Firestore database has the required security rules and collections.
4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will typically run on `http://localhost:5173/`.

## Usage

*   **Navigation:** Use the Navbar to navigate between the "Home" dashboard, "RFF Payback", and "Settings" pages.
*   **Settings Page (`/settings`):** Begin here. Upload your school's teacher roster and calendar/schedule via the Excel upload areas. Configure school term dates and manage your list of casual teachers.
*   **Home Dashboard (`/`):** View the daily schedule. Select a date to see assigned duties and classes. You can select teachers who are absent, assign casuals, and manage any resulting changes directly from the dashboard.
*   **RFF Payback Page (`/rff-payback`):** View current and cleared RFF debts, add new debts manually, and see a summary.

## Next Steps

*   Advanced Assignment Features
*   Print-Optimized Output & Export
*   Performance Improvements
*   Comprehensive Testing
*   Deployment Preparation
