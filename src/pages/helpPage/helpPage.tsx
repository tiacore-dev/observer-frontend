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
  Paper,
  Divider,
  Chip,
} from "@mui/material";
import {
  ExpandMore,
  SmartToy,
  Psychology,
  Schedule,
  Analytics,
  Info,
  Warning,
  CheckCircle,
  PlayArrow,
  Settings,
  QuestionAnswer,
  HelpOutline,
  Error,
  Security,
  Speed,
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
      category: "Общие вопросы",
      icon: <HelpOutline color="primary" />,
      questions: [
        {
          question: "Что такое Observer и для чего он нужен?",
          answer:
            "Observer - это система для автоматизации анализа Telegram-чатов. Она позволяет настроить ботов для регулярного анализа сообщений в чатах и получения полезной информации о активности, настроениях участников и других метриках.",
        },
        {
          question: "Сколько ботов я могу подключить?",
          answer:
            "Количество ботов зависит от вашего тарифного плана. В базовой версии можно подключить до 5 ботов, в расширенной - до 50 ботов.",
        },
        {
          question: "Безопасно ли использовать Observer с моими чатами?",
          answer:
            "Да, Observer использует только официальные API Telegram и не хранит содержимое ваших сообщений. Все данные обрабатываются в зашифрованном виде и удаляются после анализа.",
        },
        {
          question: "Можно ли анализировать приватные чаты?",
          answer:
            "Да, но для этого бот должен быть добавлен в чат и иметь соответствующие разрешения. Владелец чата должен дать согласие на анализ.",
        },
      ],
    },
    {
      category: "Настройка и использование",
      icon: <Settings color="secondary" />,
      questions: [
        {
          question: "Как часто можно запускать анализ чатов?",
          answer:
            "Минимальный интервал между анализами - 15 минут. Рекомендуется не запускать анализ чаще чем раз в час для больших чатов, чтобы не превысить лимиты API.",
        },
        {
          question: "Что делать, если бот не отвечает на команды?",
          answer:
            "Проверьте: 1) Активен ли бот в системе, 2) Правильно ли указан токен, 3) Добавлен ли бот в целевой чат, 4) Есть ли у бота права администратора в чате.",
        },
        {
          question: "Можно ли изменить расписание после создания?",
          answer:
            "Да, все расписания можно редактировать. Изменения вступают в силу немедленно. Активные задачи будут выполнены по старому расписанию, новые - по обновленному.",
        },
        {
          question: "Как создать эффективный промпт для анализа?",
          answer:
            "Хороший промпт должен быть конкретным и содержать четкие инструкции. Используйте переменные {date}, {time}, {chat_name} для персонализации. Избегайте слишком длинных промптов - оптимальная длина 100-300 символов.",
        },
      ],
    },
    {
      category: "Технические вопросы",
      icon: <Error color="warning" />,
      questions: [
        {
          question: "Что означает ошибка 'Chat not found'?",
          answer:
            "Эта ошибка означает, что бот не может найти указанный чат. Возможные причины: неправильный ID чата, бот не добавлен в чат, или чат был удален/заархивирован.",
        },
        {
          question: "Почему анализ занимает много времени?",
          answer:
            "Время анализа зависит от размера чата и сложности промпта. Большие чаты (>1000 сообщений) могут анализироваться до 5-10 минут. Упростите промпт или уменьшите период анализа для ускорения.",
        },
        {
          question: "Что делать при превышении лимита токенов?",
          answer:
            "Лимит токенов зависит от вашего тарифа. Для экономии токенов: сократите промпты, увеличьте интервалы между анализами, анализируйте только активные периоды чатов.",
        },
        {
          question: "Как получить ID чата в Telegram?",
          answer:
            "Добавьте бота @userinfobot в ваш чат и отправьте команду /start. Бот покажет ID чата. Альтернативно, используйте @RawDataBot для получения технической информации о чате.",
        },
      ],
    },
    {
      category: "Безопасность и приватность",
      icon: <Security color="success" />,
      questions: [
        {
          question: "Какие данные собирает Observer?",
          answer:
            "Observer собирает только метаданные сообщений (время, количество, авторы) и результаты анализа. Содержимое сообщений обрабатывается временно и не сохраняется в системе.",
        },
        {
          question: "Могут ли участники чата узнать об анализе?",
          answer:
            "Нет, анализ происходит незаметно для участников чата. Бот не отправляет сообщения в чат во время анализа, только собирает данные для обработки.",
        },
        {
          question: "Как удалить все данные из системы?",
          answer:
            "В настройках аккаунта есть опция 'Удалить все данные'. Это действие необратимо и удалит все ваши боты, расписания, анализы и связанные данные.",
        },
        {
          question: "Соответствует ли Observer требованиям GDPR?",
          answer:
            "Да, Observer полностью соответствует требованиям GDPR. Мы не храним персональные данные пользователей чатов, обрабатываем только анонимизированную статистику.",
        },
      ],
    },
    {
      category: "Оплата и тарифы",
      icon: <Speed color="info" />,
      questions: [
        {
          question: "Есть ли бесплатный тариф?",
          answer:
            "Да, базовый тариф включает 5 ботов, 100 анализов в месяц и базовые функции. Этого достаточно для небольших проектов и тестирования системы.",
        },
        {
          question: "Как происходит оплата за токены?",
          answer:
            "Токены списываются автоматически при выполнении анализов. Стоимость зависит от сложности промпта и размера анализируемых данных. Подробная статистика доступна в разделе 'Анализ'.",
        },
        {
          question: "Можно ли изменить тариф в любое время?",
          answer:
            "Да, тариф можно повысить в любое время. При понижении тарифа изменения вступят в силу с начала следующего расчетного периода.",
        },
        {
          question: "Что происходит при превышении лимитов?",
          answer:
            "При превышении лимитов новые анализы приостанавливаются до начала нового периода или повышения тарифа. Уже настроенные расписания сохраняются.",
        },
      ],
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
            Пошаговое руководство для новых пользователей
          </Typography>

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Важно:</strong> Для работы системы вам понадобится
              Telegram-бот. Создайте его через @BotFather в Telegram и получите
              токен.
            </Typography>
          </Alert>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
            Шаг 1: Создание компании
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Перейдите в раздел 'Компании'" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Нажмите 'Добавить компанию'" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Заполните название и описание" />
            </ListItem>
          </List>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Шаг 2: Добавление бота
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Создайте бота через @BotFather в Telegram" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Скопируйте токен бота" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="В разделе 'Боты' добавьте нового бота с токеном" />
            </ListItem>
          </List>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Шаг 3: Создание промпта
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Перейдите в раздел 'Промпты'" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Создайте шаблон сообщения" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Используйте переменные типа {date}, {time}" />
            </ListItem>
          </List>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Шаг 4: Настройка расписания
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="В разделе 'Расписания' создайте новое расписание" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Выберите бота, промпт и целевой чат" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Настройте время и частоту отправки" />
            </ListItem>
          </List>
        </Box>
      ),
    },
    {
      id: "bots",
      title: "Управление ботами",
      icon: <SmartToy color="primary" />,
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>
            Все о Telegram-ботах в системе
          </Typography>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
            Что такое боты?
          </Typography>
          <Typography variant="body2" paragraph>
            Telegram-боты - это автоматизированные аккаунты, которые могут
            отправлять сообщения в чаты по заданному расписанию. Каждый бот
            имеет уникальный токен для авторизации.
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            Как создать бота?
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <PlayArrow color="info" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Найдите @BotFather в Telegram" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PlayArrow color="info" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Отправьте команду /newbot" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PlayArrow color="info" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Следуйте инструкциям для создания бота" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PlayArrow color="info" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Скопируйте полученный токен" />
            </ListItem>
          </List>

          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Важно:</strong> Никогда не делитесь токеном бота с
              посторонними. Это ключ доступа к вашему боту.
            </Typography>
          </Alert>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
            Статусы ботов
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Активный"
                secondary="Бот может отправлять сообщения по расписанию"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Warning color="warning" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Неактивный"
                secondary="Бот не будет отправлять сообщения"
              />
            </ListItem>
          </List>
        </Box>
      ),
    },
    {
      id: "prompts",
      title: "Работа с промптами",
      icon: <Psychology color="secondary" />,
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>
            Создание и управление шаблонами сообщений
          </Typography>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
            Что такое промпты?
          </Typography>
          <Typography variant="body2" paragraph>
            Промпты - это шаблоны текстовых сообщений, которые боты отправляют в
            чаты. Они могут содержать статический текст, переменные и
            форматирование.
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            Доступные переменные
          </Typography>
          <Grid container spacing={2}>
            <Grid>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Дата и время
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="{date}" secondary="Текущая дата" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="{time}" secondary="Текущее время" />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="{datetime}"
                      secondary="Дата и время"
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
            <Grid>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Системные
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="{bot_name}" secondary="Имя бота" />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="{chat_name}"
                      secondary="Название чата"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="{company}"
                      secondary="Название компании"
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
            Форматирование текста (Markdown)
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText
                primary="*жирный текст*"
                secondary="Выделение жирным"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="_курсивный текст_"
                secondary="Выделение курсивом"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="`моноширинный`"
                secondary="Моноширинный шрифт"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="[ссылка](https://example.com)"
                secondary="Создание ссылки"
              />
            </ListItem>
          </List>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Совет:</strong> Тестируйте промпты перед использованием в
              расписаниях. Проверьте, как выглядят переменные и форматирование.
            </Typography>
          </Alert>
        </Box>
      ),
    },
    {
      id: "schedules",
      title: "Настройка расписаний",
      icon: <Schedule color="info" />,
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>
            Автоматизация отправки сообщений
          </Typography>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
            Типы расписаний
          </Typography>

          <Grid container spacing={2}>
            <Grid>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    По интервалам
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Отправка сообщений через определенные промежутки времени
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Примеры: каждые 30 минут, каждые 2 часа, каждый день
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    По дням недели
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Отправка в определенные дни недели и время
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Примеры: каждый понедельник в 9:00, по будням в 18:00
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
            Стратегии отправки
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <Info color="info" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Всем участникам"
                secondary="Отправка сообщения всем участникам чата"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Info color="info" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Случайному участнику"
                secondary="Отправка сообщения одному случайному участнику"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Info color="info" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="В общий чат"
                secondary="Отправка сообщения в общий чат"
              />
            </ListItem>
          </List>

          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Внимание:</strong> Убедитесь, что бот добавлен в целевой
              чат и имеет права на отправку сообщений.
            </Typography>
          </Alert>
        </Box>
      ),
    },
    {
      id: "analysis",
      title: "Анализ и мониторинг",
      icon: <Analytics color="success" />,
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>
            Отслеживание работы системы
          </Typography>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
            Что показывает анализ?
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="История отправленных сообщений" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Статистика по ботам и чатам" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Ошибки и проблемы доставки" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Эффективность расписаний" />
            </ListItem>
          </List>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
            Как использовать данные анализа?
          </Typography>
          <Typography variant="body2" paragraph>
            Регулярно проверяйте раздел анализа для:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <PlayArrow color="info" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Контроля работы ботов" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PlayArrow color="info" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Выявления проблем с доставкой" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PlayArrow color="info" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Оптимизации расписаний" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PlayArrow color="info" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Анализа активности чатов" />
            </ListItem>
          </List>
        </Box>
      ),
    },
    {
      id: "troubleshooting",
      title: "Решение проблем",
      icon: <Settings color="warning" />,
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>
            Частые проблемы и их решения
          </Typography>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle2">
                Бот не отправляет сообщения
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Проверьте, что бот активен" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Убедитесь, что расписание включено" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Проверьте токен бота" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Убедитесь, что бот добавлен в чат" />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle2">Ошибка доступа к чату</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Добавьте бота в целевой чат" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Дайте боту права администратора" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Проверьте ID чата" />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle2">
                Переменные в промптах не работают
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Проверьте правильность написания переменных" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Используйте фигурные скобки: {variable}" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Убедитесь в поддержке переменной системой" />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>Нужна помощь?</strong> Если проблема не решается,
              обратитесь к администратору системы или проверьте логи в разделе
              анализа.
            </Typography>
          </Alert>
        </Box>
      ),
    },
    {
      id: "faq",
      title: "Часто задаваемые вопросы",
      icon: <QuestionAnswer color="primary" />,
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>
            Ответы на самые популярные вопросы
          </Typography>

          <Typography variant="body2" color="text.secondary" paragraph>
            Здесь собраны ответы на вопросы, которые чаще всего задают
            пользователи Observer
          </Typography>

          {faqItems.map((category, categoryIndex) => (
            <Box key={categoryIndex} sx={{ mb: 4 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                {category.icon}
                <Typography variant="h6" color="primary">
                  {category.category}
                </Typography>
                <Chip
                  label={`${category.questions.length} вопросов`}
                  size="small"
                  variant="outlined"
                />
              </Box>

              {category.questions.map((item, questionIndex) => (
                <Accordion key={questionIndex} sx={{ mb: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                      {item.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      {item.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          ))}

          <Alert severity="info" sx={{ mt: 4 }}>
            <Typography variant="body2">
              <strong>Не нашли ответ на свой вопрос?</strong> Обратитесь в
              службу поддержки или изучите подробные руководства в других
              разделах справки.
            </Typography>
          </Alert>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: "auto" }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Справочная система
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Полное руководство по использованию Observer
      </Typography>

      <Divider sx={{ my: 3 }} />

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

      <Card
        sx={{
          mt: 4,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Нужна дополнительная помощь?
          </Typography>
          <Typography variant="body1" paragraph>
            Если вы не нашли ответ на свой вопрос в этой справке, вы можете:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Info sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Обратиться к администратору системы" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Analytics sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Проверить логи в разделе 'Анализ'" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Settings sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Включить режим разработчика для дополнительной информации" />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};
