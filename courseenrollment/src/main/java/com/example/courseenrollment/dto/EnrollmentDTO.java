package main.java.com.example.courseenrollment.dto;

import com.example.courseenrollment.enums.EnrollmentStatus;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class EnrollmentDTO {

    private Long id;

    @NotNull(message = "Student ID is required")
    private Long studentId;

    private String studentName;

    @NotNull(message = "Course ID is required")
    private Long courseId;

    private String courseTitle;

    private LocalDateTime enrolledAt;

    private EnrollmentStatus status;

    public EnrollmentDTO() {
    }

    public EnrollmentDTO(Long id,
                         Long studentId,
                         String studentName,
                         Long courseId,
                         String courseTitle,
                         LocalDateTime enrolledAt,
                         EnrollmentStatus status) {
        this.id = id;
        this.studentId = studentId;
        this.studentName = studentName;
        this.courseId = courseId;
        this.courseTitle = courseTitle;
        this.enrolledAt = enrolledAt;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public Long getCourseId() {
        return courseId;
    }

    public String getCourseTitle() {
        return courseTitle;
    }

    public LocalDateTime getEnrolledAt() {
        return enrolledAt;
    }

    public EnrollmentStatus getStatus() {
        return status;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
    }

    public void setEnrolledAt(LocalDateTime enrolledAt) {
        this.enrolledAt = enrolledAt;
    }

    public void setStatus(EnrollmentStatus status) {
        this.status = status;
    }
}