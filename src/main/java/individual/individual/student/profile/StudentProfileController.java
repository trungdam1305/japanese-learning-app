package individual.individual.student.profile;

import individual.individual.common.ApiResponse;
import individual.individual.security.UserPrincipal;
import individual.individual.student.profile.dto.ChangePasswordRequest;
import individual.individual.student.profile.dto.StudentProfileResponse;
import individual.individual.student.profile.dto.UpdateProfileRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/students/me")
@RequiredArgsConstructor
public class StudentProfileController {

    private final StudentProfileService studentProfileService;

    @GetMapping
    public ApiResponse<StudentProfileResponse> getProfile(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.success(studentProfileService.getProfile(principal.getId()));
    }

    @PutMapping
    public ApiResponse<StudentProfileResponse> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdateProfileRequest request) {
        return ApiResponse.success("Cập nhật hồ sơ thành công", studentProfileService.updateProfile(principal.getId(), request));
    }

    @PutMapping("/password")
    public ApiResponse<Void> changePassword(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ChangePasswordRequest request) {
        studentProfileService.changePassword(principal.getId(), request);
        return ApiResponse.success("Đổi mật khẩu thành công", null);
    }
}
