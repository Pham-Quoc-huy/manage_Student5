import React, { useEffect, useState } from "react";
import {
  Typography,
  Stack,
  Paper,
  CircularProgress,
  Button,
} from "@mui/material";

export default function StudentDetail({ studentId, onBack }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!studentId) return;
    setLoading(true);
    fetch(`http://localhost:8080/api/students/${studentId}`)
      .then((res) => res.json())
      .then((data) => {
        setStudent(data);
        setLoading(false);
      });
  }, [studentId]);

  if (!studentId) return null;
  if (loading)
    return <CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />;
  if (!student)
    return <Typography align="center">Không tìm thấy sinh viên.</Typography>;

  return (
    <Paper
      elevation={6}
      sx={{
        p: 4,
        borderRadius: 3,
        maxWidth: 420,
        mx: "auto",
        boxShadow: "0 4px 32px rgba(0,0,0,0.12)",
      }}
    >
      <Stack spacing={2}>
        <Typography variant="h5" align="center" fontWeight={700} mb={2}>
          Thông Tin Chi Tiết Sinh Viên
        </Typography>
        <Stack spacing={1}>
          <Typography>
            <b>Họ và tên:</b> {student.name}
          </Typography>
          <Typography>
            <b>Mã số sinh viên:</b> {student.studentId}
          </Typography>
          <Typography>
            <b>Email:</b> {student.email}
          </Typography>
          <Typography>
            <b>Số điện thoại:</b> {student.phone}
          </Typography>
          <Typography>
            <b>Địa chỉ:</b> {student.address}
          </Typography>
          <Typography>
            <b>Chuyên ngành:</b> {student.major}
          </Typography>
        </Stack>
        {onBack && (
          <Button
            variant="outlined"
            onClick={onBack}
            sx={{ mt: 2, alignSelf: "center" }}
          >
            Quay lại danh sách
          </Button>
        )}
      </Stack>
    </Paper>
  );
}
