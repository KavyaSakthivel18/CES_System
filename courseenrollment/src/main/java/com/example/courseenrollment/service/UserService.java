package com.example.courseenrollment.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.example.courseenrollment.entity.User;
import com.example.courseenrollment.enums.Role;
import com.example.courseenrollment.repository.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // Create a new user
    public User createUser(User user) {
        // Default role as STUDENT if not provided
        if (user.getRole() == null) {
            user.setRole(Role.STUDENT);
        }
        return userRepository.save(user);
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get a user by ID
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id " + id));
    }

    // Update user details
    public User updateUser(Long id, User updatedUser) {
        User existing = getUserById(id);
        existing.setName(updatedUser.getName());
        existing.setRole(updatedUser.getRole());
        return userRepository.save(existing);
    }

    // Delete a user
    public void deleteUser(Long id) {
        User existing = getUserById(id);
        userRepository.delete(existing);
    }
}