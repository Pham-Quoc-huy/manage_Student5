import React, { useState } from "react";

import {
  TextField,
  Button,
  Typography,
  Box,
  Link,
  IconButton,
  Stack,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FacebookIcon from "@mui/icons-material/Facebook";
import { GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";

export default function LoginForm({ onClose, onShowRegister, onLoginSuccess }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token); // Lưu token vào localStorage
        if (typeof onLoginSuccess === "function") onLoginSuccess(); // Chuyển sang Home
      } else {
        alert(data.error || "Đăng nhập thất bại!");
      }
    } catch (err) {
      alert("Lỗi kết nối server!");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Nếu dùng react-oauth/google, credentialResponse.credential là idToken
      const res = await fetch("http://localhost:8080/api/auth/login/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "google",
          // Gửi idToken lên backend, backend sẽ verify và lấy info user từ Google
          idToken: credentialResponse.credential,
        }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        if (typeof onLoginSuccess === "function") onLoginSuccess();
      } else {
        alert(data.error || "Đăng nhập Google thất bại!");
      }
    } catch (err) {
      alert("Lỗi kết nối server!");
    }
  };

  const handleFacebookSuccess = async (response) => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/login/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "facebook",
          accessToken: response.accessToken,
          userID: response.userID,
          // Nếu response có email, name, avatar thì gửi kèm luôn
          email: response.email,
          name: response.name,
          avatarUrl: response.picture?.data?.url,
        }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        if (typeof onLoginSuccess === "function") onLoginSuccess();
      } else {
        alert(data.error || "Đăng nhập Facebook thất bại!");
      }
    } catch (err) {
      alert("Lỗi kết nối server!");
    }
  };

  return (
    <Box
      sx={{
        width: 350,
        bgcolor: "#fff",
        p: 4,
        borderRadius: 3,
        boxShadow: "0 4px 32px rgba(211, 84, 0, 0.12)",
        mx: "auto",
        mt: 6,
        position: "relative",
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", right: 16, top: 16, color: "#d35400" }}
      >
        <CloseIcon />
      </IconButton>
      <Typography
        variant="h4"
        align="center"
        fontWeight={700}
        mb={3}
        sx={{ color: "#d35400" }}
      >
        Đăng nhập
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          required
          variant="standard"
          InputProps={{
            disableUnderline: false,
            sx: { "&:after": { borderBottomColor: "#d35400" } },
          }}
          sx={{ mb: 3 }}
        />
        <TextField
          label="Mật khẩu"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          fullWidth
          required
          variant="standard"
          InputProps={{
            disableUnderline: false,
            sx: { "&:after": { borderBottomColor: "#d35400" } },
          }}
          sx={{ mb: 4 }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            bgcolor: "#d35400",
            color: "#fff",
            borderRadius: 99,
            fontWeight: 600,
            fontSize: 18,
            py: 1.2,
            boxShadow: "0 2px 8px rgba(211, 84, 0, 0.15)",
            mb: 2,
            "&:hover": { bgcolor: "#b34700" },
          }}
        >
          Đăng nhập
        </Button>
      </form>

      <Divider sx={{ my: 2 }}>Hoặc đăng nhập bằng</Divider>
      <Stack direction="column" spacing={2} alignItems="center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => alert("Đăng nhập Google thất bại!")}
          width="100%"
        />
        <FacebookLogin
          appId="YOUR_FACEBOOK_APP_ID"
          onSuccess={handleFacebookSuccess}
          onFail={() => alert("Đăng nhập Facebook thất bại!")}
          render={({ onClick }) => (
            <Button
              onClick={onClick}
              startIcon={
                <FacebookIcon
                  sx={{
                    color: "#1877f3",
                  }}
                />
              }
              variant="outlined"
              sx={{
                bgcolor: "#fff",
                color: "#3c4043",
                borderRadius: 2,
                borderColor: "#e0e0e0",
                fontWeight: 400,
                fontSize: 14,
                py: 1.2,
                textTransform: "none",
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "#1877f3",
                  color: "#fff",
                  borderColor: "#1877f3",
                  "& .MuiSvgIcon-root": { color: "#fff" },
                },
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              Đăng nhập bằng Facebook
            </Button>
          )}
        />
      </Stack>

      <Typography align="center" fontSize={15} sx={{ mt: 2 }}>
        Chưa có tài khoản?{" "}
        <Link
          href="#"
          sx={{ color: "#d35400", fontWeight: 600 }}
          onClick={(e) => {
            e.preventDefault();
            if (onShowRegister) onShowRegister();
          }}
        >
          Đăng ký
        </Link>
      </Typography>
    </Box>
  );
}
