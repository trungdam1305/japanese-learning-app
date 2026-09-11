package individual.individual.student.profile.dto;

import individual.individual.user.JlptLevel;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileRequest {

    @Pattern(regexp = "^(?=.*[a-z])(?=.*[0-9])[a-z0-9._]{8,}$",
            message = "Username phải >= 8 ký tự, có chữ thường và số, chỉ được chứa '.' hoặc '_' làm ký tự đặc biệt")
    private String username;

    @Pattern(regexp = "^[\\p{L} ]{5,30}$", message = "Họ và tên phải từ 5-30 ký tự, không chứa số hoặc ký tự đặc biệt")
    private String fullName;

    private String avatarUrl;

    private JlptLevel currentLevel;
}
