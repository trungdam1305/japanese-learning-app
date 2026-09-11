package individual.individual.student.profile;

import individual.individual.common.exception.BadRequestException;
import individual.individual.common.exception.NotFoundException;
import individual.individual.common.exception.UnauthorizedException;
import individual.individual.student.profile.dto.ChangePasswordRequest;
import individual.individual.student.profile.dto.StudentProfileResponse;
import individual.individual.student.profile.dto.UpdateProfileRequest;
import individual.individual.user.StudentUserRepository;
import individual.individual.user.UserRepository;
import individual.individual.user.document.StudentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudentProfileService {

    private final StudentUserRepository studentUserRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentProfileResponse getProfile(String studentId) {
        return StudentProfileResponse.from(findStudentOrThrow(studentId));
    }

    public StudentProfileResponse updateProfile(String studentId, UpdateProfileRequest request) {
        StudentUser student = findStudentOrThrow(studentId);

        if (request.getUsername() != null && !request.getUsername().equals(student.getUsername())) {
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new BadRequestException("Username đã tồn tại");
            }
            student.setUsername(request.getUsername());
        }
        if (request.getFullName() != null) {
            student.setFullName(request.getFullName());
        }
        if (request.getAvatarUrl() != null) {
            student.setAvatarUrl(request.getAvatarUrl());
        }
        if (request.getCurrentLevel() != null) {
            student.setCurrentLevel(request.getCurrentLevel());
        }

        studentUserRepository.save(student);
        return StudentProfileResponse.from(student);
    }

    public void changePassword(String studentId, ChangePasswordRequest request) {
        StudentUser student = findStudentOrThrow(studentId);
        if (!passwordEncoder.matches(request.getOldPassword(), student.getPassword())) {
            throw new UnauthorizedException("Mật khẩu hiện tại không đúng");
        }
        student.setPassword(passwordEncoder.encode(request.getNewPassword()));
        studentUserRepository.save(student);
    }

    private StudentUser findStudentOrThrow(String studentId) {
        return studentUserRepository.findById(studentId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy học viên"));
    }
}
