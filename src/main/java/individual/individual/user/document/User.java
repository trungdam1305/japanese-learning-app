package individual.individual.user.document;

import individual.individual.user.UserRole;
import individual.individual.user.UserStatus;
import java.time.Instant;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Base document cho cả Admin và Student, lưu chung collection "users" (phân biệt qua Spring Data
 * "_class" discriminator) để dùng chung logic đăng nhập/JWT/unique username-email.
 */
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@Document(collection = "users")
public abstract class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String username;

    @Indexed(unique = true)
    private String email;

    private String password;

    private String fullName;

    private String avatarUrl;

    private UserRole role;

    private UserStatus status;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
