# Daily Changes - Teacher Absence Management System

This project is a Teacher Absence Management System, developed as a Single Page Application (SPA) using React, designed to help schools manage teacher absences, RFF (Release From Face-to-Face) allocations, duty assignments, and casual teacher instructions.

## Purpose

The primary goal of "Daily Changes" is to streamline the process of managing teacher absences and the subsequent re-allocation of duties and classes to casual teachers or other staff. It aims to provide a user-friendly interface for uploading school data, tracking RFF debts, managing casual teacher information, and generating essential daily instructions.

## Tech Stack

*   **Frontend:** React 18+ with functional components and hooks
*   **Styling:** Tailwind CSS + shadcn/ui components
*   **State Management:** React Context + useReducer for complex state
*   **File Processing:** `xlsx` library for Excel parsing
*   **Storage:** `localStorage` for MVP (database-ready structure)
*   **Routing:** React Router for multi-page navigation
*   **Build:** Vite for development and build process
*   **TypeScript:** For type safety and improved developer experience

## Project Structure

The application follows a modular project structure:

```
src/
├── components/
│   ├── ui/ (shadcn components)
│   ├── layout/ (e.g., Navbar)
│   ├── upload/ (e.g., FileUploadArea)
│   ├── absence/ (e.g., TeacherSelector)
│   ├── assignment/ (e.g., CasualInstructionGenerator, DutyManager)
│   ├── output/
│   └── rff-payback/ (e.g., DebtTable, ManualEntryForm)
│   └── settings/ (e.g., SchoolInfoForm, CasualTeacherManager, DataManagement)
├── contexts/ (e.g., AppContext)
├── hooks/
├── utils/ (e.g., excelParser, storage)
├── types/ (TypeScript interfaces)
└── pages/ (Main application pages)
```

## Features Implemented (Phase 1 & Phase 2)

### Phase 1: Core MVP
*   **Project Initialization & Basic Setup:**
    *   React project initialized with Vite and TypeScript.
    *   Tailwind CSS configured.
    *   React Router set up for navigation.
    *   Initial `src` directory structure created.
*   **Core Data Models & Global State Management:**
    *   All necessary TypeScript interfaces defined.
    *   Global state management implemented using React Context and `useReducer`, with `localStorage` persistence.
*   **SetupPage Component (`/setup`):**
    *   File upload area created for `.xlsx` files.
    *   Basic Excel parsing logic implemented with validation for required sheets and columns.
*   **AbsenceManagementPage Component (Default Route `/`):**
    *   Basic layout with a `TeacherSelector` (using `shadcn` Combobox).
    *   Placeholder components for `CasualInstructionGenerator` and `DutyManager`.

### Phase 2: Enhanced UX
*   **UI/UX Refinement & Shadcn Integration:**
    *   `shadcn/ui` components integrated throughout the application.
    *   A `Navbar` added for easy navigation.
*   **Robust Error Handling & Validation:**
    *   Enhanced Excel parsing with comprehensive validation.
*   **RFF Payback Tracking (`/rff-payback`):**
    *   `RFFPaybackPage` layout updated.
    *   `DebtTable`, `PaymentHistoryTable`, `ManualEntryForm`, and `DebtSummaryCards` components implemented.
*   **Settings and Configuration (`/settings`):**
    *   `SettingsPage` layout updated.
    *   `SchoolInfoForm`, `CasualTeacherManager`, and `DataManagement` components implemented.
*   **Casual Instruction Generation & Duty Management:**
    *   `CasualInstructionGenerator` and `DutyManager` components integrated into the Absence Management page.

## Getting Started

To run the application locally:

1.  **Clone the repository:**
    ```bash
    git clone [repository-url] daily-changes
    cd daily-changes
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will typically run on `http://localhost:5173/` (or another available port).

## Usage

*   **Navigation:** Use the Navbar to navigate between "Absence Management", "Setup", "RFF Payback", and "Settings" pages.
*   **Setup Page (`/setup`):** Upload an Excel file containing "RFF/Duties" and "Teacher-Class Map" sheets to populate the application with data.
*   **Absence Management Page (`/`):** Select teachers, view conflicts, and manage assignments (currently with placeholder components).
*   **RFF Payback Page (`/rff-payback`):** View current and cleared RFF debts, add new debts manually, and see a summary.
*   **Settings Page (`/settings`):** Manage school information, casual teachers, and export application data.

## Next Steps (Phase 3)

*   Advanced Assignment Features
*   Print-Optimized Output & Export
*   Performance Improvements
*   Comprehensive Testing
*   Deployment Preparation
