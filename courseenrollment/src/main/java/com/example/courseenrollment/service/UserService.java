package com.example.courseenrollment.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.example.courseenrollment.dto.UserDTO;
import com.example.courseenrollment.entity.User;
import com.example.courseenrollment.enums.Role;
import com.example.courseenrollment.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    // Create user
    public UserDTO createUser(User user) {

        if (user.getRole() == null) {
            user.setRole(Role.STUDENT);
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User savedUser = userRepository.save(user);

        return convertToDTO(savedUser);
    }

    // Get all users
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get by ID
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id " + id));

        return convertToDTO(user);
    }

    // Update
    public UserDTO updateUser(Long id, User updatedUser) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id " + id));

        existing.setName(updatedUser.getName());

        if (updatedUser.getRole() != null) {
            existing.setRole(updatedUser.getRole());
        }

        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            existing.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }

        return convertToDTO(userRepository.save(existing));
    }

    // Delete
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id " + id));

        userRepository.delete(user);
    }

    // Convert Entity → DTO (No Password)
    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setRole(user.getRole());
        return dto;
    }
}