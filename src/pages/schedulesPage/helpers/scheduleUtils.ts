export const daysOfWeek = [
  { id: 0, name: "Понедельник" },
  { id: 1, name: "Вторник" },
  { id: 2, name: "Среда" },
  { id: 3, name: "Четверг" },
  { id: 4, name: "Пятница" },
  { id: 5, name: "Суббота" },
  { id: 6, name: "Воскресенье" },
];

export const generateCronExpression = (
  time: string,
  selectedDays: number[]
) => {
  if (!time || selectedDays.length === 0) return "";
  const [hours, minutes] = time.split(":");
  return `${minutes} ${hours} * * ${selectedDays.join(",")}`;
};

/**
 * Получаем смещение часового пояса в минутах
 * Например, для GMT+3 вернет -180
 */
export const getTimezoneOffset = () => new Date().getTimezoneOffset();

/**
 * Конвертирует время из формата HH:MM в UTC для сервера
 * @param localTime Время в локальном формате (например, "16:00")
 * @returns Время в UTC формате (например, "09:00" для UTC+7)
 */
export const convertToServerTime = (localTime: string) => {
  if (!localTime) return "";

  const offset = getTimezoneOffset(); // Для UTC+7 вернет -420 (минус 7 часов)
  const [hours, minutes] = localTime.split(":");

  // Вычисляем общее количество минут
  const totalMinutes = Number.parseInt(hours) * 60 + Number.parseInt(minutes);

  // Конвертируем в UTC: добавляем offset (для UTC+7 offset = -420, поэтому добавляем -420, что равно вычитанию 420)
  const utcMinutes = totalMinutes + offset;

  // Корректируем отрицательные значения и переход через полночь
  const adjustedMinutes = (utcMinutes + 1440) % 1440; // 1440 минут в сутках
  const utcHours = Math.floor(adjustedMinutes / 60);
  const utcMinutesRemainder = adjustedMinutes % 60;

  return `${String(utcHours).padStart(2, "0")}:${String(
    utcMinutesRemainder
  ).padStart(2, "0")}`;
};

/**
 * Конвертирует серверное время (UTC) в локальный формат
 * @param serverTime Время в UTC формате (например, "09:00")
 * @returns Время в локальном формате (например, "16:00" для UTC+7)
 */
export const convertToLocalTime = (serverTime: string) => {
  if (!serverTime) return "";

  const offset = getTimezoneOffset(); // Для UTC+7 вернет -420
  const [hours, minutes] = serverTime.split(":");

  // Вычисляем общее количество минут UTC времени
  const totalMinutes = Number.parseInt(hours) * 60 + Number.parseInt(minutes);

  // Конвертируем в локальное время: вычитаем offset (для UTC+7 offset = -420, поэтому вычитаем -420, что равно добавлению 420)
  const localMinutes = totalMinutes - offset;

  // Корректируем отрицательные значения и переход через полночь
  const adjustedMinutes = (localMinutes + 1440) % 1440;
  const localHours = Math.floor(adjustedMinutes / 60);
  const localMinutesRemainder = adjustedMinutes % 60;

  return `${String(localHours).padStart(2, "0")}:${String(
    localMinutesRemainder
  ).padStart(2, "0")}`;
};

/**
 * Конвертирует локальную дату и время в ISO строку для сервера
 * @param localDatetime Строка в формате "YYYY-MM-DDTHH:MM"
 * @returns ISO строка в UTC
 */
export const localToServerDatetime = (localDatetime: string) => {
  if (!localDatetime) return "";
  const date = new Date(localDatetime);
  return date.toISOString();
};

/**
 * Конвертирует серверную дату в локальный формат для input[type="datetime-local"]
 * @param serverDatetime ISO строка даты/времени
 * @returns Строка в формате "YYYY-MM-DDTHH:MM"
 */
export const serverToLocalDatetime = (serverDatetime: string) => {
  if (!serverDatetime) return "";
  const date = new Date(serverDatetime);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

/**
 * Форматирует время для отображения (HH:MM -> HH:MM AM/PM)
 */
export const formatDisplayTime = (time: string) => {
  if (!time) return "";
  try {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(Number.parseInt(hours), Number.parseInt(minutes));
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch (error) {
    console.error("Error formatting time:", error);
    return time;
  }
};

/**
 * Форматирует UTC время с сервера для отображения
 */
export const formatServerTimeForDisplay = (utcTime: string) => {
  if (!utcTime) return "";
  const localTime = convertToLocalTime(utcTime);
  return formatDisplayTime(localTime);
};

/**
 * Форматирует дату и время для отображения
 */
export const formatDateTimeForDisplay = (isoString: string) => {
  if (!isoString) return "";
  try {
    return new Date(isoString).toLocaleString();
  } catch (error) {
    console.error("Error formatting datetime:", error);
    return isoString;
  }
};

/**
 * Генерирует cron выражение с конвертацией времени в UTC
 * @param localTime Время в локальном формате (например, "16:00")
 * @param selectedDays Выбранные дни недели
 * @returns Cron выражение с UTC временем
 */
export const generateCronExpressionWithTimeConversion = (
  localTime: string,
  selectedDays: number[]
) => {
  if (!localTime || selectedDays.length === 0) return "";

  // Конвертируем время в UTC
  const utcTime = convertToServerTime(localTime);
  const [hours, minutes] = utcTime.split(":");

  return `${minutes} ${hours} * * ${selectedDays.join(",")}`;
};

/**
 * Парсит cron выражение и возвращает время в локальном часовом поясе
 * @param cronExpression - cron выражение
 * @returns объект с локальным временем и днями недели
 */
export const parseCronExpression = (
  cronExpression: string
): { localTime: string; days: number[] } => {
  const parts = cronExpression.split(" ");
  if (parts.length >= 5) {
    const utcTime = `${parts[1].padStart(2, "0")}:${parts[0].padStart(2, "0")}`;
    const localTime = convertToLocalTime(utcTime);
    const days = parts[4].split(",").map(Number);
    return { localTime, days };
  }
  return { localTime: "09:00", days: [1, 2, 3, 4, 0] };
};
