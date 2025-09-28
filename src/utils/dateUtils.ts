/**
 * Utility functions for date conversion and manipulation
 */

/**
 * Format a Date object to DD.MM.YYYY string format
 */
export const convertDateToString = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

/**
 * Convert a DD.MM.YYYY string to a Date object
 */
export const convertStringToDate = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split('.').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Check if a string is in DD.MM.YYYY format
 */
export const isValidDateFormat = (dateStr: string): boolean => {
  const regex = /^\d{2}\.\d{2}\.\d{4}$/;
  if (!regex.test(dateStr)) return false;
  
  const [day, month, year] = dateStr.split('.').map(Number);
  const date = new Date(year, month - 1, day);
  
  return (
    date.getDate() === day &&
    date.getMonth() === month - 1 &&
    date.getFullYear() === year
  );
};

/**
 * Format current date to DD.MM.YYYY
 */
export const getCurrentDateFormatted = (): string => {
  return convertDateToString(new Date());
}; 