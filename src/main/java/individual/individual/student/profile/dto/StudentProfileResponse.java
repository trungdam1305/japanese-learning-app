package individual.individual.student.profile.dto;

import individual.individual.user.JlptLevel;
import individual.individual.user.document.StudentUser;
import java.time.Instant;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StudentProfileResponse {
    private String id;
    private String username;
    private String fullName;
    private String email;
    private String avatarUrl;
    private JlptLevel currentLevel;
    private Instant quizSubscriptionExpiry;
    private int streakCount;
    private int rankPoints;

    public static StudentProfileResponse from(StudentUser student) {
        return StudentProfileResponse.builder()
                .id(student.getId())
                .username(student.getUsername())
                .fullName(student.getFullName())
                .email(student.getEmail())
                .avatarUrl(student.getAvatarUrl())
                .currentLevel(student.getCurrentLevel())
                .quizSubscriptionExpiry(student.getQuizSubscriptionExpiry())
                .streakCount(student.getStreakCount())
                .rankPoints(student.getRankPoints())
                .build();
    }
}
