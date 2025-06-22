export const daysOfWeek = [
  { id: 1, name: "Понедельник" },
  { id: 2, name: "Вторник" },
  { id: 3, name: "Среда" },
  { id: 4, name: "Четверг" },
  { id: 5, name: "Пятница" },
  { id: 6, name: "Суббота" },
  { id: 0, name: "Воскресенье" },
];

export const generateCronExpression = (
  time: string,
  selectedDays: number[]
) => {
  if (!time || selectedDays.length === 0) return "";
  const [hours, minutes] = time.split(":");
  return `${minutes} ${hours} * * ${selectedDays.join(",")}`;
};

export const convertLocalTimeToUTC = (timeString: string) => {
  if (!timeString) return "";

  try {
    const [hours, minutes] = timeString.split(":");
    const localDate = new Date();
    localDate.setHours(
      Number.parseInt(hours, 10),
      Number.parseInt(minutes, 10),
      0,
      0
    );

    const utcHours = localDate.getUTCHours().toString().padStart(2, "0");
    const utcMinutes = localDate.getUTCMinutes().toString().padStart(2, "0");

    return `${utcHours}:${utcMinutes}`;
  } catch (error) {
    console.error("Error converting time to UTC:", error);
    return timeString;
  }
};

export const formatTimeFromUTC = (utcTime: string | undefined) => {
  if (!utcTime) return "";
  try {
    if (utcTime.includes("T")) {
      const date = new Date(utcTime);
      return date.toISOString().slice(0, 16);
    }
    return utcTime.split(":").slice(0, 2).join(":");
  } catch (error) {
    console.error("Ошибка форматирования времени:", error);
    return "";
  }
};

export const formatDateTimeForDisplay = (dateTime: string | undefined) => {
  if (!dateTime) return "";
  try {
    const date = new Date(dateTime);
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - timezoneOffset);
    return localDate.toISOString().slice(0, 16);
  } catch (error) {
    console.error("Ошибка форматирования даты/времени:", error);
    return "";
  }
};
