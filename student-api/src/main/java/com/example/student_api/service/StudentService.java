package com.example.student_api.service;

import com.example.student_api.model.Student;
import com.example.student_api.repository.StudentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

public Student saveStudent(Student student) {
    // Kiểm tra email hợp lệ
    if (!isValidEmail(student.getEmail())) {
        throw new RuntimeException("Email không hợp lệ!");
    }
    // Kiểm tra số điện thoại hợp lệ
    if (!isValidPhone(student.getPhone())) {
        throw new RuntimeException("Số điện thoại không hợp lệ!");
    }

    // Kiểm tra mã số sinh viên trùng
    if (student.getId() == null) { 
        if (studentRepository.findByStudentId(student.getStudentId()).isPresent()) {
            throw new RuntimeException("Mã số sinh viên đã tồn tại!");
        }
    } else { 
        Optional<Student> existing = studentRepository.findByStudentId(student.getStudentId());
        if (existing.isPresent() && !existing.get().getId().equals(student.getId())) {
            throw new RuntimeException("Mã số sinh viên đã tồn tại!");
        }
    }
    return studentRepository.save(student);
}

private boolean isValidEmail(String email) {
    return email != null && email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
}

private boolean isValidPhone(String phone) {
    return phone != null && phone.matches("^\\d{9,11}$");
}
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }
}