import React, { useEffect, useState } from "react";
import {
  Button,
  Stack,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";

export default function StudentList({ onEdit, onDelete, onShowDetail }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStudents = () => {
    setLoading(true);
    fetch("http://localhost:8080/api/students")
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = (id) => {
    fetch(`http://localhost:8080/api/students/${id}`, {
      method: "DELETE",
    }).then(() => {
      fetchStudents();
      if (onDelete) onDelete();
    });
  };

  if (loading)
    return <CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />;

  return (
    <div>
      <Typography variant="h5" align="center" fontWeight={700} mb={3}>
        Danh Sách Sinh Viên
      </Typography>
      {students.length === 0 ? (
        <Typography align="center">Không có sinh viên nào.</Typography>
      ) : (
        <Stack spacing={3}>
          {students.map((student) => (
            <Paper
              key={student.id}
              elevation={4}
              sx={{
                p: 2.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderRadius: 2,
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                background: "#e3f2fd",
              }}
            >
              <div>
                <Typography fontWeight={600} fontSize={18}>
                  {student.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  MSSV: {student.studentId}
                </Typography>
              </div>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => onShowDetail(student)}
                  sx={{ borderRadius: 3, minWidth: 80 }}
                >
                  Chi tiết
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => onEdit(student)}
                  sx={{ borderRadius: 3, minWidth: 70 }}
                >
                  Sửa
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDelete(student.id)}
                  sx={{ borderRadius: 3, minWidth: 70 }}
                >
                  Xóa
                </Button>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </div>
  );
}
