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
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
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
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface CompanyCardProps {
  company: ICompany;
  developerMode: boolean;
  isMobile?: boolean;
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
  isMobile = false,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { data: companyDetails, isLoading } = useCompanyDetailsQuery(
    company.company_id
  );
  const { mutate: deleteCompany, isPending: isDeleting } = useDeleteCompany();
  const { data: usersData, isLoading: isLoadingUsers } = useCompanyUsers(
    company.company_id
  );

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
          background:
            theme.palette.mode === "dark"
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
              )}
              <Box>
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  gutterBottom
                  sx={{ fontWeight: "bold", color: "white" }}
                >
                  {currentCompany.company_name}
                </Typography>
                <Typography
                  variant={isMobile ? "body1" : "h6"}
                  sx={{ opacity: 0.9, mb: 1, color: "white" }}
                >
                  {currentCompany.description}
                </Typography>
              </Box>
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
            setEditModalOpen(true);
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
            setDeleteDialogOpen(true);
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
        {/* Метаданные */}
        {developerMode && (
          <Card>
            <CardContent sx={{ p: isMobile ? 1 : 2 }}>
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
        <Card>
          <CardHeader
            avatar={<PeopleIcon sx={{ color: "primary.main" }} />}
            title="Пользователи компании"
            action={
              isMobile ? (
                <IconButton
                  onClick={() => setInviteModalOpen(true)}
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                  }}
                >
                  <AddIcon />
                </IconButton>
              ) : (
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
              )
            }
          />

          <Box sx={{ p: 0 }}>
            <UsersTable
              users={usersData?.users || []}
              loading={isLoadingUsers}
              isMobile={isMobile}
            />
          </Box>
        </Card>
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
