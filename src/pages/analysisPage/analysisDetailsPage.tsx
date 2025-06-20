import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAnalysDetailsQuery } from "../../hooks/analysis/useAnalysisQuery";
import { useCompaniesQuery } from "../../hooks/companies/useCompaniesQuery";
import { useChatsSelectQuery } from "../../hooks/chats/useChatsQuery";
import { usePromptsQuery } from "../../hooks/prompts/usePromptsQuery";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useCompanyMap } from "../../hooks/maps/useCompanyMap";
import { useChatMap } from "../../hooks/maps/useChatMap";
import { usePromptMap } from "../../hooks/maps/usePromptMap";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { DeleteDialog } from "../../components/deleteDialog";

export const AnalysisDetailsPage: React.FC<{ developerMode: boolean }> = ({
  developerMode,
}) => {
  const { analysisId } = useParams<{ analysisId: string }>();
  const navigate = useNavigate();
  const {
    data: analysis,
    isLoading: analysisLoading,
    error: analysisError,
  } = useAnalysDetailsQuery(analysisId || "");

  const {
    data: companiesData,
    isLoading: companiesLoading,
    error: companiesError,
  } = useCompaniesQuery();

  const {
    data: chatsData,
    isLoading: chatsLoading,
    error: chatsError,
  } = useChatsSelectQuery();

  const {
    data: promptsData,
    isLoading: promptsLoading,
    error: promptsError,
  } = usePromptsQuery();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const isLoading =
    analysisLoading || companiesLoading || chatsLoading || promptsLoading;
  const error = analysisError || companiesError || chatsError || promptsError;

  const companyMap = useCompanyMap();

  const chatMap = useChatMap();

  const promptMap = usePromptMap();

  //   const handleDelete = async () => {
  //     // Здесь будет логика удаления анализа
  //     // Пока просто закрываем диалог и возвращаемся назад
  //     setIsDeleteDialogOpen(false);
  //     navigate(-1);
  //   };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography color="error">
          Ошибка при загрузке данных: {(error as Error).message}
        </Typography>
      </Box>
    );
  }

  if (!analysis) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography>Анализ не найден</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "start", mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          variant="outlined"
        >
          Назад
        </Button>
        {/* 
        {developerMode && (
          <Button
            startIcon={<DeleteIcon />}
            onClick={() => setIsDeleteDialogOpen(true)}
            variant="contained"
            color="error"
            style={{ marginLeft: 8 }}
          >
            Удалить
          </Button>
        )} */}
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Результат анализа
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Текст результата:</Typography>
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
            {analysis.result_text || "Нет данных"}
          </Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Чат:</Typography>
          <Typography variant="body1">
            {chatMap.get(analysis.chat_id) || analysis.chat_id}
          </Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Промпт:</Typography>
          <Typography variant="body1">
            {promptMap.get(analysis.prompt_id) || analysis.prompt_id}
          </Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Использованные токены:</Typography>
          <Typography variant="body1">
            Входные: {analysis.tokens_input}, Выходные: {analysis.tokens_output}
          </Typography>
        </Box>

        {developerMode && (
          <>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">ID анализа:</Typography>
              <Typography variant="body1">{analysis.analysis_id}</Typography>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Дата создания:</Typography>
              <Typography variant="body1">
                {new Date(analysis.created_at).toLocaleString()}
              </Typography>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Период анализа:</Typography>
              <Typography variant="body1">
                {new Date(analysis.date_from).toLocaleDateString()} -{" "}
                {new Date(analysis.date_to).toLocaleDateString()}
              </Typography>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Компания:</Typography>
              <Typography variant="body1">
                {companyMap.get(analysis.company_id) || analysis.company_id}
              </Typography>
            </Box>

            {analysis.schedule_id && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">ID расписания:</Typography>
                <Typography variant="body1">{analysis.schedule_id}</Typography>
              </Box>
            )}
          </>
        )}
      </Paper>

      {/* <DeleteDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      /> */}
    </Box>
  );
};
