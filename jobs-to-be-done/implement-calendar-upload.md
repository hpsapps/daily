# Job: Implement School Calendar CSV Upload

**Objective:**
Implement the "Upload School Calendar (CSV)" feature to allow teachers to upload their own school calendar, which will then be used throughout the application to determine term dates, holidays, and development days.

**File Modifications:**
- **Create:** `jobs-to-be-done/implement-calendar-upload.md` (contains these instructions)
- **Modify:** `src/components/settings/CalendarUpload.tsx` (to handle file upload)
- **Modify:** `src/utils/excelParser.ts` (to add CSV parsing logic)
- **Modify:** `src/utils/storage.ts` (to add functions for saving/loading calendar data)
- **Modify:** `src/contexts/AppContext.tsx` (to manage and provide the calendar data)

**Implementation Steps:**

1.  **Update `src/components/settings/CalendarUpload.tsx`:**
    *   Replace the `alert()` in `handleUploadCalendar` with a file input or a drag-and-drop area (using a library like `react-dropzone`, which is already a dependency).
    *   When a file is uploaded, read its content.

2.  **Create CSV Parsing Logic in `src/utils/excelParser.ts`:**
    *   Add a new function, `parseCalendarCSV`, that takes the CSV file content as input.
    *   This function will parse the CSV and convert each row into a structured object. It should be robust enough to handle variations in the CSV format, but for now, it will be tailored to the format of the `NSW_DoE_iCal_Outlook_2025.csv` file you provided.

3.  **Transform Parsed Data:**
    *   In `src/components/settings/CalendarUpload.tsx`, after parsing the CSV, transform the data into the `TermPeriod` format (defined in `src/utils/termCalculator.ts`). This will involve mapping the CSV columns ("Subject", "Start Date", "End Date") to the `TermPeriod` properties (`description`, `startDate`, `endDate`, `type`, `term`, `week`).

4.  **Store Data in Local Storage:**
    *   In `src/utils/storage.ts`, add two new functions: `saveCalendarData(data: TermPeriod[])` and `loadCalendarData(): TermPeriod[] | null`. These will save the transformed calendar data to the browser's local storage as a JSON string and retrieve it.

5.  **Manage Calendar Data in `src/contexts/AppContext.tsx`:**
    *   In the `AppContext`, create a new state variable, `termPeriods`, and a function to update it, `setTermPeriods`.
    *   On initial load, the `AppContext` should try to `loadCalendarData()` from local storage. If data exists, it should be used to initialize the `termPeriods` state. If not, it can fall back to the hardcoded `termPeriods` from `src/utils/termCalculator.ts`.
    *   The `CalendarUpload.tsx` component will call `setTermPeriods` and `saveCalendarData` after a successful upload.

6.  **Update `src/utils/termCalculator.ts`:**
    *   The hardcoded `termPeriods` array should be kept as a fallback, but the `getTermAndWeek` function should be modified to accept an optional `termPeriods` array as an argument. If no array is provided, it will use the hardcoded one.

7.  **Update Components Using `termPeriods`:**
    *   Components that use `termPeriods` (like `src/components/ui/calendar.tsx`) will now get this data from the `AppContext` instead of importing it directly from `termCalculator.ts`.

**Expected CSV Format:**
The parser will be designed to work with a CSV file that has the following columns:
- `Subject`: The description of the event (e.g., "Term 1 Week 1 (11 Wk Term)", "School Holidays", "School development day").
- `Start Date`: The start date of the event (e.g., "31/01/2025").
- `End Date`: The end date of the event (e.g., "31/01/2025").
