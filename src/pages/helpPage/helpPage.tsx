import type React from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
} from "@mui/material";
import {
  ExpandMore,
  SmartToy,
  Psychology,
  Schedule,
  Analytics,
  Business,
  Group,
  CheckCircle,
} from "@mui/icons-material";
import type { PageProps } from "../../App";

export const HelpPage: React.FC<PageProps> = ({ developerMode }) => {
  const scenarios = [
    {
      title: "1. Добавление компании",
      content: [
        "Компания — это организация, для которой вы настраиваете ботов, промпты и анализ.",
        "Пока в системе нет ни одной компании, другие функции будут недоступны.",
        "Перейдите в раздел Компании в левом меню или выберите в выпадающем списке в верхней части страницы.",
        "Нажмите кнопку + Добавить компанию.",
        "Введите название компании и, при необходимости, описание.",
        "Сохраните компанию.",
        "Она появится в списке, а в шапке сайта можно выбрать эту компанию из выпадающего списка.",
      ],
    },
    {
      title: "2. Подключение бота",
      content: [
        "Убедитесь, что бот уже создан в Telegram и добавлен администратором в нужные чаты.",
        "Как создать бота и получить токен — смотрите официальную инструкцию Telegram: BotFather",
        "В интерфейсе Observer откройте раздел Боты.",
        "Нажмите кнопку + Добавить бота.",
        "Введите данные бота (имя, токен, при необходимости комментарий).",
        "Сохраните изменения.",
        "Бот появится в списке, статус должен быть Активен.",
      ],
    },
    {
      title: "3. Создание промпта",
      content: [
        "Промпт — это шаблон текста, который указывает, что именно нужно проанализировать в чате.",
        "Например: «Перечисли самые обсуждаемые темы за день» или «Найди негативные комментарии»",
        "Перейдите в раздел Промпты.",
        "Нажмите кнопку + Добавить промпт.",
        "Заполните поля: Компания, Название промпта, Текст инструкции для анализа.",
        "Сохраните промпт.",
        "Он появится в списке промптов.",
      ],
    },
    {
      title: "4. Настройка расписания",
      content: [
        "Перейдите в раздел Расписания.",
        "Нажмите кнопку + Добавить расписание.",
        "В форме выберите: компанию, бот, анализируемый чат и нужный промпт.",
        "Шапка сообщения (необязательно) — добавляется к началу отчёта.",
        "Чат для отчёта — отметьте галочкой, куда будет отправлен результат.",
        "Тип расписания — Ежедневно, Одноразово, Интервал, Повторяющееся.",
        "Время выполнения — укажите дату и время.",
        "Стратегия отправки — например, относительно времени выполнения.",
        "Отправить через (минуты) — через какое время после формирования отчета он будет отправлен.",
        'Статус — включите, или выберите "выключен" если пока не планируете использовать это расписание.',
        "Нажмите Сохранить.",
      ],
    },
    {
      title: "5. Просмотр результатов анализа",
      content: [
        "Перейдите в раздел Анализ.",
        "В таблице отобразятся результаты для выбранной компании.",
        "Используйте фильтры и поиск сверху, чтобы найти нужный отчёт: по чату или по промпту.",
      ],
    },
  ];

  const pageDescriptions = [
    {
      title: "Боты",
      icon: <SmartToy color="primary" />,
      description:
        "На этой странице вы можете просмотреть список используемых вами ботов и добавить нового. Чтобы добавить бота, сначала создайте его через BotFather, затем введите полученный токен, нажав кнопку «Добавить бота».",
    },
    {
      title: "Промпты",
      icon: <Psychology color="primary" />,
      description:
        "На этой странице вы можете создавать и редактировать промпты, которые будут использоваться в чатах. Промпт задаёт, какие данные искать и как анализировать сообщения в чатах. Чтобы создать промпт, укажите текст задания и сохраните, например: «Ответь на следующие вопросы» или «Расскажи о чем шла речь».",
    },
    {
      title: "Расписания",
      icon: <Schedule color="primary" />,
      description:
        "На этой странице вы можете настроить расписание, по которому будет происходить анализ в чатах. Вы можете выбрать один из вариантов расписания. Если вы не уверены, начните с ежедневного — его проще всего настроить.",
    },
    {
      title: "Анализ",
      icon: <Analytics color="primary" />,
      description:
        "На этой странице вы можете просмотреть, какие анализы были выполнены ранее, а также запустить новый анализ. Для нового анализа выберите промпт, период и чат, затем нажмите «Запустить». Если данных за выбранный период нет — попробуйте выбрать другой интервал или чат.",
    },
    {
      title: "Компании",
      icon: <Business color="primary" />,
      description:
        "Используйте компании, чтобы группировать чаты и отчёты по направлениям бизнеса или отделам. Это поможет быстрее находить нужные данные.",
    },
    {
      title: "Аккаунты и чаты",
      icon: <Group color="primary" />,
      description:
        "На этой странице вы можете просматривать чаты с их участниками и задавать удобные имена пользователей, например с указанием их роли в проекте.",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Справка по использованию Observer
      </Typography>

      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          Observer — это платформа для автоматического анализа информации в
          чатах и группах Telegram
        </Typography>
        <Typography variant="body2">
          Мы помогаем сотрудникам получать краткие и полезные отчёты по заранее
          заданным сценариям, снижая рутинную нагрузку.
        </Typography>
      </Alert>

      {/* Возможности системы */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          С помощью Observer вы можете:
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <CheckCircle color="success" />
            </ListItemIcon>
            <ListItemText primary="Создавать промпты (шаблоны анализа)" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircle color="success" />
            </ListItemIcon>
            <ListItemText primary="Настраивать расписания анализа" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircle color="success" />
            </ListItemIcon>
            <ListItemText primary="Получать отчёты прямо в ваши чаты" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircle color="success" />
            </ListItemIcon>
            <ListItemText primary="Следить за активностью участников" />
          </ListItem>
        </List>
      </Paper>

      {/* Пошаговые сценарии */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Пошаговые сценарии использования
      </Typography>

      {scenarios.map((scenario, index) => (
        <Accordion key={index} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {scenario.title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              {scenario.content.map((step, stepIndex) => (
                <ListItem key={stepIndex}>
                  <ListItemIcon>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        backgroundColor: "primary.main",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                      }}
                    >
                      {stepIndex + 1}
                    </Box>
                  </ListItemIcon>
                  <ListItemText primary={step} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Описание страниц */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Описание разделов системы
      </Typography>

      <Box sx={{ display: "grid", gap: 2 }}>
        {pageDescriptions.map((page, index) => (
          <Card key={index} variant="outlined">
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                {page.icon}
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {page.title}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {page.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Заключение */}
      <Paper
        elevation={1}
        sx={{
          p: 3,
          mt: 4,
          backgroundColor: "primary.light",
          color: "primary.contrastText",
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
          Мы помогаем находить главное в ваших чатах и экономить время
        </Typography>
        <Typography variant="body1">
          Настраивайте ботов для сбора сообщений, создавайте промпты для
          анализа, получайте отчёты по расписанию и следите за активностью
          участников — всё, чтобы важное было у вас под рукой.
        </Typography>
      </Paper>

      {developerMode && (
        <Paper
          elevation={1}
          sx={{ p: 2, mt: 2, backgroundColor: "warning.light" }}
        >
          <Typography variant="body2">
            <strong>Режим разработчика активен:</strong> Отображается
            дополнительная техническая информация
          </Typography>
        </Paper>
      )}
    </Container>
  );
};
