package com.example.student_api.model;
import jakarta.persistence.*;

@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(name = "studentId")
    private String studentId;

    private String email;
    private String phone;
    private String address;
    private String major;

    public Student() {}

    public Student(String name, String studentId, String email, String phone, String address, String major) {
        this.name = name;
        this.studentId = studentId;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.major = major;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getMajor() { return major; }
    public void setMajor(String major) { this.major = major; }
}