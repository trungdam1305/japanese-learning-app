package individual.individual.exam.dto;

import individual.individual.exam.document.QuizAttempt;
import individual.individual.user.JlptLevel;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AttemptResultResponse {
    private String attemptId;
    private String examTemplateName;
    private JlptLevel level;
    private int score;
    private int totalQuestions;
    private double scorePercentage;
    private boolean passed;
    private long timeTakenSeconds;
    private List<AttemptQuestionReview> questions;

    public static AttemptResultResponse from(QuizAttempt attempt) {
        return AttemptResultResponse.builder()
                .attemptId(attempt.getId())
                .examTemplateName(attempt.getExamTemplateName())
                .level(attempt.getLevel())
                .score(attempt.getScore())
                .totalQuestions(attempt.getTotalQuestions())
                .scorePercentage(attempt.getScorePercentage())
                .passed(Boolean.TRUE.equals(attempt.getPassed()))
                .timeTakenSeconds(attempt.getTimeTakenSeconds())
                .questions(attempt.getQuestions().stream().map(AttemptQuestionReview::from).toList())
                .build();
    }
}
