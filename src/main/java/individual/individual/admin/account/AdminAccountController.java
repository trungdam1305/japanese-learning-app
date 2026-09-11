package individual.individual.admin.account;

import individual.individual.admin.account.dto.LockAccountRequest;
import individual.individual.admin.account.dto.ResetPasswordResponse;
import individual.individual.admin.account.dto.StudentAccountView;
import individual.individual.common.ApiResponse;
import individual.individual.common.PageResponse;
import individual.individual.user.UserStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/students")
@RequiredArgsConstructor
public class AdminAccountController {

    private final AdminAccountService adminAccountService;

    @GetMapping
    public ApiResponse<PageResponse<StudentAccountView>> listStudents(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) UserStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ApiResponse.success(adminAccountService.listStudents(username, status, pageable));
    }

    @PatchMapping("/{id}/lock")
    public ApiResponse<StudentAccountView> lock(@PathVariable String id, @RequestBody(required = false) LockAccountRequest request) {
        String reason = request == null ? null : request.getReason();
        return ApiResponse.success("Đã khóa tài khoản", adminAccountService.lockAccount(id, reason));
    }

    @PatchMapping("/{id}/unlock")
    public ApiResponse<StudentAccountView> unlock(@PathVariable String id) {
        return ApiResponse.success("Đã mở khóa tài khoản", adminAccountService.unlockAccount(id));
    }

    @PostMapping("/{id}/reset-password")
    public ApiResponse<ResetPasswordResponse> resetPassword(@PathVariable String id) {
        return ApiResponse.success("Đã đặt lại mật khẩu", adminAccountService.resetPassword(id));
    }
}
