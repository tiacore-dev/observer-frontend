"use client";

import type React from "react";
import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Grid,
  Divider,
  Chip,
  Paper,
} from "@mui/material";
import {
  ExpandMore,
  SmartToy,
  Business,
  Schedule,
  Description,
  Group,
  Settings,
  HelpOutline,
  PlayArrow,
  CheckCircle,
  Info,
  Analytics,
} from "@mui/icons-material";

export const HelpPage: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | false>(
    "getting-started"
  );

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedSection(isExpanded ? panel : false);
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

  const sections = [
    {
      id: "getting-started",
      title: "Начало работы",
      icon: <PlayArrow color="primary" />,
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>
            Краткое руководство по началу работы
          </Typography>

          <Typography paragraph>
            Observer — это платформа для автоматического анализа информации в
            чатах и группах Telegram. Мы помогаем сотрудникам получать краткие и
            полезные отчёты по заранее заданным сценариям.
          </Typography>

          <Alert severity="info" sx={{ mb: 3 }}>
            Для работы системы вам понадобится Telegram-бот. Создайте его через
            @BotFather в Telegram.
          </Alert>

          <Typography variant="subtitle1" gutterBottom>
            Основные шаги:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="1. Добавьте компанию" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="2. Подключите бота" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="3. Создайте промпт" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="4. Настройте расписание" />
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

          <Typography paragraph>
            Компания — это организация, для которой вы настраиваете ботов,
            промпты и анализ. Пока в системе нет ни одной компании, другие
            функции будут недоступны.
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            Как добавить компанию:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="1. Перейдите в раздел 'Компании'" />
            </ListItem>
            <ListItem>
              <ListItemText primary="2. Нажмите кнопку '+ Добавить компанию'" />
            </ListItem>
            <ListItem>
              <ListItemText primary="3. Введите название и описание (необязательно)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="4. Сохраните компанию" />
            </ListItem>
          </List>

          <Typography paragraph sx={{ mt: 2 }}>
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

          <Typography variant="subtitle1" gutterBottom>
            Как подключить бота:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="1. Создайте бота через @BotFather в Telegram" />
            </ListItem>
            <ListItem>
              <ListItemText primary="2. Добавьте бота в нужные чаты как администратора" />
            </ListItem>
            <ListItem>
              <ListItemText primary="3. В интерфейсе Observer откройте раздел 'Боты'" />
            </ListItem>
            <ListItem>
              <ListItemText primary="4. Нажмите '+ Добавить бота'" />
            </ListItem>
            <ListItem>
              <ListItemText primary="5. Введите имя и токен бота" />
            </ListItem>
            <ListItem>
              <ListItemText primary="6. Сохраните изменения" />
            </ListItem>
          </List>

          <Alert severity="warning" sx={{ mt: 2 }}>
            Никогда не делитесь токеном бота с посторонними. Это ключ доступа к
            вашему боту.
          </Alert>
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

          <Typography paragraph>
            Промпт — это шаблон текста, который указывает, что именно нужно
            проанализировать в чате.
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            Примеры промптов:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="«Перечисли самые обсуждаемые темы за день»" />
            </ListItem>
            <ListItem>
              <ListItemText primary="«Найди негативные комментарии»" />
            </ListItem>
            <ListItem>
              <ListItemText primary="«Найди и перечисли все вопросы, которые задавали в чате сегодня»" />
            </ListItem>
          </List>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Как создать промпт:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="1. Перейдите в раздел 'Промпты'" />
            </ListItem>
            <ListItem>
              <ListItemText primary="2. Нажмите '+ Добавить промпт'" />
            </ListItem>
            <ListItem>
              <ListItemText primary="3. Выберите компанию из списка" />
            </ListItem>
            <ListItem>
              <ListItemText primary="4. Укажите название промпта" />
            </ListItem>
            <ListItem>
              <ListItemText primary="5. Введите текст инструкции для анализа" />
            </ListItem>
            <ListItem>
              <ListItemText primary="6. Сохраните промпт" />
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
            Настройка расписаний анализа
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            Как настроить расписание:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="1. Перейдите в раздел 'Расписания'" />
            </ListItem>
            <ListItem>
              <ListItemText primary="2. Нажмите '+ Добавить расписание'" />
            </ListItem>
            <ListItem>
              <ListItemText primary="3. Выберите компанию, бота, чат и промпт" />
            </ListItem>
            <ListItem>
              <ListItemText primary="4. Укажите чат для отчёта (бот должен быть добавлен в него)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="5. Выберите тип расписания (ежедневно, одноразово и т.д.)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="6. Укажите время выполнения" />
            </ListItem>
            <ListItem>
              <ListItemText primary="7. Установите статус (включено/выключено)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="8. Сохраните расписание" />
            </ListItem>
          </List>

          <Typography paragraph sx={{ mt: 2 }}>
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
            Просмотр результатов анализа
          </Typography>

          <Typography paragraph>
            В этом разделе вы можете просмотреть все выполненные анализы и их
            результаты.
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            Как работать с анализом:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="1. Перейдите в раздел 'Анализ'" />
            </ListItem>
            <ListItem>
              <ListItemText primary="2. Выберите компанию из списка" />
            </ListItem>
            <ListItem>
              <ListItemText primary="3. Используйте фильтры для поиска нужных отчётов" />
            </ListItem>
            <ListItem>
              <ListItemText primary="4. Для нового анализа выберите промпт, период и чат" />
            </ListItem>
            <ListItem>
              <ListItemText primary="5. Нажмите 'Запустить'" />
            </ListItem>
          </List>

          <Alert severity="info" sx={{ mt: 2 }}>
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
            <Accordion key={index} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle2">{item.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">{item.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}

          <Alert severity="info" sx={{ mt: 3 }}>
            Не нашли ответ на свой вопрос? Обратитесь в службу поддержки.
          </Alert>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ pl: 2, pr: 2, mt: -1, maxWidth: 1600, mx: "auto" }}>
      <Paper elevation={1} sx={{ p: 2, mb: 1 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Справочная система
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Полное руководство по использованию Observer
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body1" paragraph>
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
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {section.icon}
                <Typography variant="h6">{section.title}</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>{section.content}</AccordionDetails>
          </Accordion>
        ))}
      </Paper>
    </Box>
  );
};
