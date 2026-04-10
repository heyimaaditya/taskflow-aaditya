import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { ApiClientError } from "../api/client";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Dashboard,
} from "@mui/icons-material";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = "Name is required";
    if (!email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "Invalid email address";
    if (!password) errors.password = "Password is required";
    else if (password.length < 6)
      errors.password = "Must be at least 6 characters";
    if (password !== confirmPassword)
      errors.confirmPassword = "Passwords do not match";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await register(name, email, password);
      navigate("/projects", { replace: true });
    } catch (err) {
      if (err instanceof ApiClientError) {
        if (err.fields) setFieldErrors(err.fields);
        else setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: { xs: "block", sm: "flex" },
        alignItems: { xs: "unset", sm: "center" },
        justifyContent: { xs: "unset", sm: "center" },
        px: { xs: 0, sm: 2 },
        py: { xs: 0, sm: 2 },
        background: (theme) =>
          theme.palette.mode === "light"
            ? "linear-gradient(135deg, #F8F9FC 0%, #EEF0FF 50%, #FCE7F3 100%)"
            : "linear-gradient(135deg, #0F0E1A 0%, #1A1929 50%, #1E1225 100%)",
      }}
    >
      <Card
        sx={{
          width: { xs: "100%", sm: "100%" },
          maxWidth: { xs: "100%", sm: 440 },
          overflow: "hidden",
          borderRadius: { xs: "24px 24px 0 0", sm: "16px" },
          boxShadow: {
            xs: "0 -10px 40px rgba(0,0,0,0.3)",
            sm: "0 10px 30px rgba(0,0,0,0.08)",
          },
          position: { xs: "fixed", sm: "static" },
          bottom: { xs: 0, sm: "auto" },
          left: { xs: 0, sm: "auto" },
          right: { xs: 0, sm: "auto" },
          zIndex: { xs: 1000, sm: "auto" },
        }}
      >
        <CardContent
          sx={{
            p: { xs: 3, sm: 4 },
            maxHeight: { xs: "calc(100vh - 60px)", sm: "auto" },
            overflowY: { xs: "auto", sm: "visible" },
          }}
        >
          {}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              mb: 4,
            }}
          >
            <Dashboard sx={{ fontSize: 36, color: "primary.main" }} />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #6366F1, #EC4899)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              TaskFlow
            </Typography>
          </Box>

          <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            Create your account
          </Typography>
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Start managing your projects today
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              id="register-name"
              fullWidth
              label="Full Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setFieldErrors((prev) => ({ ...prev, name: "" }));
              }}
              error={!!fieldErrors.name}
              helperText={fieldErrors.name}
              sx={{ mb: 2.5 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              id="register-email"
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFieldErrors((prev) => ({ ...prev, email: "" }));
              }}
              error={!!fieldErrors.email}
              helperText={fieldErrors.email}
              sx={{ mb: 2.5 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              id="register-password"
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFieldErrors((prev) => ({ ...prev, password: "" }));
              }}
              error={!!fieldErrors.password}
              helperText={fieldErrors.password}
              sx={{ mb: 2.5 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              id="register-confirm-password"
              fullWidth
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setFieldErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }}
              error={!!fieldErrors.confirmPassword}
              helperText={fieldErrors.confirmPassword}
              sx={{ mb: 3 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              id="register-submit"
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={{ py: 1.5, mb: 3, fontSize: "1rem" }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Create Account"
              )}
            </Button>

            <Typography variant="body2" align="center" color="text.secondary">
              Already have an account?{" "}
              <Link
                component={RouterLink}
                to="/login"
                underline="hover"
                sx={{ fontWeight: 600 }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterPage;
