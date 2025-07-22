"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  TextField,
  InputAdornment,
  Fade,
  Typography,
  Box,
} from "@mui/material";
import { CheckCircle, Error, Info } from "@mui/icons-material";

interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
  type: "error" | "warning" | "info";
}

interface ValidatedTextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  validationRules?: ValidationRule[];
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  helperText?: string;
  required?: boolean;
  type?: string;
}

export const ValidatedTextField: React.FC<ValidatedTextFieldProps> = ({
  label,
  value,
  onChange,
  validationRules = [],
  placeholder,
  multiline = false,
  rows,
  helperText,
  required = false,
  type = "text",
}) => {
  const [focused, setFocused] = useState(false);
  const [validationResults, setValidationResults] = useState<ValidationRule[]>(
    []
  );

  useEffect(() => {
    if (value && validationRules.length > 0) {
      const results = validationRules.filter((rule) => !rule.test(value));
      setValidationResults(results);
    } else {
      setValidationResults([]);
    }
  }, [value, validationRules]);

  const hasErrors = validationResults.some((result) => result.type === "error");
  const hasWarnings = validationResults.some(
    (result) => result.type === "warning"
  );
  const isValid =
    value && validationResults.length === 0 && validationRules.length > 0;

  const getColor = () => {
    if (hasErrors) return "error";
    if (hasWarnings) return "warning";
    if (isValid) return "success";
    return "primary";
  };

  const getIcon = () => {
    if (hasErrors) return <Error color="error" />;
    if (hasWarnings) return <Info color="warning" />;
    if (isValid) return <CheckCircle color="success" />;
    return null;
  };

  return (
    <Box>
      <TextField
        fullWidth
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        multiline={multiline}
        rows={rows}
        helperText={helperText}
        required={required}
        type={type}
        color={getColor() as any}
        error={hasErrors}
        InputProps={{
          endAdornment: value && (
            <InputAdornment position="end">{getIcon()}</InputAdornment>
          ),
        }}
      />

      <Fade in={focused && validationResults.length > 0}>
        <Box sx={{ mt: 1 }}>
          {validationResults.map((result, index) => (
            <Typography
              key={index}
              variant="caption"
              sx={{
                display: "block",
                color:
                  result.type === "error"
                    ? "error.main"
                    : result.type === "warning"
                    ? "warning.main"
                    : "info.main",
                mt: 0.5,
              }}
            >
              • {result.message}
            </Typography>
          ))}
        </Box>
      </Fade>
    </Box>
  );
};
