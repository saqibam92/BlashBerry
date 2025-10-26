// File: apps/client/src/app/(shop)/my-account/page.jsx
"use client";
import { useSearchParams } from "next/navigation";
import { Container, Grid, Paper, Typography, Box } from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

export default function MyAccountPage() {
  const { isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "login";

  if (isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            My Account
          </Typography>
          <Typography>
            Your account is active. Redirecting to profile...
          </Typography>
          {/* Add profile content here, e.g., orders, settings */}
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          My Account
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <Box
            sx={{
              p: 2,
              borderBottom: tab === "login" ? 2 : 0,
              borderColor: "primary.main",
              cursor: "pointer",
              mr: 4,
            }}
            onClick={() =>
              window.history.pushState({}, "", "/my-account?tab=login")
            }
          >
            <Typography variant="h6">Login</Typography>
          </Box>
          <Box
            sx={{
              p: 2,
              borderBottom: tab === "register" ? 2 : 0,
              borderColor: "primary.main",
              cursor: "pointer",
            }}
            onClick={() =>
              window.history.pushState({}, "", "/my-account?tab=register")
            }
          >
            <Typography variant="h6">Register</Typography>
          </Box>
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <LoginForm />
          </Grid>
          <Grid item xs={12} md={6}>
            <RegisterForm />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
