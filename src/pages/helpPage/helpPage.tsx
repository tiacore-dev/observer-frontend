"use client";

import type React from "react";
import { useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Divider,
  Paper,
  useTheme,
  useMediaQuery,
  Button,
  Card,
  CardContent,
  Stack,
  alpha,
  Fade,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  Table,
  TableHead,
} from "@mui/material";
import {
  ExpandMore,
  SmartToy,
  Business,
  Schedule,
  Description,
  CheckCircle,
  Info,
  Analytics,
  HelpOutline,
  Telegram,
  MenuBook,
  Support,
  ContactSupport,
  ArrowForward,
  Speed,
  TipsAndUpdates,
  BugReport,
  School,
  Rocket,
} from "@mui/icons-material";
import PublicPageLayout from "../../components/publicLayout/publicPageLayout";

export const HelpPage: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | false>(
    "quick-start"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedSection(isExpanded ? panel : false);
    };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const faqItems = [
    {
      question: "Что такое Observer и для чего он нужен?",
      answer:
        "Observer - это система для автоматизации анализа Telegram-чатов. Она позволяет настроить ботов для регулярного анализа сообщений в чатах и получения полезной информации о активности, настроениях участников и других метриках.",
    },
    {
      question: "Безопасно ли использовать Observer с моими чатами?",
      answer:
        "Да, Observer использует только официальные API Telegram и не хранит содержимое ваших сообщений. Все данные обрабатываются в зашифрованном виде и удаляются после анализа.",
    },
    {
      question: "Почему анализ занимает много времени?",
      answer:
        "Время анализа зависит от размера чата и сложности промпта. Большие чаты (>1000 сообщений) могут анализироваться до 5-10 минут. Упростите промпт или уменьшите период анализа для ускорения.",
    },
    {
      question: "Какие данные собирает Observer?",
      answer:
        "Observer собирает только метаданные сообщений (время, количество, авторы). Содержимое сообщений обрабатывается временно и не сохраняется в системе.",
    },
    {
      question: "Как создать бота в Telegram?",
      answer: (
        <span>
          1. Откройте чат с <em>@BotFather</em>, отправьте команду{" "}
          <em>/newbot</em>
          <br />
          2. Придумайте имя и username для бота (должен заканчиваться на{" "}
          <em>bot</em>)
          <br />
          3. Получите токен и добавьте бота в нужные чаты как администратора.
          <br />
          Теперь вы можете добавить бота в систему Observer в разделе{" "}
          <strong>«Боты»</strong>
        </span>
      ),
    },
    {
      question: "Как правильно настроить бота?",
      answer:
        "Для успешной работы бота его необходимо добавить в чат в качестве администратора. Убедитесь, что у него есть права на чтение и отправку сообщений. Также важно: после добавления бота в чате должно появиться хотя бы одно новое сообщение (от любого участника), чтобы система его активировала и он смог начать анализ.",
    },
    {
      question: "Как часто можно запускать анализ?",
      answer:
        "Анализ можно запускать по расписанию с минимальным интервалом 15 минут. Для больших чатов рекомендуем интервал не менее 1 часа.",
    },
    {
      question: "Где просмотреть результаты анализа?",
      answer: (
        <span>
          Результаты анализа доступны в двух местах:
          <br />
          1. В <strong>чате</strong>, для которого был запущен анализ (если вы
          выбирали отправку отчета).
          <br />
          2. В разделе <strong>«Результаты анализов»</strong>. Туда сохраняются
          все отчеты, в том числе те, что были запущены без отправки в чат.
          <br /> <br />
          Вы также можете в любой момент запустить новый анализ за любой период
          и просмотреть его результат в этом разделе.
        </span>
      ),
    },
  ];

  const popularTopics = [
    { label: "Создание бота", icon: <SmartToy />, section: "bots" },
    { label: "Настройка расписания", icon: <Schedule />, section: "schedules" },
    { label: "Проблемы с анализом", icon: <Analytics />, section: "analysis" },
    { label: "Безопасность", icon: <Info />, section: "faq" },
  ];

  const sections = [
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
                    Инструкция для ИИ, описывающая что именно нужно
                    анализировать в чате
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
                {/* <TableRow>
                  <TableCell>
                    <strong>Период анализа</strong>
                  </TableCell>
                  <TableCell>
                    Временной интервал сообщений для анализа (например, "за
                    последние 24 часа")
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Метаданные</strong>
                  </TableCell>
                  <TableCell>
                    Информация о сообщениях (время, автор), без содержимого
                  </TableCell>
                </TableRow> */}
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
            Если проблемы сохраняются, обратитесь в поддержку с описанием ошибки
            и скриншотами настроек.
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
            Пока в системе нет ни одной компании, другие функции будут
            недоступны.
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
            <Alert
              severity="info"
              sx={{ mt: 1, fontSize: isMobile ? "0.8rem" : "inherit" }}
            >
              Также важно: после добавления бота в чате должно появиться хотя бы
              одно новое сообщение (от любого участника), чтобы система его
              активировала и он смог начать анализ.
            </Alert>
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

          <Typography variant="subtitle2" gutterBottom></Typography>
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

          <Alert
            severity="info"
            sx={{ mt: 1, fontSize: isMobile ? "0.8rem" : "inherit" }}
          >
            Если данных за выбранный период нет, попробуйте выбрать другой
            интервал или чат.
          </Alert>
        </Box>
      ),
    },
    {
      id: "faq",
      title: "FAQ",
      icon: <HelpOutline color="primary" />,
      content: (
        <Box>
          {faqItems.map((item, index) => (
            <Accordion key={index} sx={{ mb: 0.5 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ fontSize: isMobile ? "0.8rem" : "inherit" }}
                >
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      ),
    },
  ];

  return (
    <PublicPageLayout maxWidth="lg">
      <Paper
        elevation={isMobile ? 0 : 1}
        sx={{
          p: isMobile ? 1.5 : 3,
          borderRadius: 2,
          background: theme.palette.background.paper,
        }}
      >
        {/* Заголовок */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <MenuBook
            color="primary"
            sx={{
              fontSize: 48,
              mb: 2,
              color: theme.palette.primary.main,
            }}
          />
          <Typography
            variant={isMobile ? "h4" : "h3"}
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              backgroundClip: "text",
              textFillColor: "transparent",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Центр помощи Observer
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            Все, что нужно знать для эффективной работы с системой
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Блок поддержки */}
        <Fade in={true} timeout={800}>
          <Card
            sx={{
              mb: 4,
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.primary.main,
                0.1
              )} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack
                direction={isMobile ? "column" : "row"}
                spacing={3}
                alignItems="center"
                justifyContent="space-between"
              >
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <ContactSupport color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      Нужна помощь или хотите поделиться идеей?
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Прежде чем писать в поддержку, проверьте разделы "Быстрый
                    старт" и "Решение проблем" - там есть ответы на большинство
                    вопросов
                  </Typography>

                  <Button
                    variant="contained"
                    startIcon={<Telegram />}
                    href="https://t.me/tiacore_support_bot"
                    target="_blank"
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      px: 3,
                      py: 1,
                    }}
                  >
                    Написать в поддержку
                  </Button>
                </Box>

                <Box
                  sx={{
                    display: { xs: "none", md: "block" },
                    flexShrink: 0,
                  }}
                >
                  {/* <Support
                    sx={{
                      fontSize: 80,
                      color: alpha(theme.palette.primary.main, 0.3),
                    }}
                  /> */}
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Fade>

        {/* Содержание справки */}
        <Box>
          {sections.map((section) => (
            <Accordion
              key={section.id}
              expanded={expandedSection === section.id}
              onChange={handleAccordionChange(section.id)}
              sx={{
                mb: 1,
                borderRadius: "12px !important",
                "&:before": {
                  display: "none",
                },
                "&.Mui-expanded": {
                  margin: "16px 0",
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{
                  borderRadius: 2,
                  backgroundColor:
                    expandedSection === section.id
                      ? alpha(theme.palette.primary.main, 0.05)
                      : "transparent",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.03),
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ color: theme.palette.primary.main }}>
                    {section.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={600}>
                    {section.title}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 3 }}>
                {section.content}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* Дополнительная помощь */}
        <Fade in={true} timeout={1200}>
          <Card
            sx={{
              mt: 4,
              p: 3,
              textAlign: "center",
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.success.main,
                0.1
              )} 0%, ${alpha(theme.palette.info.main, 0.1)} 100%)`,
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
              borderRadius: 2,
            }}
          >
            <Support color="success" sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Все еще нужна помощь?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Если вы не нашли ответ в руководстве, наша команда поддержки
              всегда готова помочь вам
            </Typography>
            <Button
              variant="outlined"
              endIcon={<ArrowForward />}
              href="https://t.me/tiacore_support_bot"
              target="_blank"
              sx={{
                textTransform: "none",
                borderRadius: 2,
                borderColor: theme.palette.success.main,
                color: theme.palette.success.main,
                "&:hover": {
                  backgroundColor: alpha(theme.palette.success.main, 0.1),
                  borderColor: theme.palette.success.dark,
                },
              }}
            >
              Связаться с поддержкой
            </Button>
          </Card>
        </Fade>
      </Paper>
    </PublicPageLayout>
  );
};
