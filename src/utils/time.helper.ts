export const convertTimeStampToStartDay = (timestamp: number): number => {
  // Chuyển timestamp thành đối tượng Date
  const date = new Date(timestamp);

  // Đặt giờ, phút, giây về 0
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  // Chuyển đối tượng Date thành timestamp mới
  const startOfDayTimestamp = date.getTime();

  return startOfDayTimestamp;
};
