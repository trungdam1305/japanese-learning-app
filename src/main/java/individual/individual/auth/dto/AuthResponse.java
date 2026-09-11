package individual.individual.auth.dto;

import individual.individual.user.UserRole;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String userId;
    private String username;
    private String fullName;
    private UserRole role;
}
