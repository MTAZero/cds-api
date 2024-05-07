export const convertTimeStampToStartDay = (timestamp: number): number => {
  const date = new Date(timestamp);

  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  const startOfDayTimestamp = date.getTime();

  return startOfDayTimestamp;
};

export const getStartOfMonthTimestamp = (timestamp: number): number => {
  const date = new Date(timestamp);

  date.setDate(1);

  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  const startOfMonthTimestamp = date.getTime();

  return startOfMonthTimestamp;
};

export const getDayMonthAndYear = (
  date: Date,
): {
  day: number;
  month: number;
  year: number;
} => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return {
    day,
    month,
    year,
  };
};

export const getMidnightDate = (
  day: number,
  month: number,
  year: number,
): Date => {
  const midnightDate = new Date(year, month - 1, day);
  midnightDate.setHours(0);
  midnightDate.setMinutes(0);
  midnightDate.setSeconds(0);
  midnightDate.setMilliseconds(0);

  return midnightDate;
};

export const getStartNextMonth = (
  month: number,
  year: number,
): {
  day: number;
  month: number;
  year: number;
} => {
  const nextDate = {
    day: 1,
    month: month + 1,
    year: year,
  };
  if (nextDate.month > 12) {
    nextDate.month = nextDate.month - 12;
    nextDate.year = nextDate.year + 1;
  }

  return nextDate;
};

export const getNumDaysOfMonth = (month: number, year: number) => {
  const date = new Date(year, month - 1, 1);
  date.setMonth(date.getMonth() + 1);
  date.setDate(date.getDate() - 1);
  const numDays = date.getDate();

  return numDays;
};
