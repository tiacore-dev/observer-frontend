import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePromptDetailsQuery } from "../../hooks/prompts/usePromptsQuery";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import {
  useUpdatePrompt,
  useDeletePrompt,
} from "../../hooks/prompts/usePromptMutations";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { EditPromptModal } from "./editPromptModal";
import { DeleteDialog } from "../../components/deleteDialog";

export const PromptDetailsPage: React.FC<{ developerMode: boolean }> = ({
  developerMode,
}) => {
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

  if (!prompt) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography>Промпт не найден</Typography>
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

        <Button
          startIcon={<EditIcon />}
          onClick={() => setIsEditModalOpen(true)}
          variant="contained"
          color="primary"
          style={{ marginLeft: 8 }}
        >
          Редактировать
        </Button>
        <Button
          startIcon={<DeleteIcon />}
          onClick={() => setIsDeleteDialogOpen(true)}
          variant="contained"
          color="error"
          style={{ marginLeft: 8 }}
        >
          Удалить
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {prompt.prompt_name}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Текст промпта:</Typography>
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
            {prompt.text}
          </Typography>
        </Box>

        {developerMode && (
          <>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">ID:</Typography>
              <Typography variant="body1">{prompt.prompt_id}</Typography>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Дата создания:</Typography>
              <Typography variant="body1">
                {new Date(prompt.created_at).toLocaleString()}
              </Typography>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Компания:</Typography>
              <Typography variant="body1">{prompt.company_id}</Typography>
            </Box>
          </>
        )}
      </Paper>

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
