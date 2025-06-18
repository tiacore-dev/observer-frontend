// Утилиты для работы с JWT токенами
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    // Проверяем, истекает ли токен в ближайшие 5 минут (300 секунд)
    return payload.exp < currentTime + 300;
  } catch (error) {
    console.error("Error parsing token:", error);
    return true; // Если не можем распарсить, считаем токен недействительным
  }
};

export const isTokenValid = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime;
  } catch (error) {
    console.error("Error parsing token:", error);
    return false;
  }
};
