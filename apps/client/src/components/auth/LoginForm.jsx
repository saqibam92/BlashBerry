// File: apps/client/src/components/auth/LoginForm.jsx
import { useState } from "react";
import { TextField, Button, Box, CircularProgress } from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

export default function LoginForm() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    guestEmail: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(
      formData.email,
      formData.password,
      false,
      formData.guestEmail || undefined
    );
    if (result.success) {
      toast.success("Logged in successfully!");
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        name="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        name="password"
        label="Password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        name="guestEmail"
        label="Guest Email (to merge orders, optional)"
        type="email"
        value={formData.guestEmail}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button type="submit" variant="contained" fullWidth disabled={loading}>
        {loading ? <CircularProgress size={24} /> : "Login"}
      </Button>
    </Box>
  );
}
