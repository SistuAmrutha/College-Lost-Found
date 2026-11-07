package com.collegelostfound;

import com.collegelostfound.dto.AuthResponse;
import com.collegelostfound.dto.LoginRequest;
import com.collegelostfound.dto.RegisterRequest;
import com.collegelostfound.exception.BadRequestException;
import com.collegelostfound.exception.UnauthorizedException;
import com.collegelostfound.model.AccountStatus;
import com.collegelostfound.model.Role;
import com.collegelostfound.model.User;
import com.collegelostfound.repository.UserRepository;
import com.collegelostfound.security.JwtUtils;
import com.collegelostfound.security.UserPrincipal;
import com.collegelostfound.service.AuditLogService;
import com.collegelostfound.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private AuditLogService auditLogService;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setFullName("John Doe");
        registerRequest.setEmail("2X100X0XXX.edu.in");
        registerRequest.setCollegeId("2X100X0XXX");
        registerRequest.setDepartment("Computer Science");
        registerRequest.setAcademicYear("3rd Year");
        registerRequest.setPassword("Secret@123");
        registerRequest.setConfirmPassword("Secret@123");
    }

    @Test
    void register_Success() {
        when(userRepository.existsByEmail("john.doe@college.edu")).thenReturn(false);
        when(userRepository.existsByCollegeId("CS202699")).thenReturn(false);
        when(passwordEncoder.encode("Secret@123")).thenReturn("hashedPassword");

        User savedUser = new User("John Doe", "john.doe@college.edu", "CS202699", "Computer Science", "3rd Year", null, "hashedPassword", Role.ROLE_STUDENT);
        savedUser.setId("user123");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtUtils.generateToken("john.doe@college.edu", "user123", "ROLE_STUDENT")).thenReturn("fake-jwt-token");

        AuthResponse response = authService.register(registerRequest);

        assertNotNull(response);
        assertEquals("user123", response.getId());
        assertEquals("fake-jwt-token", response.getToken());
        assertEquals(Role.ROLE_STUDENT, response.getRole());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_PasswordMismatch_ThrowsBadRequest() {
        registerRequest.setConfirmPassword("DifferentPassword");

        assertThrows(BadRequestException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void register_DuplicateEmail_ThrowsBadRequest() {
        when(userRepository.existsByEmail("john.doe@college.edu")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void register_DuplicateCollegeId_ThrowsBadRequest() {
        when(userRepository.existsByEmail("john.doe@college.edu")).thenReturn(false);
        when(userRepository.existsByCollegeId("CS202699")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_Success() {
        LoginRequest loginRequest = new LoginRequest("john.doe@college.edu", "Secret@123");
        User user = new User("John Doe", "john.doe@college.edu", "CS202699", "Computer Science", "3rd Year", null, "hashedPassword", Role.ROLE_STUDENT);
        user.setId("user123");
        user.setAccountStatus(AccountStatus.ACTIVE);

        UserPrincipal principal = UserPrincipal.create(user);
        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(principal);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(userRepository.findById("user123")).thenReturn(Optional.of(user));
        when(jwtUtils.generateToken("john.doe@college.edu", "user123", "ROLE_STUDENT")).thenReturn("jwt-login-token");

        AuthResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertEquals("jwt-login-token", response.getToken());
        assertEquals("user123", response.getId());
    }

    @Test
    void login_SuspendedAccount_ThrowsUnauthorized() {
        LoginRequest loginRequest = new LoginRequest("john.doe@college.edu", "Secret@123");
        User user = new User("John Doe", "john.doe@college.edu", "CS202699", "Computer Science", "3rd Year", null, "hashedPassword", Role.ROLE_STUDENT);
        user.setId("user123");
        user.setAccountStatus(AccountStatus.SUSPENDED);

        UserPrincipal principal = UserPrincipal.create(user);
        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(principal);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(userRepository.findById("user123")).thenReturn(Optional.of(user));

        assertThrows(UnauthorizedException.class, () -> authService.login(loginRequest));
    }
}
