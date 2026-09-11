package individual.individual.admin.account.dto;

import individual.individual.user.JlptLevel;
import individual.individual.user.UserStatus;
import individual.individual.user.document.StudentUser;
import java.time.Instant;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StudentAccountView {
    private String id;
    private String username;
    private String fullName;
    private String email;
    private JlptLevel currentLevel;
    private UserStatus status;
    private Instant quizSubscriptionExpiry;
    private int streakCount;
    private int rankPoints;
    private Instant createdAt;

    public static StudentAccountView from(StudentUser student) {
        return StudentAccountView.builder()
                .id(student.getId())
                .username(student.getUsername())
                .fullName(student.getFullName())
                .email(student.getEmail())
                .currentLevel(student.getCurrentLevel())
                .status(student.getStatus())
                .quizSubscriptionExpiry(student.getQuizSubscriptionExpiry())
                .streakCount(student.getStreakCount())
                .rankPoints(student.getRankPoints())
                .createdAt(student.getCreatedAt())
                .build();
    }
}
