package com.example.courseenrollment.repository;

import com.example.courseenrollment.entity.Course;
import com.example.courseenrollment.enums.CourseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByStatus(CourseStatus status);
}