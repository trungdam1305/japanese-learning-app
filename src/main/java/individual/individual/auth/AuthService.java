package individual.individual.auth;

import individual.individual.auth.dto.AuthResponse;
import individual.individual.auth.dto.LoginRequest;
import individual.individual.auth.dto.RegisterRequest;
import individual.individual.common.exception.BadRequestException;
import individual.individual.common.exception.UnauthorizedException;
import individual.individual.security.JwtService;
import individual.individual.security.UserPrincipal;
import individual.individual.user.UserRepository;
import individual.individual.user.UserRole;
import individual.individual.user.UserStatus;
import individual.individual.user.document.StudentUser;
import individual.individual.user.document.User;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username đã tồn tại");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email đã được sử dụng");
        }

        StudentUser student = StudentUser.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(UserRole.STUDENT)
                .status(UserStatus.ACTIVE)
                .currentLevel(request.getInitialLevel())
                .streakCount(1)
                .lastLoginDate(LocalDate.now())
                .rankPoints(0)
                .build();

        userRepository.save(student);
        return buildAuthResponse(student);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UnauthorizedException("Sai username hoặc password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Sai username hoặc password");
        }
        if (user.getStatus() == UserStatus.LOCKED || user.getStatus() == UserStatus.LOCKED_PENDING) {
            throw new UnauthorizedException("Tài khoản đang bị khóa, vui lòng liên hệ quản trị viên");
        }

        if (user instanceof StudentUser student) {
            updateStreak(student);
            userRepository.save(student);
        }

        return buildAuthResponse(user);
    }

    public AuthResponse refresh(String refreshToken) {
        if (!jwtService.isTokenValid(refreshToken)) {
            throw new UnauthorizedException("Refresh token không hợp lệ hoặc đã hết hạn");
        }
        String username = jwtService.extractUsername(refreshToken);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UnauthorizedException("Không tìm thấy người dùng"));
        return buildAuthResponse(user);
    }

    private void updateStreak(StudentUser student) {
        LocalDate today = LocalDate.now();
        LocalDate lastLogin = student.getLastLoginDate();

        if (lastLogin == null || lastLogin.isBefore(today.minusDays(1))) {
            student.setStreakCount(1);
        } else if (lastLogin.equals(today.minusDays(1))) {
            student.setStreakCount(student.getStreakCount() + 1);
        }
        // lastLogin.equals(today) -> đã tính streak hôm nay rồi, giữ nguyên
        student.setLastLoginDate(today);
    }

    private AuthResponse buildAuthResponse(User user) {
        UserPrincipal principal = new UserPrincipal(user);
        return AuthResponse.builder()
                .accessToken(jwtService.generateAccessToken(principal))
                .refreshToken(jwtService.generateRefreshToken(principal))
                .userId(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .role(user.getRole())
                .build();
    }
}
