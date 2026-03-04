package com.example.courseenrollment.repository;

import com.example.courseenrollment.entity.Enrollment;
import org.springframework.data.jpa.repository.*;
import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);

    long countByCourseId(Long courseId);

    List<Enrollment> findByCourseId(Long courseId);

    List<Enrollment> findByStudentId(Long studentId);

    // JOIN query → Fetch course with enrolled students
    @Query("SELECT e FROM Enrollment e JOIN FETCH e.student WHERE e.course.id = :courseId")
    List<Enrollment> fetchStudentsByCourse(Long courseId);

    // Aggregate query → Count students per course
    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.course.id = :courseId AND e.status = 'ENROLLED'")
    long countActiveStudents(Long courseId);
}