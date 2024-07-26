import { differenceInHours, differenceInMinutes, differenceInSeconds, format, formatDistanceToNow } from 'date-fns';
import { START_DATE_OPTIONS } from './createProject';
import isBefore from 'date-fns/isBefore';

export function fDateWeek(date: Date | string | number) {
  return format(new Date(date), 'eee MMM d, yyyy');
}

export function fMonthYear(date: Date | string | number) {
  return format(new Date(date), 'MMM, yyyy');
}

export function fWeekDayDayYear(date: Date | string | number) {
  return format(new Date(date), 'eeee, d, yyyy');
}

export function TimeAgo(givenDate: string | Date) {
  const now = new Date();
  const givenTimestamp = new Date(givenDate).getTime();
  const timeDifferenceInSeconds = differenceInSeconds(now, givenTimestamp);

  if (timeDifferenceInSeconds < 10) {
    return 'just now';
  } else if (timeDifferenceInSeconds < 60) {
    return `${timeDifferenceInSeconds} s ago`;
  } else if (timeDifferenceInSeconds < 3600) {
    const minutesAgo = differenceInMinutes(now, givenTimestamp);
    return `${minutesAgo} min ago`;
  } else if (timeDifferenceInSeconds < 86400) {
    const hoursAgo = differenceInHours(now, givenTimestamp);
    return `${hoursAgo} h ago`;
  } else {
    return formatDistanceToNow(givenTimestamp);
  }
}

export const isValidProjectStartingDate = (value: string): boolean => {
  if (START_DATE_OPTIONS.includes(value)) {
    return true;
  }
  const dateRegex = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/;
  if (!dateRegex.test(value)) {
    return false;
  }
  const [day, month, year] = value.split('/').map(Number);
  const selectedDate = new Date(year, month - 1, day, 0, 0, 0, 0);
  const currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0, 0);
  return !isBefore(selectedDate, currentDate);
};
