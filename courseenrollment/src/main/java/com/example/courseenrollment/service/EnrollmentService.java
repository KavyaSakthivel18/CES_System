package com.example.courseenrollment.service;

import com.example.courseenrollment.entity.*;
import com.example.courseenrollment.enums.*;
import com.example.courseenrollment.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepo;
    private final CourseRepository courseRepo;
    private final UserRepository userRepo;

    // ENROLL STUDENT
    public Enrollment enroll(Long studentId, Long courseId) {

        User student = userRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Course course = courseRepo.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // RULE 1: Course must be OPEN
        if (course.getStatus() != CourseStatus.OPEN)
            throw new RuntimeException("Enrollment not allowed. Course not OPEN.");

        // RULE 2: Seats available
        if (course.getAvailableSeats() <= 0)
            throw new RuntimeException("No seats available");

        // RULE 3: Prevent duplicate enrollment
        if (enrollmentRepo.existsByStudentIdAndCourseId(studentId, courseId))
            throw new RuntimeException("Student already enrolled in this course");

        // Decrease available seat
        course.setAvailableSeats(course.getAvailableSeats() - 1);
        courseRepo.save(course);

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setEnrolledAt(LocalDateTime.now());
        enrollment.setStatus(EnrollmentStatus.ENROLLED);

        return enrollmentRepo.save(enrollment);
    }

    // CANCEL ENROLLMENT
    public Enrollment cancelEnrollment(Long enrollmentId) {

        Enrollment enrollment = enrollmentRepo.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        Course course = enrollment.getCourse();

        // RULE: Cannot cancel if COMPLETED
        if (course.getStatus() == CourseStatus.COMPLETED)
            throw new RuntimeException("Cannot cancel after course completed");

        enrollment.setStatus(EnrollmentStatus.CANCELLED);

        // Increase seat
        course.setAvailableSeats(course.getAvailableSeats() + 1);
        courseRepo.save(course);

        return enrollmentRepo.save(enrollment);
    }

    // GET ALL ENROLLMENTS
    public List<Enrollment> getAll() {
        return enrollmentRepo.findAll();
    }

    // GET ENROLLMENTS BY STUDENT
    public List<Enrollment> getByStudent(Long studentId) {
        return enrollmentRepo.findByStudentId(studentId);
    }

    // GET STUDENTS IN COURSE (JOIN Query)
    public List<Enrollment> getStudentsInCourse(Long courseId) {
        return enrollmentRepo.fetchStudentsByCourse(courseId);
    }

    // AGGREGATE: Count students per course
    public long countStudents(Long courseId) {
        return enrollmentRepo.countActiveStudents(courseId);
    }
}