import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePromptDetailsQuery } from "../../hooks/prompts/usePromptsQuery";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Button,
  Avatar,
  Chip,
  Stack,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import {
  useUpdatePrompt,
  useDeletePrompt,
} from "../../hooks/prompts/usePromptMutations";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PsychologyIcon from "@mui/icons-material/Psychology";
import HistoryIcon from "@mui/icons-material/History";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { EditPromptModal } from "./editPromptModal";
import { DeleteDialog } from "../../components/deleteDialog";
import { DetailsPageSkeleton } from "../../components/skeleton/detailsPageSkeleton";
import { useThemeMode } from "../../context/themeContext";

export const PromptDetailsPage: React.FC<{ developerMode: boolean }> = ({
  developerMode,
}) => {
  const theme = useThemeMode();

  const { promptId } = useParams<{ promptId: string }>();
  const navigate = useNavigate();
  const {
    data: prompt,
    isLoading,
    error,
  } = usePromptDetailsQuery(promptId || "");
  const updatePromptMutation = useUpdatePrompt();
  const deletePromptMutation = useDeletePrompt();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editData, setEditData] = useState({
    prompt_name: "",
    text: "",
  });

  React.useEffect(() => {
    if (prompt) {
      setEditData({
        prompt_name: prompt.prompt_name,
        text: prompt.text,
      });
    }
  }, [prompt]);

  const handleEditSubmit = async () => {
    if (!promptId) return;

    try {
      await updatePromptMutation.mutateAsync({
        prompt_id: promptId,
        updatedData: {
          prompt_name: editData.prompt_name,
          text: editData.text,
        },
      });
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating prompt:", error);
    }
  };

  const handleDelete = async () => {
    if (!promptId) return;

    try {
      await deletePromptMutation.mutateAsync(promptId);
      navigate("/prompts");
    } catch (error) {
      console.error("Error deleting prompt:", error);
    }
  };

  const handleEditDataChange = (field: string, value: string) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const CompactDetailItem = ({
    icon,
    label,
    value,
    multiline = false,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | React.ReactNode;
    multiline?: boolean;
  }) => (
    <Box sx={{ mb: 1.5, display: "flex", alignItems: "flex-start" }}>
      <Box sx={{ mr: 1, mt: 0.5 }}>{icon}</Box>
      <Box>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ fontWeight: 600, fontSize: "0.875rem" }}
        >
          {label}
        </Typography>
        {multiline ? (
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {value}
          </Typography>
        ) : (
          <Typography
            variant="body2"
            sx={{
              fontFamily:
                typeof value === "string" && value.match(/^\d+$/)
                  ? "monospace"
                  : "inherit",
            }}
          >
            {value}
          </Typography>
        )}
      </Box>
    </Box>
  );

  if (isLoading) {
    return (
      <DetailsPageSkeleton developerMode={developerMode} buttonCount={3} />
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

  if (!prompt) {
    return (
      <Box display="flex" justifyContent="center" mt={-1}>
        <Typography>Промпт не найден</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pl: 2, pr: 1, mt: -1, mb: -2, maxWidth: 1600, mx: "auto" }}>
      {/* Заголовок с основной информацией */}
      <Paper
        sx={{
          p: 3,
          mb: 1,
          background: theme.isDarkMode
            ? "linear-gradient(135deg, #6366f1aa 0%, #8b5cf6aa 100%)"
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "white",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "rgba(255,255,255,0.2)",
                fontSize: "1.5rem",
                fontWeight: "bold",
                mr: 3,
              }}
            >
              ПР
            </Avatar>
            <Box>
              <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: "bold", color: "white" }}
              >
                {prompt.prompt_name}
              </Typography>
              <Typography
                variant="h6"
                sx={{ opacity: 0.9, mb: 1, color: "white" }}
              >
                Промпт
              </Typography>
            </Box>
          </Box>

          {/* Кнопки действий */}
          <Stack direction="row" spacing={1}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              variant="contained"
              sx={{
                backgroundColor: "white",
                color: "#764ba2",
                "&:hover": {
                  backgroundColor: "#ffffffec",
                  backgroundImage: "none",
                },
                "& .MuiSvgIcon-root": {
                  color: "#764ba2",
                },
                backgroundImage: "none",
                boxShadow: "none",
                transition: "background-color 0.2s ease",
              }}
            >
              Назад
            </Button>
            <Button
              startIcon={<EditIcon />}
              onClick={() => setIsEditModalOpen(true)}
              variant="contained"
              sx={{
                backgroundColor: "white",
                color: "#764ba2",
                "&:hover": {
                  backgroundColor: "#ffffffec",
                  backgroundImage: "none",
                },
                "& .MuiSvgIcon-root": {
                  color: "#764ba2",
                },
                backgroundImage: "none",
                boxShadow: "none",
                transition: "background-color 0.2s ease",
              }}
            >
              Изменить
            </Button>
            <Button
              startIcon={<DeleteIcon />}
              onClick={() => setIsDeleteDialogOpen(true)}
              variant="contained"
              sx={{
                backgroundColor: "#ffffff",
                color: "#dc2626",
                "&:hover": {
                  backgroundColor: "#ffffffec",
                  backgroundImage: "none",
                },
                "& .MuiSvgIcon-root": {
                  color: "#dc2626",
                },
                backgroundImage: "none",
                boxShadow: "none",
                transition: "background-color 0.2s ease",
              }}
            >
              Удалить
            </Button>
          </Stack>
        </Box>
      </Paper>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Основные параметры */}
        <Card>
          <CardContent sx={{ p: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center" }}
            >
              <PsychologyIcon sx={{ mr: 1, color: "primary.main" }} />
              Промпт
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Typography
              variant="body1"
              component="pre"
              sx={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                fontFamily: "inherit",
                backgroundColor: "rgba(0, 0, 0, 0.02)",
                p: 2,
                borderRadius: 1,
                // borderLeft: "4px solid",
                // borderColor: "primary.main",
              }}
            >
              {prompt.text}
            </Typography>
          </CardContent>
        </Card>

        {/* Метаданные */}
        {developerMode && (
          <Card>
            <CardContent sx={{ p: 2 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center" }}
              >
                <FingerprintIcon sx={{ mr: 1, color: "primary.main" }} />
                Метаданные
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { sm: "1fr 1fr" },
                  gap: 3,
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <CompactDetailItem
                    icon={<FingerprintIcon color="primary" fontSize="small" />}
                    label="ID промпта"
                    value={prompt.prompt_id}
                  />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <CompactDetailItem
                    icon={<BusinessIcon color="primary" fontSize="small" />}
                    label="Компания"
                    value={prompt.company_id}
                  />
                  <CompactDetailItem
                    icon={
                      <CalendarTodayIcon color="primary" fontSize="small" />
                    }
                    label="Дата создания"
                    value={new Date(prompt.created_at).toLocaleString()}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>

      <EditPromptModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        editData={editData}
        onEditDataChange={handleEditDataChange}
        onSubmit={handleEditSubmit}
        isSubmitting={updatePromptMutation.isPending}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        isDeleting={deletePromptMutation.isPending}
      />
    </Box>
  );
};
