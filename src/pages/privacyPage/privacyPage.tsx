"use client";

import type React from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";
import { useThemeMode } from "../../context/themeContext";
import InfoIcon from "@mui/icons-material/Info";

export const PrivacyPage: React.FC = () => {
  const theme = useThemeMode();

  return (
    <Box
      sx={{
        flexGrow: 1, // Позволяет этому Box занимать все доступное пространство
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // Центрирует Paper по горизонтали
        backgroundColor: "background.paper",
        py: 1, // Вертикальные отступы вокруг "документа"
        minHeight: "100vh", // Гарантирует, что фон занимает всю высоту экрана
      }}
    >
      <Paper
        elevation={3} // Увеличиваем тень для более выраженного вида "бумаги"
        sx={{
          p: { xs: 3, sm: 5, md: 8 }, // Адаптивные внутренние отступы для контента "документа"
          maxWidth: { xs: "95%", sm: 700, md: 800 }, // Максимальная ширина для вида "документа"
          mx: "auto", // Центрирует Paper внутри его контейнера
          backgroundColor: "background.paper",
          borderRadius: "12px", // Немного более скругленные углы
          boxShadow: theme.isDarkMode
            ? "0 8px 24px rgba(0, 0, 0, 0.5), 0 4px 8px rgba(0, 0, 0, 0.4)" // Более выраженная тень для темной темы
            : "0 8px 24px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.08)", // Более выраженная тень для светлой темы
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <InfoIcon sx={{ fontSize: 40 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Политика конфиденциальности
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Typography variant="body2" paragraph>
          Настоящая политика конфиденциальности определяет порядок обработки и
          защиты персональных данных пользователей платформы Observer.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
          Юридические реквизиты Оператора:
        </Typography>
        <Typography variant="body1" paragraph>
          Наименование: ООО "Тиакор"
          <br />
          ИНН/ОГРН: 5405012701
          <br />
          Юридический адрес: 630124, Россия, Новосибирская область, г
          Новосибирск, ш. Гусинобродское, д. 17, кв. 25
          <br />
          E-mail для обращений по персональным данным: admin@tiacore.com
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
          1. Общие положения
        </Typography>
        <Typography variant="body1" paragraph>
          1.1. Политика применяется ко всем персональным данным, которые
          Оператор получает от Пользователей при использовании сервиса Observer.
        </Typography>
        <Typography variant="body1" paragraph>
          1.2. Использование сервиса означает согласие Пользователя с настоящей
          Политикой и условиями обработки его персональных данных.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
          2. Состав обрабатываемых персональных данных
        </Typography>
        <Typography variant="body1" paragraph>
          2.1. Оператор может обрабатывать следующие категории данных:
        </Typography>
        <Typography variant="body1" component="div" sx={{ pl: 2 }}>
          <ul>
            <li>адрес электронной почты;</li>
            <li>Telegram ID Пользователя;</li>
            <li>ID чатов и участников чатов;</li>
            <li>username в Telegram;</li>
            <li>текст сообщений (если требуется для выполнения анализа);</li>
            <li>техническая информация о действиях в интерфейсе платформы.</li>
          </ul>
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
          3. Цели обработки данных
        </Typography>
        <Typography variant="body1" paragraph>
          3.1. Персональные данные обрабатываются в следующих целях:
        </Typography>
        <Typography variant="body1" component="div" sx={{ pl: 2 }}>
          <ul>
            <li>регистрация и идентификация Пользователя;</li>
            <li>предоставление доступа к функционалу Observer;</li>
            <li>выполнение аналитических задач, запущенных Пользователем;</li>
            <li>обеспечение безопасности и предотвращение нарушений;</li>
            <li>
              коммуникация с Пользователем, в том числе по вопросам поддержки;
            </li>
            <li>исполнение требований законодательства.</li>
          </ul>
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
          4. Основания обработки
        </Typography>
        <Typography variant="body1" paragraph>
          4.1. Обработка данных осуществляется:
        </Typography>
        <Typography variant="body1" component="div" sx={{ pl: 2 }}>
          <ul>
            <li>на основании согласия Пользователя;</li>
            <li>для исполнения договора между Пользователем и Оператором;</li>
            <li>для исполнения требований законодательства РФ.</li>
          </ul>
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
          5. Условия обработки и хранения данных
        </Typography>
        <Typography variant="body1" paragraph>
          5.1. Обработка осуществляется с соблюдением принципов законности,
          справедливости, минимизации и актуальности.
        </Typography>
        <Typography variant="body1" paragraph>
          5.2. Хранение данных осуществляется в течение срока, необходимого для
          достижения целей обработки, либо до момента отзыва согласия
          Пользователем.
        </Typography>
        <Typography variant="body1" paragraph>
          5.3. Удаление персональных данных возможно по письменному запросу
          Пользователя.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
          6. Права субъекта персональных данных
        </Typography>
        <Typography variant="body1" paragraph>
          Пользователь имеет право:
        </Typography>
        <Typography variant="body1" component="div" sx={{ pl: 2 }}>
          <ul>
            <li>на получение сведений о своих персональных данных;</li>
            <li>на отзыв согласия на обработку данных;</li>
            <li>
              на требование блокировки, обновления, удаления или уничтожения
              данных;
            </li>
            <li>
              на обжалование действий Оператора в уполномоченные органы или суд.
            </li>
          </ul>
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
          7. Обработка данных из Telegram-чатов
        </Typography>
        <Typography variant="body1" paragraph>
          7.1. Оператор не инициирует сбор данных из чатов Telegram. Все
          действия выполняются на основании настроек и сценариев, заданных
          Пользователем.
        </Typography>
        <Typography variant="body1" paragraph>
          7.2. Ответственность за получение согласий от участников чатов, чьи
          данные могут анализироваться, лежит на Пользователе.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
          8. Трансграничная передача данных
        </Typography>
        <Typography variant="body1" paragraph>
          8.1. Сервис может осуществлять трансграничную передачу данных через
          Telegram API, расположенный за пределами Российской Федерации.
        </Typography>
        <Typography variant="body1" paragraph>
          8.2. Пользователь, используя платформу, выражает согласие на такую
          передачу.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
          9. Меры по защите персональных данных
        </Typography>
        <Typography variant="body1" paragraph>
          9.1. Оператор реализует необходимые технические и организационные меры
          по защите данных:
        </Typography>
        <Typography variant="body1" component="div" sx={{ pl: 2 }}>
          <ul>
            <li>защита от несанкционированного доступа;</li>
            <li>ограничение доступа сотрудников;</li>
            <li>шифрование при передаче;</li>
            <li>аудит и контроль действий.</li>
          </ul>
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
          10. Передача третьим лицам
        </Typography>
        <Typography variant="body1" paragraph>
          10.1. Оператор не передаёт персональные данные третьим лицам без
          отдельного согласия, за исключением случаев, предусмотренных законом.
        </Typography>
        <Typography variant="body1" paragraph>
          10.2. Исключение составляют технические партнёры, обеспечивающие
          работу платформы (хостинг, аналитика и т.п.), при условии соблюдения
          конфиденциальности.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
          11. Изменения в политике
        </Typography>
        <Typography variant="body1" paragraph>
          11.1. Оператор вправе вносить изменения в настоящую Политику. Новая
          редакция вступает в силу с момента публикации.
        </Typography>
        <Typography variant="body1" paragraph>
          11.2. Пользователь обязуется самостоятельно отслеживать актуальность
          редакции.
        </Typography>
        <Typography
          variant="body2"
          paragraph
          sx={{ mt: 4, fontStyle: "italic" }}
        >
          Актуальная версия Политики доступна на сайте сервиса Observer.
        </Typography>
      </Paper>
    </Box>
  );
};
