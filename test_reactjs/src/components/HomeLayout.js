import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  AppBar,
  Toolbar,
} from "@mui/material";
import {
  People as PeopleIcon,
  Add as AddIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountIcon,
} from "@mui/icons-material";
import StudentList from "./StudentList";
import StudentForm from "./StudentForm";
import StudentDetail from "./StudentDetail";

const drawerWidth = 240;

export default function HomeLayout({ onLogout }) {
  const [currentPage, setCurrentPage] = useState("list"); // "list", "form", "detail"
  const [selectedId, setSelectedId] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (onLogout) onLogout();
  };

  const renderContent = () => {
    switch (currentPage) {
      case "list":
        return (
          <StudentList
            onEdit={(student) => {
              setSelectedId(student.id);
              setCurrentPage("form");
            }}
            onDelete={(id) => {
              // Xử lý xóa sẽ được handle trong StudentList
            }}
            onShowDetail={(student) => {
              setSelectedId(student.id);
              setCurrentPage("detail");
            }}
          />
        );
      case "form":
        return (
          <StudentForm
            studentId={selectedId}
            onSubmit={(data) => {
              // Xử lý thêm/sửa
              const method = selectedId ? "PUT" : "POST";
              const url = selectedId
                ? `http://localhost:8080/api/students/${selectedId}`
                : "http://localhost:8080/api/students";

              fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
              }).then(() => {
                setCurrentPage("list");
              });
            }}
            onCancel={() => setCurrentPage("list")}
          />
        );
      case "detail":
        return (
          <StudentDetail
            studentId={selectedId}
            onBack={() => setCurrentPage("list")}
          />
        );
      default:
        return <StudentList />;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#f5f5f5",
          },
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Quản lý sinh viên
          </Typography>
        </Toolbar>

        <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <AccountIcon sx={{ color: "#666" }} />
          <Typography variant="body2" color="text.secondary">
            {localStorage.getItem("userName") || "Người dùng"}
          </Typography>
        </Box>

        <List>
          <ListItem
            button
            onClick={() => setCurrentPage("list")}
            selected={currentPage === "list"}
          >
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Danh sách sinh viên" />
          </ListItem>

          <ListItem
            button
            onClick={() => {
              setSelectedId(null);
              setCurrentPage("form");
            }}
            selected={currentPage === "form"}
          >
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Thêm sinh viên" />
          </ListItem>
        </List>

        <Box sx={{ flexGrow: 1 }} />

        <List>
          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Đăng xuất" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {renderContent()}
      </Box>
    </Box>
  );
}
