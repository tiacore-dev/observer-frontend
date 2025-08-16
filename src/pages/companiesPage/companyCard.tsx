// src/components/companyCard.tsx
import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Stack,
  Card,
  CardContent,
  Avatar,
  Chip,
  CardHeader,
  IconButton,
} from "@mui/material";
import { ICompany } from "../../api/companiesApi";
import { useNavigate } from "react-router-dom";
import { useDeleteCompany } from "../../hooks/companies/useCompaniesMutations";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DeleteDialog } from "../../components/deleteDialog";
import { useCompanyDetailsQuery } from "../../hooks/companies/useCompaniesQuery";
import { EditCompanyModal } from "./editCompanyModal";
import { DetailsPageSkeleton } from "../../components/skeleton/detailsPageSkeleton";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import { useCompanyUsers } from "../../hooks/users/useUsersQuery";
import { UsersTable } from "./usersTable";
import { InviteUserModal } from "./inviteUserModal";
import { useThemeMode } from "../../context/themeContext";
import AddIcon from "@mui/icons-material/Add";

interface CompanyCardProps {
  company: ICompany;
  developerMode: boolean;
}

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

export const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  developerMode,
}) => {
  const theme = useThemeMode();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const { data: companyDetails, isLoading } = useCompanyDetailsQuery(
    company.company_id
  );
  const { mutate: deleteCompany, isPending: isDeleting } = useDeleteCompany();
  const { data: usersData, isLoading: isLoadingUsers } = useCompanyUsers(
    company.company_id
  );

  const handleDelete = () => {
    deleteCompany(company.company_id, {
      onSuccess: () => {
        navigate("/companies");
      },
    });
  };

  if (isLoading) {
    return <DetailsPageSkeleton developerMode={developerMode} />;
  }

  const currentCompany = companyDetails || company;

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
                color: "white",
              }}
            >
              {currentCompany.company_name
                .split(" ")
                .map((word: string) => word[0].toUpperCase())
                .join("")
                .substring(0, 2)}
            </Avatar>
            <Box>
              <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: "bold", color: "white" }}
              >
                {currentCompany.company_name}
              </Typography>
              <Typography
                variant="h6"
                sx={{ opacity: 0.9, mb: 1, color: "white" }}
              >
                {currentCompany.description}
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
              onClick={() => setEditModalOpen(true)}
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
              onClick={() => setDeleteDialogOpen(true)}
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
        {/* Основная информация */}

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
                    label="ID компании"
                    value={currentCompany.company_id}
                  />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <CompactDetailItem
                    icon={
                      <CalendarTodayIcon color="primary" fontSize="small" />
                    }
                    label="Дата создания"
                    value={new Date(currentCompany.created_at).toLocaleString()}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Пользователи компании */}
        {/* Users Section */}
        <Paper sx={{ p: 0 }} elevation={0}>
          <Card>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: "primary.main", color: "white" }}>
                  <PeopleIcon />
                </Avatar>
              }
              title="Пользователи компании"
              action={
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => setInviteModalOpen(true)}
                  variant="contained"
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                  }}
                >
                  Пригласить пользователя
                </Button>
              }
            />
            <Box sx={{ p: 0 }}>
              <UsersTable
                users={usersData?.users || []}
                loading={isLoadingUsers}
              />
            </Box>
          </Card>
        </Paper>
      </Box>

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />

      <EditCompanyModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        company={currentCompany}
      />

      <InviteUserModal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        companyId={currentCompany.company_id}
      />
    </Box>
  );
};
