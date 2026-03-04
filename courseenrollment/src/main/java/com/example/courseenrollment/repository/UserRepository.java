package com.example.courseenrollment.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.courseenrollment.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {}
