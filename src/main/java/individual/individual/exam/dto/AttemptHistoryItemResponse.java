package individual.individual.exam.dto;

import individual.individual.exam.document.QuizAttempt;
import individual.individual.user.JlptLevel;
import java.time.Instant;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AttemptHistoryItemResponse {
    private String attemptId;
    private String examTemplateName;
    private JlptLevel level;
    private int score;
    private int totalQuestions;
    private double scorePercentage;
    private boolean passed;
    private Instant submittedAt;

    public static AttemptHistoryItemResponse from(QuizAttempt attempt) {
        return AttemptHistoryItemResponse.builder()
                .attemptId(attempt.getId())
                .examTemplateName(attempt.getExamTemplateName())
                .level(attempt.getLevel())
                .score(attempt.getScore())
                .totalQuestions(attempt.getTotalQuestions())
                .scorePercentage(attempt.getScorePercentage())
                .passed(Boolean.TRUE.equals(attempt.getPassed()))
                .submittedAt(attempt.getSubmittedAt())
                .build();
    }
}
