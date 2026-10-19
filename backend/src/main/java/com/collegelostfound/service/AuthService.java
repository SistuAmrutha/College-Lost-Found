package com.collegelostfound.service;

import com.collegelostfound.dto.*;
import com.collegelostfound.exception.BadRequestException;
import com.collegelostfound.exception.ResourceNotFoundException;
import com.collegelostfound.exception.UnauthorizedException;
import com.collegelostfound.model.AccountStatus;
import com.collegelostfound.model.Role;
import com.collegelostfound.model.User;
import com.collegelostfound.repository.UserRepository;
import com.collegelostfound.security.JwtUtils;
import com.collegelostfound.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final AuditLogService auditLogService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtUtils jwtUtils,
                       AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.auditLogService = auditLogService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Password and confirm password do not match");
        }

        String normalizedEmail = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new BadRequestException("An account with email " + normalizedEmail + " already exists");
        }

        String normalizedCollegeId = request.getCollegeId().trim().toUpperCase();
        if (userRepository.existsByCollegeId(normalizedCollegeId)) {
            throw new BadRequestException("An account with College ID " + normalizedCollegeId + " already exists");
        }

        User user = new User(
                request.getFullName().trim(),
                normalizedEmail,
                normalizedCollegeId,
                request.getDepartment().trim(),
                request.getAcademicYear().trim(),
                request.getPhone() != null ? request.getPhone().trim() : null,
                passwordEncoder.encode(request.getPassword()),
                Role.ROLE_STUDENT
        );

        User savedUser = userRepository.save(user);

        auditLogService.log(savedUser.getId(), savedUser.getEmail(), "USER_REGISTERED", "USER", savedUser.getId(), "Student registered");

        String token = jwtUtils.generateToken(savedUser.getEmail(), savedUser.getId(), savedUser.getRole().name());

        return new AuthResponse(token, savedUser.getId(), savedUser.getFullName(), savedUser.getEmail(), savedUser.getRole());
    }

    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(normalizedEmail, request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getAccountStatus() == AccountStatus.SUSPENDED) {
            throw new UnauthorizedException("Your account has been suspended. Please contact the administrator.");
        }

        String token = jwtUtils.generateToken(user.getEmail(), user.getId(), user.getRole().name());

        return new AuthResponse(token, user.getId(), user.getFullName(), user.getEmail(), user.getRole());
    }

    public UserResponse getCurrentUser(UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            throw new UnauthorizedException("Not authenticated");
        }

        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return UserResponse.fromUser(user, true);
    }

    public UserResponse updateProfile(UserPrincipal userPrincipal, UpdateProfileRequest request) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setFullName(request.getFullName().trim());
        user.setDepartment(request.getDepartment().trim());
        user.setAcademicYear(request.getAcademicYear().trim());
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone().trim());
        }
        if (request.getProfileImageUrl() != null) {
            user.setProfileImageUrl(request.getProfileImageUrl());
        }
        user.setUpdatedAt(Instant.now());

        User updatedUser = userRepository.save(user);
        return UserResponse.fromUser(updatedUser, true);
    }
}
