export const storage = {
  save: (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving to localStorage for key "${key}":`, error);
    }
  },
  load: (key: string) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error loading from localStorage for key "${key}":`, error);
      return null;
    }
  },
  clear: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error clearing from localStorage for key "${key}":`, error);
    }
  },
  exists: (key: string): boolean => {
    try {
      return localStorage.getItem(key) !== null;
    } catch (error) {
      console.error(`Error checking existence in localStorage for key "${key}":`, error);
      return false;
    }
  },
};
