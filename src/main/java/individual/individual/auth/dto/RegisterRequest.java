package individual.individual.auth.dto;

import individual.individual.user.JlptLevel;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    @NotBlank(message = "Họ và tên không được để trống")
    @Pattern(regexp = "^[\\p{L} ]{5,30}$", message = "Họ và tên phải từ 5-30 ký tự, không chứa số hoặc ký tự đặc biệt")
    private String fullName;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    private String email;

    @NotBlank(message = "Username không được để trống")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[0-9])[a-z0-9._]{8,}$",
            message = "Username phải >= 8 ký tự, có chữ thường và số, chỉ được chứa '.' hoặc '_' làm ký tự đặc biệt")
    private String username;

    @NotBlank(message = "Password không được để trống")
    @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).{8,}$",
            message = "Password phải >= 8 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường và 1 chữ số")
    private String password;

    @NotNull(message = "Vui lòng chọn trình độ ban đầu (N5 hoặc N4)")
    private JlptLevel initialLevel;
}
