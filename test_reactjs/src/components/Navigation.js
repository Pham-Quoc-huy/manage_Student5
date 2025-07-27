import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function Navigation({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "#1976d2" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          My Student App
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/home/list">
            Danh sách sinh viên
          </Button>
          <Button color="inherit" component={Link} to="/home/form">
            Thêm sinh viên
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Đăng xuất
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
