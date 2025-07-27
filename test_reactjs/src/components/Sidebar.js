import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function Sidebar({
  onSelect,
  selected,
  username = "Tên Admin",
}) {
  return (
    <div
      style={{
        width: 220,
        background: "#ff9800", // Cam tươi
        color: "#fff",
        minHeight: "100vh",
        padding: "32px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Avatar và tên người dùng */}
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <AccountCircleIcon sx={{ fontSize: 64, color: "#fff" }} />
        <div style={{ fontWeight: 700, fontSize: 18, marginTop: 8 }}>
          {username}
        </div>
        {/* <div style={{ fontSize: 14, color: "#ffe0b2" }}>Quản trị viên</div> */}
      </div>
      <div
        style={{
          margin: "12px 0",
          cursor: "pointer",
          fontWeight: selected === "list" ? 700 : 400,
          color: selected === "list" ? "#ffd6a0" : "#fff",
          fontSize: 16,
          borderRadius: 8,
          padding: "8px 0",
          width: "90%",
          background: selected === "list" ? "rgba(255,255,255,0.08)" : "none",
          transition: "all 0.2s",
        }}
        onClick={() => onSelect("list")}
      >
        Danh sách sinh viên
      </div>
      <div
        style={{
          margin: "12px 0",
          cursor: "pointer",
          fontWeight: selected === "form" ? 700 : 400,
          color: selected === "form" ? "#ffd6a0" : "#fff",
          fontSize: 16,
          borderRadius: 8,
          padding: "8px 0",
          width: "90%",
          background: selected === "form" ? "rgba(255,255,255,0.08)" : "none",
          transition: "all 0.2s",
        }}
        onClick={() => onSelect("form")}
      >
        Thêm sinh viên
      </div>
      <div
        style={{
          margin: "12px 0",
          cursor: "pointer",
          color: selected === "logout" ? "#ffd6a0" : "#fff",
          fontWeight: selected === "logout" ? 700 : 400,
          fontSize: 16,
          borderRadius: 8,
          padding: "8px 0",
          width: "90%",
          background: selected === "logout" ? "rgba(255,255,255,0.08)" : "none",
          transition: "all 0.2s",
        }}
        onClick={() => onSelect("logout")}
      >
        Đăng xuất
      </div>
    </div>
  );
}
