package com.example.courseenrollment.entity;

import com.example.courseenrollment.enums.EnrollmentStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "enrollments",
       uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "course_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many enrollments belong to one student
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    // Many enrollments belong to one course
    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    private LocalDateTime enrolledAt;

    @Enumerated(EnumType.STRING)
    private EnrollmentStatus status;
}
