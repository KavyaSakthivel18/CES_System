package com.example.courseenrollment.dto;

import com.example.courseenrollment.enums.CourseStatus;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

public class CourseDTO {

    private Long id;

    @NotBlank(message = "Course code is required")
    private String courseCode;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @Min(value = 1, message = "Total seats must be at least 1")
    private int totalSeats;

    @Min(value = 0, message = "Available seats cannot be negative")
    private int availableSeats;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    @NotNull(message = "Course status is required")
    private CourseStatus status;

    public CourseDTO() {
    }

    public CourseDTO(Long id,
                     String courseCode,
                     String title,
                     String description,
                     int totalSeats,
                     int availableSeats,
                     LocalDate startDate,
                     LocalDate endDate,
                     CourseStatus status) {
        this.id = id;
        this.courseCode = courseCode;
        this.title = title;
        this.description = description;
        this.totalSeats = totalSeats;
        this.availableSeats = availableSeats;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public String getCourseCode() {
        return courseCode;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public int getTotalSeats() {
        return totalSeats;
    }

    public int getAvailableSeats() {
        return availableSeats;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public CourseStatus getStatus() {
        return status;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setTotalSeats(int totalSeats) {
        this.totalSeats = totalSeats;
    }

    public void setAvailableSeats(int availableSeats) {
        this.availableSeats = availableSeats;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public void setStatus(CourseStatus status) {
        this.status = status;
    }
}