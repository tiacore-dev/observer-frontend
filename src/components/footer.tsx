// src/components/Footer.tsx
import { Box, Typography, Link, Container, Divider } from "@mui/material";

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        backgroundColor: "background.paper",
        borderTop: "2px solid",
        borderColor: "primary.main",
        boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
        width: "100%",
        height: "80px",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* Copyright Section */}
          <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
            <Typography
              variant="body1"
              color="text.primary"
              sx={{
                fontWeight: 600,
                fontSize: "1.1rem",
              }}
            >
              © 2025 Observer
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5, fontSize: "12px" }}
            >
              Все права защищены
            </Typography>
          </Box>

          {/* Links Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 1, sm: 3 },
              alignItems: "center",
            }}
          >
            <Link
              href="/privacy"
              variant="body2"
              color="text.secondary"
              sx={{
                textDecoration: "none",
                "&:hover": {
                  color: "primary.main",
                  textDecoration: "underline",
                },
                fontWeight: 500,
              }}
            >
              Политика конфиденциальности
            </Link>

            <Divider
              orientation="vertical"
              flexItem
              sx={{
                display: { xs: "none", sm: "block" },
                height: "20px",
                alignSelf: "center",
              }}
            />

            <Link
              href="/terms"
              variant="body2"
              color="text.secondary"
              sx={{
                textDecoration: "none",
                "&:hover": {
                  color: "primary.main",
                  textDecoration: "underline",
                },
                fontWeight: 500,
              }}
            >
              Пользовательское соглашение
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
