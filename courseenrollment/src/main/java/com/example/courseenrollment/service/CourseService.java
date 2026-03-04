package com.example.courseenrollment.service;

import com.example.courseenrollment.entity.Course;
import com.example.courseenrollment.enums.CourseStatus;
import com.example.courseenrollment.repository.CourseRepository;
import com.example.courseenrollment.repository.EnrollmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

// import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepo;
    private final EnrollmentRepository enrollmentRepo;

    // CREATE COURSE
    public Course createCourse(Course course) {

        if (course.getEndDate().isBefore(course.getStartDate()))
            throw new RuntimeException("End date must be after start date");

        course.setAvailableSeats(course.getTotalSeats());
        course.setStatus(CourseStatus.PLANNED);

        return courseRepo.save(course);
    }

    // UPDATE COURSE
    public Course updateCourse(Long id, Course updatedCourse) {

        Course existing = courseRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (existing.getStatus() == CourseStatus.OPEN)
            throw new RuntimeException("Cannot modify course once OPEN");

        if (updatedCourse.getEndDate().isBefore(updatedCourse.getStartDate()))
            throw new RuntimeException("End date must be after start date");

        existing.setTitle(updatedCourse.getTitle());
        existing.setDescription(updatedCourse.getDescription());
        existing.setTotalSeats(updatedCourse.getTotalSeats());
        existing.setStartDate(updatedCourse.getStartDate());
        existing.setEndDate(updatedCourse.getEndDate());

        existing.setAvailableSeats(updatedCourse.getTotalSeats());

        return courseRepo.save(existing);
    }

    // OPEN COURSE
    public Course openCourse(Long id) {
        Course course = courseRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        course.setStatus(CourseStatus.OPEN);
        return courseRepo.save(course);
    }

    // CLOSE COURSE
    public Course closeCourse(Long id) {
        Course course = courseRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        course.setStatus(CourseStatus.CLOSED);
        return courseRepo.save(course);
    }

    // COMPLETE COURSE
    public Course completeCourse(Long id) {
        Course course = courseRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        course.setStatus(CourseStatus.COMPLETED);
        return courseRepo.save(course);
    }

    // GET ALL COURSES
    public List<Course> getAllCourses() {
        return courseRepo.findAll();
    }

    // GET BY STATUS
    public List<Course> getByStatus(CourseStatus status) {
        return courseRepo.findByStatus(status);
    }

    // DELETE COURSE
    public void deleteCourse(Long id) {

        if (enrollmentRepo.countByCourseId(id) > 0)
            throw new RuntimeException("Cannot delete course with enrolled students");

        courseRepo.deleteById(id);
    }
}