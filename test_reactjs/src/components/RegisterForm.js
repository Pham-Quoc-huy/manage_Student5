import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Link,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function RegisterForm({ onClose, onBackToLogin }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Đăng ký thành công!");
        if (onBackToLogin) onBackToLogin(); // Chuyển về trang đăng nhập
      } else {
        alert(data.error || "Đăng ký thất bại!");
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
        Đăng ký
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Họ và tên"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          required
          variant="standard"
          InputProps={{
            disableUnderline: false,
            sx: { "&:after": { borderBottomColor: "#d35400" } },
          }}
          sx={{ mb: 2 }}
        />
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
          sx={{ mb: 2 }}
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
          sx={{ mb: 2 }}
        />
        <TextField
          label="Số điện thoại"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          fullWidth
          required
          variant="standard"
          InputProps={{
            disableUnderline: false,
            sx: { "&:after": { borderBottomColor: "#d35400" } },
          }}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Địa chỉ"
          name="address"
          value={form.address}
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
          Đăng ký
        </Button>
      </form>
      <Typography align="center" fontSize={15}>
        Đã có tài khoản?{" "}
        <Link
          href="#"
          sx={{ color: "#d35400", fontWeight: 600 }}
          onClick={(e) => {
            e.preventDefault();
            if (onBackToLogin) onBackToLogin();
          }}
        >
          Đăng nhập
        </Link>
      </Typography>
    </Box>
  );
}
