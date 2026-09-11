package individual.individual.admin.account.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ResetPasswordResponse {
    private String username;
    private String temporaryPassword;
}
