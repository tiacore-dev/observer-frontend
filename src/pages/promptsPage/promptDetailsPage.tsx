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
  IconButton,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  useMediaQuery,
  Theme,
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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { getInitials } from "../../components/appLayout/appLayout";

export const PromptDetailsPage: React.FC<{ developerMode: boolean }> = ({
  developerMode,
}) => {
  const theme = useThemeMode();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
    <Box
      sx={{
        pl: isMobile ? 1 : 2,
        pr: isMobile ? 1 : 2,
        mt: -1,
        mb: -2,
        maxWidth: 1600,
        mx: "auto",
      }}
    >
      {/* Заголовок с основной информацией */}
      <Paper
        sx={{
          p: isMobile ? 2 : 3,
          mb: 1,
          background: theme.isDarkMode
            ? "linear-gradient(135deg, #6366f1aa 0%, #8b5cf6aa 100%)"
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          position: "relative",
        }}
      >
        {isMobile && (
          <>
            <IconButton
              onClick={() => navigate(-1)}
              size="small"
              sx={{
                position: "absolute",
                top: 8,
                left: 8,
                zIndex: 1,
                color: "white",
                // backgroundColor: "rgba(255,255,255,0.2)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <IconButton
              onClick={handleMenuOpen}
              size="small"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 1,
                color: "white",
                backgroundColor: "rgba(255,255,255,0.1)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.2)",
                },
              }}
            >
              <MoreVertIcon />
            </IconButton>
          </>
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "center" : "center",
            justifyContent: "space-between",
            color: "white",
            gap: isMobile ? 2 : 0,
            pt: isMobile ? 4 : 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: isMobile ? "column" : "row",
              textAlign: isMobile ? "center" : "left",
              gap: isMobile ? 2 : 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {!isMobile && (
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "rgba(255,255,255,0.2)",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "white",
                    mr: 3,
                  }}
                >
                  {getInitials(prompt.prompt_name)}
                </Avatar>
              )}
              {/* <Box> */}
              <Typography
                variant={isMobile ? "h5" : "h4"}
                gutterBottom
                sx={{ fontWeight: "bold", color: "white" }}
              >
                {prompt.prompt_name}
              </Typography>
            </Box>
          </Box>

          {/* Кнопки действий */}
          {!isMobile && (
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
          )}
        </Box>
      </Paper>

      {/* Меню для мобильных */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          "& .MuiPaper-root": {
            minWidth: 180,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <MenuItem
          onClick={() => {
            setIsEditModalOpen(true);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Изменить
        </MenuItem>
        <MenuItem
          onClick={() => {
            setIsDeleteDialogOpen(true);
            handleMenuClose();
          }}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          Удалить
        </MenuItem>
      </Menu>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Основные параметры */}
        <Card>
          <CardContent sx={{ p: 2 }}>
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
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
                variant={isMobile ? "subtitle1" : "h6"}
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
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
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
