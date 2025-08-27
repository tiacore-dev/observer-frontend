import type React from "react";
import {
  Rocket,
  School,
  BugReport,
  TipsAndUpdates,
  Business,
  SmartToy,
  Description,
  Schedule,
  Analytics,
  HelpOutline,
  CheckCircle,
  Speed,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

export interface HelpSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export const helpSections: HelpSection[] = [
  {
    id: "quick-start",
    title: "Быстрый старт",
    icon: <Rocket color="primary" />,
    content: (
      <Box>
        <Typography variant="h6" gutterBottom>
          Начните работу за 5 минут
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          <strong>Важно:</strong> Для начала работы вам понадобится
          Telegram-бот. Если у вас его еще нет, создайте через @BotFather.
        </Alert>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            Пошаговое руководство:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText
                primary="1. Создайте компанию в разделе 'Компании'"
                secondary="Это ваше рабочее пространство"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText
                primary="2. Добавьте бота в разделе 'Боты'"
                secondary="Используйте токен от @BotFather"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText
                primary="3. Создайте промпт в разделе 'Промпты'"
                secondary="Например: 'Найди основные темы обсуждения'"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText
                primary="4. Настройте расписание в разделе 'Расписания'"
                secondary="Выберите куда и как часто запускать анализ"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText
                primary="5. Запустите первый анализ"
                secondary="Проверьте что все работает корректно"
              />
            </ListItem>
          </List>
        </Box>

        <Alert severity="success">
          <strong>Готово!</strong> Теперь система будет автоматически
          анализировать ваши чаты и присылать отчеты по расписанию.
        </Alert>
      </Box>
    ),
  },
  {
    id: "glossary",
    title: "Глоссарий",
    icon: <School color="primary" />,
    content: (
      <Box>
        <Typography variant="h6" gutterBottom>
          Термины и определения
        </Typography>

        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Термин</strong>
                </TableCell>
                <TableCell>
                  <strong>Описание</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <strong>Промпт</strong>
                </TableCell>
                <TableCell>
                  Инструкция для ИИ, описывающая что именно нужно анализировать
                  в чате
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Расписание</strong>
                </TableCell>
                <TableCell>
                  Настройки автоматического запуска анализа по времени
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Токен бота</strong>
                </TableCell>
                <TableCell>
                  Уникальный ключ для доступа к вашему Telegram-боту
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Чат для отчета</strong>
                </TableCell>
                <TableCell>
                  Чат, в который будут отправляться результаты анализа
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    ),
  },
  {
    id: "troubleshooting",
    title: "Решение проблем",
    icon: <BugReport color="primary" />,
    content: (
      <Box>
        <Typography variant="h6" gutterBottom>
          Чек-лист решения частых проблем
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <strong>Проблема:</strong> Бот не отвечает / не работает
          </Alert>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="primary" />
              </ListItemIcon>
              <ListItemText primary=" Проверьте что бот добавлен в чат как администратор с правом на чтение и отправку сообщений" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="primary" />
              </ListItemIcon>
              <ListItemText primary=" Убедитесь что после добавления бота в чате было новое сообщение" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="primary" />
              </ListItemIcon>
              <ListItemText primary=" Проверьте корректность токена бота" />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <strong>Проблема:</strong> Анализ занимает слишком много времени
          </Alert>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="primary" />
              </ListItemIcon>
              <ListItemText primary=" Уменьшите период анализа (например, анализируйте за 6 часов вместо 24)" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="primary" />
              </ListItemIcon>
              <ListItemText primary=" Упростите промпт - сделайте его более конкретным" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="primary" />
              </ListItemIcon>
              <ListItemText primary=" Для больших чатов используйте интервал анализа не менее 1 часа" />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <strong>Проблема:</strong> Отчеты не приходят в чат
          </Alert>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="primary" />
              </ListItemIcon>
              <ListItemText primary=" Проверьте настройки расписания - включено ли оно" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="primary" />
              </ListItemIcon>
              <ListItemText primary=" Убедитесь что бот включен и имеет права на отправку сообщений в целевом чате" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="primary" />
              </ListItemIcon>
              <ListItemText primary=" Проверьте не заблокирован ли бот в целевом чате" />
            </ListItem>
          </List>
        </Box>

        <Alert severity="info">
          Если проблемы сохраняются, обратитесь в поддержку с описанием ошибки и
          скриншотами настроек.
        </Alert>
      </Box>
    ),
  },
  {
    id: "advanced-tips",
    title: "Советы",
    icon: <TipsAndUpdates color="primary" />,
    content: (
      <Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            Оптимизация производительности:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <Speed color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Используйте несколько простых промптов вместо одного сложного"
                secondary="Система обрабатывает их параллельно и быстрее"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Schedule color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Настраивайте анализ в непиковые часы"
                secondary="Для рабочих чатов - рано утром или поздно вечером"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Analytics color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Для мониторинга используйте разные промпты для разных целей"
                secondary="Отдельно для тем, отдельно для настроения, отдельно для вопросов"
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            Эффективные промпты:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <Description color="primary" />
              </ListItemIcon>
              <ListItemText primary="Будьте конкретны: 'Найди 5 самых обсуждаемых тем' вместо 'Проанализируй чат'" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Description color="primary" />
              </ListItemIcon>
              <ListItemText primary="Указывайте формат ответа: 'Представь результат в виде списка с эмодзи'" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Description color="primary" />
              </ListItemIcon>
              <ListItemText primary="Используйте контекст: 'Учитывая что это чат поддержки, найди нерешенные вопросы'" />
            </ListItem>
          </List>
        </Box>

        <Alert severity="success">
          Эти советы помогут вам получить максимальную отдачу от системы и
          избежать распространенных проблем.
        </Alert>
      </Box>
    ),
  },
  {
    id: "companies",
    title: "Компании",
    icon: <Business color="primary" />,
    content: (
      <Box>
        <Typography variant="h6" gutterBottom>
          Работа с компаниями
        </Typography>

        <Typography variant="body2" paragraph>
          Компания - это ваше рабочее пространство, которое позволяет
          группировать промпты, ботов и расписания для удобного использования.
          Пока в системе нет ни одной компании, другие функции будут недоступны.
        </Typography>

        <Typography variant="subtitle2" gutterBottom>
          Как добавить компанию:
        </Typography>
        <List dense sx={{ py: 0 }}>
          <ListItem sx={{ px: 1 }}>
            <ListItemText
              primary="1. Перейдите в раздел 'Компании'"
              primaryTypographyProps={{ variant: "body2" }}
            />
          </ListItem>
          <ListItem sx={{ px: 1 }}>
            <ListItemText
              primary="2. Нажмите '+ Добавить компанию'"
              primaryTypographyProps={{ variant: "body2" }}
            />
          </ListItem>
          <ListItem sx={{ px: 1 }}>
            <ListItemText
              primary="3. Введите название и описание"
              primaryTypographyProps={{ variant: "body2" }}
            />
          </ListItem>
          <ListItem sx={{ px: 1 }}>
            <ListItemText
              primary="4. Сохраните компанию"
              primaryTypographyProps={{ variant: "body2" }}
            />
          </ListItem>
        </List>

        <Typography variant="body2" paragraph sx={{ mt: 1 }}>
          После создания компания появится в списке, а в шапке сайта можно
          переключаться между вашими компаниями.
        </Typography>
      </Box>
    ),
  },
  {
    id: "bots",
    title: "Боты",
    icon: <SmartToy color="primary" />,
    content: (
      <Box>
        <Typography variant="h6" gutterBottom>
          Управление ботами
        </Typography>

        <Typography variant="subtitle2" gutterBottom>
          Как подключить бота:
        </Typography>
        <List dense sx={{ py: 0 }}>
          <ListItem sx={{ px: 1 }}>
            <ListItemText
              primary="1. Создайте бота через @BotFather"
              primaryTypographyProps={{ variant: "body2" }}
            />
          </ListItem>
          <ListItem sx={{ px: 1 }}>
            <ListItemText
              primary="2. Добавьте бота в чаты как администратора"
              primaryTypographyProps={{ variant: "body2" }}
            />
          </ListItem>
          <ListItem sx={{ px: 1 }}>
            <ListItemText
              primary="3. В Observer откройте раздел 'Боты'"
              primaryTypographyProps={{ variant: "body2" }}
            />
          </ListItem>
          <ListItem sx={{ px: 1 }}>
            <ListItemText
              primary="4. Нажмите '+ Добавить бота'"
              primaryTypographyProps={{ variant: "body2" }}
            />
          </ListItem>
          <ListItem sx={{ px: 1 }}>
            <ListItemText
              primary="5. Введите имя и токен бота"
              primaryTypographyProps={{ variant: "body2" }}
            />
          </ListItem>
          <ListItem sx={{ px: 1 }}>
            <ListItemText
              primary="6. Сохраните изменения"
              primaryTypographyProps={{ variant: "body2" }}
            />
          </ListItem>
        </List>
      </Box>
    ),
  },
  {
    id: "prompts",
    title: "Промпты",
    icon: <Description color="primary" />,
    content: (
      <Box>
        <Typography variant="h6" gutterBottom>
          Создание промптов
        </Typography>

        <Typography variant="body2" paragraph>
          Промпт — это шаблон текста, который указывает, что именно нужно
          проанализировать в чате.
        </Typography>

        <Typography variant="subtitle2" gutterBottom>
          Примеры промптов:
        </Typography>
        <List dense sx={{ py: 0 }}>
          <ListItem sx={{ px: 1 }}>
            <ListItemText
              primary="«Перечисли самые обсуждаемые темы за день»"
              primaryTypographyProps={{ variant: "body2" }}
            />
          </ListItem>
          <ListItem sx={{ px: 1 }}>
            <ListItemText
              primary="«Найди негативные комментарии»"
              primaryTypographyProps={{ variant: "body2" }}
            />
          </ListItem>
          <ListItem sx={{ px: 1 }}>
            <ListItemText
              primary="«Найди все вопросы за сегодня»"
              primaryTypographyProps={{ variant: "body2" }}
            />
          </ListItem>
        </List>

        <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
          Как создать промпт:
        </Typography>
        <List dense sx={{ py: -1 }}>
          <ListItem sx={{ px: 1 }}>
            <ListItemText
              primary="1. Перейдите в раздел 'Промпты'"
              primaryTypographyProps={{ variant: "body2" }}
            />
          </ListItem>
          <ListItem sx={{ px: 1 }}>
            <ListItemText
              primary="2. Нажмите '+ Добавить промпт'"
              primaryTypographyProps={{ variant: "body2" }}
            />
          </ListItem>
          <ListItem sx={{ px: 1 }}>
            <ListItemText
              primary="3. Укажите название промпта"
              primaryTypographyProps={{ variant: "body2" }}
            />
          </ListItem>
          <ListItem sx={{ px: 1 }}>
            <ListItemText
              primary="4. Введите текст инструкции"
              primaryTypographyProps={{ variant: "body2" }}
            />
          </ListItem>
          <ListItem sx={{ px: 1 }}>
            <ListItemText
              primary="5. Сохраните промпт"
              primaryTypographyProps={{ variant: "body2" }}
            />
          </ListItem>
        </List>
      </Box>
    ),
  },
  {
    id: "schedules",
    title: "Расписания",
    icon: <Schedule color="primary" />,
    content: (
      <Box>
        <Typography variant="h6" gutterBottom>
          Настройка расписаний
        </Typography>

        <Typography variant="subtitle2" gutterBottom>
          Как настроить расписание:
        </Typography>
        <List dense sx={{ py: 0 }}>
          <ListItem sx={{ px: 1 }}>
            <ListItemText
              primary="1. Перейдите в раздел 'Расписания'"
              primaryTypographyProps={{ variant: "body2" }}
            />
          </ListItem>
          <ListItem sx={{ px: 1 }}>
            <ListItemText
              primary="2. Нажмите '+ Добавить расписание'"
              primaryTypographyProps={{ variant: "body2" }}
            />
          </ListItem>
          <ListItem sx={{ px: 1 }}>
            <ListItemText
              primary="3. Выберите компанию, бота, чат и промпт"
              primaryTypographyProps={{ variant: "body2" }}
            />
          </ListItem>
          <ListItem sx={{ px: 1 }}>
            <ListItemText
              primary="4. Укажите чат для отчёта"
              primaryTypographyProps={{ variant: "body2" }}
            />
          </ListItem>
          <ListItem sx={{ px: 1 }}>
            <ListItemText
              primary="5. Выберите тип расписания"
              primaryTypographyProps={{ variant: "body2" }}
            />
          </ListItem>
          <ListItem sx={{ px: 1 }}>
            <ListItemText
              primary="6. Укажите время выполнения"
              primaryTypographyProps={{ variant: "body2" }}
            />
          </ListItem>
          <ListItem sx={{ px: 1 }}>
            <ListItemText
              primary="7. Установите статус"
              primaryTypographyProps={{ variant: "body2" }}
            />
          </ListItem>
          <ListItem sx={{ px: 1 }}>
            <ListItemText
              primary="8. Сохраните расписание"
              primaryTypographyProps={{ variant: "body2" }}
            />
          </ListItem>
        </List>

        <Typography variant="body2" paragraph sx={{ mt: 1 }}>
          После сохранения расписание появится в списке и будет выполняться
          согласно заданным параметрам.
        </Typography>
      </Box>
    ),
  },
  {
    id: "analysis",
    title: "Анализ",
    icon: <Analytics color="primary" />,
    content: (
      <Box>
        <Typography variant="h6" gutterBottom>
          Как работать с анализом:
        </Typography>

        <List dense sx={{ py: 0 }}>
          <ListItem sx={{ px: 1 }}>
            <ListItemText
              primary="1. Перейдите в раздел 'Анализ'"
              primaryTypographyProps={{ variant: "body2" }}
            />
          </ListItem>
          <ListItem sx={{ px: 1 }}>
            <ListItemText
              primary="2. Используйте фильтры для поиска"
              primaryTypographyProps={{ variant: "body2" }}
            />
          </ListItem>
          <ListItem sx={{ px: 1 }}>
            <ListItemText
              primary="3. Для нового анализа выберите промпт и период"
              primaryTypographyProps={{ variant: "body2" }}
            />
          </ListItem>
          <ListItem sx={{ px: 1 }}>
            <ListItemText
              primary="4. Нажмите 'Запустить'"
              primaryTypographyProps={{ variant: "body2" }}
            />
          </ListItem>
        </List>
      </Box>
    ),
  },
];
