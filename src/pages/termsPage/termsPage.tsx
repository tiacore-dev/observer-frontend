"use client";

import type React from "react";
import { Box, Typography, Paper, Divider, IconButton } from "@mui/material";
import { useThemeMode } from "../../context/themeContext";
import DescriptionIcon from "@mui/icons-material/Description";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

export const TermsPage: React.FC = () => {
  const theme = useThemeMode();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "background.paper",
        py: 1,
        minHeight: "100vh",
        position: "relative", // Для позиционирования кнопки назад
      }}
    >
      {/* Кнопка "Назад" - закрепленная в левом верхнем углу */}
      <IconButton
        onClick={() => navigate(-1)}
        sx={{
          position: "fixed",
          top: { xs: 16, sm: 24 }, // Адаптивные отступы для мобильных и десктопа
          left: { sm: 24 },
          right: { xs: 16 },

          zIndex: 1000, // Чтобы кнопка была поверх других элементов
          backgroundColor: "background.paper",
          boxShadow: 2,
          "&:hover": {
            backgroundColor: "action.hover",
          },
          width: { xs: 48, sm: 56 }, // Адаптивный размер для мобильных
          height: { xs: 48, sm: 56 },
        }}
        aria-label="вернуться назад"
      >
        <ArrowBackIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
      </IconButton>

      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, sm: 5, md: 8 },
          maxWidth: { xs: "95%", sm: 700, md: 800 },
          mx: "auto",
          backgroundColor: "background.paper",
          borderRadius: "12px",
          boxShadow: theme.isDarkMode
            ? "0 8px 24px rgba(0, 0, 0, 0.5), 0 4px 8px rgba(0, 0, 0, 0.4)"
            : "0 8px 24px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.08)",
          // mt: { xs: 6, sm: 0 }, // Добавляем отступ сверху для мобильных, чтобы кнопка не перекрывала контент
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <DescriptionIcon sx={{ fontSize: 40 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Пользовательское соглашение
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Typography variant="body2" paragraph>
          Настоящее Пользовательское соглашение регулирует отношения между
          Оператором платформы Observer и Пользователем, использующим
          функциональность сервиса.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
          Юридические реквизиты Оператора:
        </Typography>
        <Typography variant="body1" paragraph>
          Наименование: ООО "Тиакор"
          <br />
          ИНН: 5405012701
          <br />
          Юридический адрес: 630124, Россия, Новосибирская область, г
          Новосибирск, ш. Гусинобродское, д. 17, кв. 25
          <br />
          E-mail для обращений: admin@tiacore.com
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
          1. Общие положения
        </Typography>
        <Typography variant="body1" paragraph>
          1.1. Используя сервис Observer, Пользователь соглашается с настоящими
          условиями, Политикой конфиденциальности и принимает на себя
          обязанности, изложенные в настоящем Соглашении.
        </Typography>
        <Typography variant="body1" paragraph>
          1.2. Если Пользователь не согласен с условиями, он обязан немедленно
          прекратить использование сервиса.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
          2. Описание сервиса
        </Typography>
        <Typography variant="body1" paragraph>
          2.1. Сервис Observer представляет собой платформу для настройки и
          выполнения автоматического анализа сообщений в Telegram-чатах на
          основе подключаемых ботов и промптов, создаваемых Пользователем.
        </Typography>
        <Typography variant="body1" paragraph>
          2.2. Сервис не хранит анализируемые чаты в постоянной базе данных и не
          вмешивается в их содержание, предоставляя лишь инструменты для
          автоматизации.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
          3. Регистрация и авторизация
        </Typography>
        <Typography variant="body1" paragraph>
          3.1. Для доступа к функционалу сервиса требуется регистрация, включая
          указание действующего адреса электронной почты.
        </Typography>
        <Typography variant="body1" paragraph>
          3.2. Пользователь обязуется предоставлять достоверную информацию при
          регистрации.
        </Typography>
        <Typography variant="body1" paragraph>
          3.3. Пользователь несет ответственность за сохранность своих
          авторизационных данных и токенов Telegram-ботов.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
          4. Подключение и использование Telegram-ботов
        </Typography>
        <Typography variant="body1" paragraph>
          4.1. Пользователь самостоятельно создаёт Telegram-бота через BotFather
          и предоставляет Observer токен доступа.
        </Typography>
        <Typography variant="body1" paragraph>
          4.2. Все операции с чатами осуществляются от имени подключенного
          Пользователем бота. Оператор не имеет прямого доступа к
          Telegram-чатам.
        </Typography>
        <Typography variant="body1" paragraph>
          4.3. Токены используются только для выполнения настроенных
          Пользователем операций. Токены не хранятся в открытом виде и не
          передаются третьим лицам.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
          5. Ответственность за контент и данные
        </Typography>
        <Typography variant="body1" paragraph>
          5.1. Вся ответственность за законность обработки данных, полученных
          через Telegram-бота, лежит на Пользователе.
        </Typography>
        <Typography variant="body1" paragraph>
          5.2. Пользователь обязуется получать согласие от субъектов
          персональных данных (участников чатов), если это требуется
          законодательством.
        </Typography>
        <Typography variant="body1" paragraph>
          5.3. Оператор не осуществляет предварительный или последующий контроль
          за содержанием сообщений и отчётов, сформированных в результате
          анализа.
        </Typography>
        <Typography variant="body1" paragraph>
          5.4. Оператор не несёт ответственность за любые убытки, понесённые в
          результате использования аналитических отчётов.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
          6. Обязанности Пользователя
        </Typography>
        <Typography variant="body1" paragraph>
          6.1. Пользователь обязуется:
        </Typography>
        <Typography variant="body1" component="div" sx={{ pl: 2 }}>
          <ul>
            <li>не использовать сервис для противоправных целей;</li>
            <li>не нарушать права третьих лиц;</li>
            <li>
              соблюдать требования законодательства о персональных данных;
            </li>
            <li>
              не предпринимать действий, направленных на вмешательство в работу
              платформы Observer.
            </li>
          </ul>
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
          7. Права Оператора
        </Typography>
        <Typography variant="body1" paragraph>
          7.1. Оператор вправе:
        </Typography>
        <Typography variant="body1" component="div" sx={{ pl: 2 }}>
          <ul>
            <li>
              ограничить или прекратить доступ к сервису при нарушении
              Пользователем условий Соглашения;
            </li>
            <li>
              вносить изменения в функциональность, интерфейс и алгоритмы работы
              сервиса;
            </li>
            <li>
              использовать обезличенные данные для анализа, улучшения и
              разработки продукта;
            </li>
            <li>
              временно приостанавливать работу сервиса в случае технических
              работ.
            </li>
          </ul>
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
          8. Интеллектуальная собственность
        </Typography>
        <Typography variant="body1" paragraph>
          8.1. Все программные компоненты, интерфейсы, дизайн и текстовые
          элементы сервиса являются интеллектуальной собственностью Оператора
          или его партнёров.
        </Typography>
        <Typography variant="body1" paragraph>
          8.2. Запрещено копирование, распространение или иное использование
          материалов платформы без письменного согласия Оператора.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
          9. Подписка и оплата (при наличии)
        </Typography>
        <Typography variant="body1" paragraph>
          9.1. Некоторые функции Observer могут быть доступны только по платной
          подписке.
        </Typography>
        <Typography variant="body1" paragraph>
          9.2. Условия тарификации, ограничения, способы оплаты и возврата
          средств публикуются отдельно.
        </Typography>
        <Typography variant="body1" paragraph>
          9.3. Оператор оставляет за собой право изменять цены и структуру
          тарифов, уведомляя Пользователя в интерфейсе сервиса.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
          10. Форс-мажор
        </Typography>
        <Typography variant="body1" paragraph>
          10.1. Оператор не несёт ответственности за полное или частичное
          неисполнение обязательств по Соглашению, если оно явилось следствием
          обстоятельств непреодолимой силы (форс-мажора), включая перебои в
          работе Telegram, хостинга, DDoS-атаки и пр.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
          11. Разрешение споров
        </Typography>
        <Typography variant="body1" paragraph>
          11.1. Все споры и разногласия подлежат разрешению путём переговоров.
        </Typography>
        <Typography variant="body1" paragraph>
          11.2. В случае недостижения согласия — в суде по месту регистрации
          Оператора.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
          12. Заключительные положения
        </Typography>
        <Typography variant="body1" paragraph>
          12.1. Актуальная редакция Соглашения всегда доступна на официальном
          сайте Observer.
        </Typography>
        <Typography variant="body1" paragraph>
          12.2. Оператор вправе вносить изменения в текст Соглашения в
          одностороннем порядке. Продолжение использования сервиса после
          обновления считается акцептом новых условий.
        </Typography>
        <Typography variant="body1" paragraph>
          12.3. Все обращения по вопросам работы сервиса направляются на
          электронную почту Оператора, указанную в настоящем документе.
        </Typography>
      </Paper>
    </Box>
  );
};
