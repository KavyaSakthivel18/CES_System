package com.example.courseenrollment.controller;

import com.example.courseenrollment.entity.Course;
import com.example.courseenrollment.enums.CourseStatus;
import com.example.courseenrollment.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CourseController {

    private final CourseService courseService;

    // CREATE
    @PostMapping
    public Course create(@RequestBody Course course) {
        return courseService.createCourse(course);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Course update(@PathVariable Long id,
                         @RequestBody Course course) {
        return courseService.updateCourse(id, course);
    }

    // OPEN
    @PutMapping("/{id}/open")
    public Course open(@PathVariable Long id) {
        return courseService.openCourse(id);
    }

    // CLOSE
    @PutMapping("/{id}/close")
    public Course close(@PathVariable Long id) {
        return courseService.closeCourse(id);
    }

    // COMPLETE
    @PutMapping("/{id}/complete")
    public Course complete(@PathVariable Long id) {
        return courseService.completeCourse(id);
    }

    // GET ALL
    @GetMapping
    public List<Course> getAll(
            @RequestParam(required = false) CourseStatus status) {

        if (status != null)
            return courseService.getByStatus(status);

        return courseService.getAllCourses();
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return "Course deleted successfully";
    }
}
