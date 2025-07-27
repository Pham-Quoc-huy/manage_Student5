import React, { useState, useEffect } from "react";
import { TextField, Button, Stack, Typography } from "@mui/material";

const initialForm = {
  name: "",
  studentId: "",
  email: "",
  phone: "",
  address: "",
  major: "",
};

export default function StudentForm({
  onSubmit,
  initialData,
  onCancel,
  studentId,
}) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (studentId) {
      setLoading(true);
      fetch(`http://localhost:8080/api/students/${studentId}`)
        .then((res) => res.json())
        .then((data) => {
          setForm(data);
          setLoading(false);
        });
    } else if (initialData) {
      setForm(initialData);
    } else {
      setForm(initialForm);
    }
  }, [studentId, initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email.includes("@")) {
      alert("Email không hợp lệ!");
      return;
    }
    if (!/^\d+$/.test(form.phone)) {
      alert("Số điện thoại chỉ được chứa số!");
      return;
    }
    onSubmit(form);
    if (!studentId) setForm(initialForm);
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  const isEditing = !!studentId;

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5" align="center" fontWeight={700} mb={3}>
        {isEditing ? "Cập nhật sinh viên" : "Thêm sinh viên mới"}
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="Họ và tên"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Mã số sinh viên"
          name="studentId"
          value={form.studentId}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Số điện thoại"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Địa chỉ"
          name="address"
          value={form.address}
          onChange={handleChange}
          required
          fullWidth
          multiline
          minRows={2}
        />
        <TextField
          label="Chuyên ngành"
          name="major"
          value={form.major}
          onChange={handleChange}
          required
          fullWidth
        />
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button type="submit" variant="contained" color="primary">
            {isEditing ? "Cập nhật" : "Thêm mới"}
          </Button>
          {isEditing && (
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              onClick={onCancel}
            >
              Hủy
            </Button>
          )}
        </Stack>
      </Stack>
    </form>
  );
}
