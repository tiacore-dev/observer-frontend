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
  TextField,
  InputAdornment,
  Chip,
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
  PlayArrow,
  Search,
  Telegram,
  Email,
  MenuBook,
  Support,
  LiveHelp,
} from "@mui/icons-material";

export const HelpPage: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | false>(
    "getting-started"
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
      answer:
        "Откройте чат с @BotFather, отправьте команду /newbot, придумайте имя и username для бота (должен заканчиваться на 'bot'). Получите токен и добавьте бота в нужные чаты как администратора.",
    },
    {
      question: "Сколько ботов можно подключить?",
      answer:
        "Количество ботов не ограничено, но каждый бот должен быть уникальным и правильно настроенным в Telegram.",
    },
    {
      question: "Как часто можно запускать анализ?",
      answer:
        "Анализ можно запускать по расписанию с минимальным интервалом 15 минут. Для больших чатов рекомендуем интервал не менее 1 часа.",
    },
    {
      question: "Где просмотреть результаты анализа?",
      answer:
        "Все результаты доступны в разделе 'Анализ'. Вы можете фильтровать их по компании, чату или промпту.",
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
      id: "getting-started",
      title: "Начало работы",
      icon: <PlayArrow color="primary" />,
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>
            Краткое руководство
          </Typography>

          <Typography variant="body2" paragraph>
            Observer — это платформа для автоматического анализа информации в
            чатах и группах Telegram. Мы помогаем сотрудникам получать краткие и
            полезные отчёты по заранее заданным сценариям.
          </Typography>

          <Alert
            severity="info"
            sx={{ mb: 2, fontSize: isMobile ? "0.8rem" : "inherit" }}
          >
            Для работы системы вам понадобится Telegram-бот. Создайте его через
            @BotFather в Telegram.
          </Alert>

          <Typography variant="subtitle2" gutterBottom>
            Основные шаги:
          </Typography>
          <List dense sx={{ py: 0 }}>
            <ListItem sx={{ px: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CheckCircle color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="1. Добавьте компанию"
                primaryTypographyProps={{ variant: "body2" }}
              />
            </ListItem>
            <ListItem sx={{ px: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CheckCircle color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="2. Подключите бота"
                primaryTypographyProps={{ variant: "body2" }}
              />
            </ListItem>
            <ListItem sx={{ px: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CheckCircle color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="3. Создайте промпт"
                primaryTypographyProps={{ variant: "body2" }}
              />
            </ListItem>
            <ListItem sx={{ px: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CheckCircle color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="4. Настройте расписание"
                primaryTypographyProps={{ variant: "body2" }}
              />
            </ListItem>
          </List>
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
            Компания — это организация, для которой вы настраиваете ботов,
            промпты и анализ. Пока в системе нет ни одной компании, другие
            функции будут недоступны.
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
            выбрать её из выпадающего списка.
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
          <List dense sx={{ py: 0 }}>
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
                primary="3. Выберите компанию из списка"
                primaryTypographyProps={{ variant: "body2" }}
              />
            </ListItem>
            <ListItem sx={{ px: 1 }}>
              <ListItemText
                primary="4. Укажите название промпта"
                primaryTypographyProps={{ variant: "body2" }}
              />
            </ListItem>
            <ListItem sx={{ px: 1 }}>
              <ListItemText
                primary="5. Введите текст инструкции"
                primaryTypographyProps={{ variant: "body2" }}
              />
            </ListItem>
            <ListItem sx={{ px: 1 }}>
              <ListItemText
                primary="6. Сохраните промпт"
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
            Просмотр результатов
          </Typography>

          <Typography variant="body2" paragraph>
            В этом разделе вы можете просмотреть все выполненные анализы и их
            результаты.
          </Typography>

          <Typography variant="subtitle2" gutterBottom>
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
                primary="2. Выберите компанию из списка"
                primaryTypographyProps={{ variant: "body2" }}
              />
            </ListItem>
            <ListItem sx={{ px: 1 }}>
              <ListItemText
                primary="3. Используйте фильтры для поиска"
                primaryTypographyProps={{ variant: "body2" }}
              />
            </ListItem>
            <ListItem sx={{ px: 1 }}>
              <ListItemText
                primary="4. Для нового анализа выберите промпт и период"
                primaryTypographyProps={{ variant: "body2" }}
              />
            </ListItem>
            <ListItem sx={{ px: 1 }}>
              <ListItemText
                primary="5. Нажмите 'Запустить'"
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
          <Typography variant="h6" gutterBottom>
            Часто задаваемые вопросы
          </Typography>

          {faqItems.map((item, index) => (
            <Accordion key={index} sx={{ mb: 0.5 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
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

          <Alert
            severity="info"
            sx={{ mt: 2, fontSize: isMobile ? "0.8rem" : "inherit" }}
          >
            Не нашли ответ на свой вопрос? Обратитесь в службу поддержки.
          </Alert>
        </Box>
      ),
    },
  ];

  return (
    <Box
      sx={{
        p: isMobile ? 1 : 2,
        mt: isMobile ? 0 : -3,
        mb: isMobile ? 2 : -3,
        maxWidth: 1600,
        mx: "auto",
      }}
    >
      <Paper elevation={isMobile ? 0 : 1} sx={{ p: isMobile ? 1.5 : 2 }}>
        <Typography
          variant={isMobile ? "h4" : "h3"}
          component="h1"
          gutterBottom
        >
          Центр помощи
        </Typography>
        <Typography
          variant={isMobile ? "body1" : "h6"}
          color="text.secondary"
          gutterBottom
        >
          Справка, поддержка и ответы на вопросы
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <LiveHelp color="primary" />
            Быстрая помощь
          </Typography>

          <TextField
            fullWidth
            placeholder="Поиск по справке..."
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />

          <Typography variant="subtitle2" gutterBottom>
            Популярные темы:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            {popularTopics.map((topic) => (
              <Chip
                key={topic.label}
                icon={topic.icon}
                label={topic.label}
                onClick={() => setExpandedSection(topic.section)}
                variant="outlined"
                sx={{ cursor: "pointer" }}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Support color="primary" />
            Получить помощь
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 2,
            }}
          >
            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <Telegram color="primary" />
                  <Typography variant="h6">Telegram поддержка</Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Напишите нашему боту для быстрой помощи
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Telegram />}
                  href="https://t.me/tiacore_support_bot"
                  target="_blank"
                  fullWidth
                  sx={{ textTransform: "none" }}
                >
                  Написать в Telegram
                </Button>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: "block" }}
                >
                  Обычно отвечаем в течение 15 минут
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <Email color="primary" />
                  <Typography variant="h6">Email поддержка</Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Отправьте подробное описание проблемы
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Email />}
                  href="mailto:support@observer.com"
                  fullWidth
                  sx={{ textTransform: "none" }}
                >
                  Написать на email
                </Button>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: "block" }}
                >
                  Ответим в течение 24 часов
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <MenuBook color="primary" />
          Справочная информация
        </Typography>

        <Typography variant="body2" paragraph>
          Observer помогает находить главное в ваших чатах и экономить время.
          Настраивайте ботов для сбора сообщений, создавайте промпты для
          анализа, получайте отчёты по расписанию и следите за активностью
          участников.
        </Typography>

        {sections.map((section) => (
          <Accordion
            key={section.id}
            expanded={expandedSection === section.id}
            onChange={handleAccordionChange(section.id)}
            sx={{ mb: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {section.icon}
                <Typography variant={isMobile ? "subtitle1" : "h6"}>
                  {section.title}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: isMobile ? 1.5 : 2 }}>
              {section.content}
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>
    </Box>
  );
};
