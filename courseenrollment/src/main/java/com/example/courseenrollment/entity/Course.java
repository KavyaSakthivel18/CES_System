package com.example.courseenrollment.entity;
import com.example.courseenrollment.enums.CourseStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Course {
     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String courseCode;

    private String title;
    private String description;

    private int totalSeats;
    private int availableSeats;

    private LocalDate startDate;
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    private CourseStatus status;
}
