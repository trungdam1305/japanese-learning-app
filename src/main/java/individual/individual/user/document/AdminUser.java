package individual.individual.user.document;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.TypeAlias;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@TypeAlias("ADMIN")
public class AdminUser extends User {
}
