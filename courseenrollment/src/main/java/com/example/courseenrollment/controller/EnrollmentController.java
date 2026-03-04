package com.example.courseenrollment.controller;

import com.example.courseenrollment.entity.Enrollment;
import com.example.courseenrollment.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    // ENROLL
    @PostMapping
    public Enrollment enroll(@RequestParam Long studentId,
                             @RequestParam Long courseId) {
        return enrollmentService.enroll(studentId, courseId);
    }

    // CANCEL
    @PutMapping("/{id}/cancel")
    public Enrollment cancel(@PathVariable Long id) {
        return enrollmentService.cancelEnrollment(id);
    }

    // GET ALL
    @GetMapping
    public List<Enrollment> getAll() {
        return enrollmentService.getAll();
    }

    // GET BY STUDENT
    @GetMapping("/student/{studentId}")
    public List<Enrollment> getByStudent(@PathVariable Long studentId) {
        return enrollmentService.getByStudent(studentId);
    }

    // GET STUDENTS IN COURSE (JOIN)
    @GetMapping("/course/{courseId}/students")
    public List<Enrollment> getStudentsInCourse(@PathVariable Long courseId) {
        return enrollmentService.getStudentsInCourse(courseId);
    }

    // COUNT STUDENTS (AGGREGATE)
    @GetMapping("/course/{courseId}/count")
    public long countStudents(@PathVariable Long courseId) {
        return enrollmentService.countStudents(courseId);
    }
}
