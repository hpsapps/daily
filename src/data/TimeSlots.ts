export interface TimeSlot {
  title: string;
  times: string[];
}

export let timeSlots: TimeSlot[] = [];

export async function loadTimeSlotsData(): Promise<void> {
  try {
    const response = await fetch('/data/TimeSlots.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    timeSlots = await response.json();
  } catch (error) {
    console.error("Failed to load time slots data:", error);
    timeSlots = [];
  }
}

export const getSessionTitle = (time: string): string => {
  const normalizeTime = (t: string): string => {
    if (t.includes('-')) {
      return t.split('-')[0].trim();
    }
    return t.trim();
  };

  const normalizedInputTime = normalizeTime(time);

  for (const session of timeSlots) {
    for (const sessionTime of session.times) {
      const normalizedSessionTime = normalizeTime(sessionTime);
      if (normalizedInputTime.startsWith(normalizedSessionTime.substring(0, 5))) {
        return session.title;
      }
    }
  }
  return "Unknown Session";
};
