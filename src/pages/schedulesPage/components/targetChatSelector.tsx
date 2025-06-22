import type React from "react";
import {
  FormControl,
  Typography,
  Box,
  List,
  ListItem,
  FormControlLabel,
  Checkbox,
  ListItemText,
  Tooltip,
} from "@mui/material";

interface TargetChatSelectorProps {
  chatMap: Map<number, string>;
  selectedChats: number[];
  onChatToggle: (chatId: number) => () => void;
  disabled?: boolean;
  error?: string;
  tooltipMessage?: string;
}

export const TargetChatSelector: React.FC<TargetChatSelectorProps> = ({
  chatMap,
  selectedChats,
  onChatToggle,
  disabled = false,
  error,
  tooltipMessage,
}) => {
  const content = (
    <FormControl fullWidth required error={!!error}>
      <Typography variant="subtitle1" gutterBottom>
        Выберите целевые чаты:
      </Typography>
      <Box
        sx={{
          maxHeight: 200,
          overflow: "auto",
          border: "1px solid rgba(0, 0, 0, 0.23)",
          borderRadius: 1,
          p: 1,
        }}
      >
        <List dense>
          {Array.from(chatMap.entries()).map(([id, name]) => (
            <ListItem key={id}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedChats.includes(id)}
                    onChange={onChatToggle(id)}
                    disabled={disabled}
                  />
                }
                label={<ListItemText primary={name} secondary={`ID: ${id}`} />}
              />
            </ListItem>
          ))}
        </List>
      </Box>
      {error && (
        <Typography variant="caption" color="error">
          {error}
        </Typography>
      )}
    </FormControl>
  );

  return disabled && tooltipMessage ? (
    <Tooltip title={tooltipMessage}>{content}</Tooltip>
  ) : (
    content
  );
};
