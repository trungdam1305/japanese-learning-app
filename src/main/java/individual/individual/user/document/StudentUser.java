package individual.individual.user.document;

import individual.individual.user.JlptLevel;
import java.time.Instant;
import java.time.LocalDate;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.TypeAlias;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@TypeAlias("STUDENT")
public class StudentUser extends User {

    private JlptLevel currentLevel;

    /** Thời hạn hết hạn gói Quiz Premium (S5); null hoặc quá hạn = chưa/không còn quyền làm Quiz. */
    private Instant quizSubscriptionExpiry;

    private int streakCount;

    /** Ngày đăng nhập gần nhất, dùng để tính chuỗi streakCount. */
    private LocalDate lastLoginDate;

    private int rankPoints;
}
