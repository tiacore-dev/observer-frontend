// src/components/inviteUserModal.tsx
import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useInviteUser } from "../../hooks/invite/useInviteUser";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

interface InviteUserModalProps {
  open: boolean;
  onClose: () => void;
  companyId: string;
}

export const InviteUserModal: React.FC<InviteUserModalProps> = ({
  open,
  onClose,
  companyId,
}) => {
  const [email, setEmail] = useState("");
  const { mutate: inviteUser, isPending } = useInviteUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    inviteUser(
      { email, company_id: companyId },
      {
        onSuccess: () => {
          onClose();
          setEmail("");
        },
      }
    );
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>
          Пригласить пользователя
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={onClose} disabled={isPending}>
                Отмена
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isPending}
                startIcon={
                  isPending ? <CircularProgress size={20} /> : undefined
                }
              >
                {isPending ? "Отправка..." : "Отправить приглашение"}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};
