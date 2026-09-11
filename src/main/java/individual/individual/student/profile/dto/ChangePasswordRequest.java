package individual.individual.student.profile.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordRequest {

    @NotBlank(message = "Vui lòng nhập mật khẩu hiện tại")
    private String oldPassword;

    @NotBlank(message = "Mật khẩu mới không được để trống")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).{8,}$",
            message = "Mật khẩu mới phải >= 8 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường và 1 chữ số")
    private String newPassword;
}
